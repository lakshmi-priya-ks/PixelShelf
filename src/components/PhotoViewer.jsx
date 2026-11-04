import { useEffect, useState } from 'react'

import {
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react'

import { formatBytes } from '../utils'

export default function PhotoViewer({
  photos,
  index,
  getUrl,
  onClose,
  onChange
}) {
  const [dimensions, setDimensions] = useState(null)

  const photo = photos[index]

  useEffect(() => {
    setDimensions(null)

    if (!photo) return

    const image = new Image()

    image.onload = () => {
      setDimensions(
        `${image.naturalWidth} × ${image.naturalHeight}`
      )
    }

    image.src = getUrl(photo)
  }, [photo, getUrl])

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }

      if (event.key === 'ArrowLeft') {
        onChange(Math.max(0, index - 1))
      }

      if (event.key === 'ArrowRight') {
        onChange(Math.min(photos.length - 1, index + 1))
      }
    }

    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [index, photos.length, onChange, onClose])

  if (!photo) return null

  return (
    <div
      className="viewer-backdrop"
      onMouseDown={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <header className="viewer-top">
        <div className="viewer-title">
          <ImageIcon size={18} />
          <span>{photo.name}</span>
          <small>
            {index + 1} / {photos.length}
          </small>
        </div>

        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close viewer"
        >
          <X />
        </button>
      </header>

      <button
        className="viewer-arrow left"
        disabled={index === 0}
        onClick={() => onChange(index - 1)}
        aria-label="Previous photo"
      >
        <ChevronLeft />
      </button>

      <div className="viewer-image-wrap">
        <img
          className="viewer-image"
          src={getUrl(photo)}
          alt={photo.name}
        />
      </div>

      <button
        className="viewer-arrow right"
        disabled={index === photos.length - 1}
        onClick={() => onChange(index + 1)}
        aria-label="Next photo"
      >
        <ChevronRight />
      </button>

      <aside className="metadata">
        <p className="eyebrow">IMAGE DETAILS</p>

        <h3>{photo.name}</h3>

        <div className="metadata-row">
          <span>Dimensions</span>
          <strong>{dimensions || 'Loading...'}</strong>
        </div>

        <div className="metadata-row">
          <span>File size</span>
          <strong>{formatBytes(photo.size)}</strong>
        </div>

        <div className="metadata-row">
          <span>Format</span>
          <strong>{photo.type || 'Image'}</strong>
        </div>

        <div className="metadata-row">
          <span>Modified</span>
          <strong>
            {new Date(photo.lastModified).toLocaleDateString()}
          </strong>
        </div>

        <p className="keyboard-hint">
          Use ← → to navigate · Esc to close
        </p>
      </aside>
    </div>
  )
}