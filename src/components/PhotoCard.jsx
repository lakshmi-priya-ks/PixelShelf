import { memo } from 'react'

function PhotoCard({ columnIndex, rowIndex, style, data }) {
  const index = rowIndex * data.columns + columnIndex
  const photo = data.photos[index]

  if (!photo) return null

  return (
    <div style={style} className="grid-cell">
      <button
        className="photo-card"
        onClick={() => data.onOpen(index)}
        title={photo.name}
      >
        <img
          src={data.getUrl(photo)}
          alt={photo.name}
          loading="lazy"
          draggable="false"
        />

        <span className="photo-name">
          {photo.name}
        </span>
      </button>
    </div>
  )
}

export default memo(PhotoCard)