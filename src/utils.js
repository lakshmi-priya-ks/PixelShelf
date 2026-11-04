const IMAGE_EXTENSIONS =
  /\.(jpe?g|png|gif|webp|bmp|avif|svg|tiff?)$/i

export function isImage(file) {
  return (
    file.type.startsWith('image/') ||
    IMAGE_EXTENSIONS.test(file.name)
  )
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export function getFolderName(files) {
  return (
    files[0]?.webkitRelativePath?.split('/')[0] ||
    'Selected folder'
  )
}