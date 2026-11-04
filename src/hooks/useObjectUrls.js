import { useCallback, useEffect, useRef } from 'react'

export default function useObjectUrls() {
  const urlCache = useRef(new Map())

  const getUrl = useCallback((file) => {
    if (!urlCache.current.has(file)) {
      const url = URL.createObjectURL(file)
      urlCache.current.set(file, url)
    }

    return urlCache.current.get(file)
  }, [])

  const clearUrls = useCallback(() => {
    urlCache.current.forEach((url) => {
      URL.revokeObjectURL(url)
    })

    urlCache.current.clear()
  }, [])

  useEffect(() => {
    return () => clearUrls()
  }, [clearUrls])

  return {
    getUrl,
    clearUrls,
  }
}
