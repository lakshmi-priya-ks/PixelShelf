import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { FixedSizeGrid as Grid } from 'react-window'

import { FolderOpen, Images, HardDrive, LayoutGrid, ShieldCheck, Search } from 'lucide-react'

import PhotoCard from './components/PhotoCard'
import PhotoViewer from './components/PhotoViewer'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'

import useObjectUrls from './hooks/useObjectUrls'

import { isImage, getFolderName } from './utils'

const CELL_WIDTH = 190
const CELL_HEIGHT = 178

export default function App() {
  const inputRef = useRef(null)

  const { getUrl, clearUrls } = useObjectUrls()

  const [photos, setPhotos] = useState([])
  const [folderName, setFolderName] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('name')
  const [viewerIndex, setViewerIndex] = useState(null)
  const [columns, setColumns] = useState(4)

  const [gridSize, setGridSize] = useState({
    width: 900,
    height: 500,
  })

  const [renderedCount, setRenderedCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [nonImageCount, setNonImageCount] = useState(0)
  const [error, setError] = useState('')

  const handleFolder = (event) => {
    const selected = Array.from(event.target.files || [])

    if (!selected.length) return

    setLoading(true)
    setError('')
    setViewerIndex(null)

    clearUrls()

    setTimeout(() => {
      const imageFiles = selected.filter(isImage)

      imageFiles.sort((a, b) => a.name.localeCompare(b.name))

      setPhotos(imageFiles)
      setFolderName(getFolderName(selected))
      setNonImageCount(selected.length - imageFiles.length)

      setQuery('')
      setSort('name')
      setRenderedCount(0)
      setLoading(false)

      if (!imageFiles.length) {
        setError('No supported image files were found.')
      }
    }, 25)

    event.target.value = ''
  }

  const visiblePhotos = useMemo(() => {
    const result = photos.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()))

    if (sort === 'size') {
      result.sort((a, b) => b.size - a.size)
    } else if (sort === 'newest') {
      result.sort((a, b) => b.lastModified - a.lastModified)
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [photos, query, sort])

  const openPhoto = useCallback((index) => {
    setViewerIndex(index)
  }, [])

  const changePhoto = useCallback((index) => {
    setViewerIndex(index)
  }, [])

  const closeViewer = useCallback(() => {
    setViewerIndex(null)
  }, [])

  const itemData = useMemo(
    () => ({
      photos: visiblePhotos,
      getUrl,
      onOpen: openPhoto,
      columns,
    }),
    [visiblePhotos, getUrl, openPhoto, columns]
  )

  useEffect(() => {
    const update = () => {
      const width = Math.max(300, window.innerWidth - (window.innerWidth > 760 ? 324 : 96))

      const height = Math.max(260, window.innerHeight - 240)

      const count = Math.max(1, Math.floor((width - 20) / CELL_WIDTH))

      setGridSize({ width, height })
      setColumns(count)
    }

    update()

    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('resize', update)
    }
  }, [])

  const handleRendered = ({ visibleRowStartIndex, visibleRowStopIndex }) => {
    const visibleRows = Math.max(0, visibleRowStopIndex - visibleRowStartIndex + 1)

    setRenderedCount(Math.min(visiblePhotos.length, (visibleRows + 4) * columns))
  }

  return (
    <div className="app-shell">
      <Sidebar photoCount={photos.length} />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR PERSONAL LIBRARY</p>
            <h1>{folderName || 'Photo Library'}</h1>
          </div>

          <button className="select-button" onClick={() => inputRef.current?.click()}>
            <FolderOpen size={17} />
            Select folder
          </button>

          <input
            ref={inputRef}
            className="hidden-input"
            type="file"
            multiple
            webkitdirectory=""
            onChange={handleFolder}
          />
        </header>

        {photos.length > 0 && (
          <Toolbar query={query} setQuery={setQuery} sort={sort} setSort={setSort} />
        )}

        {!photos.length && !loading ? (
          <section className="welcome">
            <div className="welcome-icon">
              <Images size={34} />
            </div>

            <p className="eyebrow">A CALMER WAY TO BROWSE</p>

            <h2>Your photos, all in one place.</h2>

            <p className="welcome-copy">
              Choose a folder on your computer to explore your photo collection. Your files remain
              private and are never uploaded.
            </p>

            <button className="select-button large" onClick={() => inputRef.current?.click()}>
              <FolderOpen size={18} />
              Choose a photo folder
            </button>

            <div className="welcome-note">
              <ShieldCheck size={15} />
              Local-only · No account · No uploads
            </div>

            {error && <p className="error-message">{error}</p>}
          </section>
        ) : loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Reading your photo folder...</p>
          </div>
        ) : (
          <>
            <section className="stats-row">
              <div className="stat">
                <Images size={17} />

                <span>
                  <strong>{visiblePhotos.length.toLocaleString()}</strong>
                  photos
                </span>
              </div>

              <div className="stat">
                <LayoutGrid size={17} />

                <span>
                  <strong>{renderedCount.toLocaleString()}</strong>
                  estimated rendered
                </span>
              </div>

              <div className="stat">
                <HardDrive size={17} />

                <span>
                  <strong>{nonImageCount.toLocaleString()}</strong>
                  other files skipped
                </span>
              </div>
            </section>

            {error && <p className="error-message">{error}</p>}

            {visiblePhotos.length ? (
              <div className="grid-wrap">
                <Grid
                  columnCount={columns}
                  columnWidth={CELL_WIDTH}
                  height={gridSize.height}
                  rowCount={Math.ceil(visiblePhotos.length / columns)}
                  rowHeight={CELL_HEIGHT}
                  width={gridSize.width}
                  itemData={itemData}
                  onItemsRendered={handleRendered}
                  overscanRowCount={2}
                >
                  {PhotoCard}
                </Grid>
              </div>
            ) : (
              <div className="no-results">
                <Search size={25} />
                <h3>No matching photos</h3>
                <p>Try another filename or clear your search.</p>
              </div>
            )}

            <footer className="content-footer">
              <span>
                Showing {visiblePhotos.length.toLocaleString()} of {photos.length.toLocaleString()}{' '}
                photos
              </span>

              <span>Virtualized grid · Local processing</span>
            </footer>
          </>
        )}
      </main>

      {viewerIndex !== null && (
        <PhotoViewer
          photos={visiblePhotos}
          index={viewerIndex}
          getUrl={getUrl}
          onClose={closeViewer}
          onChange={changePhoto}
        />
      )}
    </div>
  )
}
