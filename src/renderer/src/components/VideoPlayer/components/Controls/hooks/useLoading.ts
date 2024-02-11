import { useEffect, useLayoutEffect, useState } from 'react'
import { useControls } from './useControls'

export const useLoading = () => {
  const { video } = useControls()

  const [loading, setLoading] = useState(true)

  useLayoutEffect(() => {
    if (video) return
    setLoading(true)
  }, [video])

  useEffect(() => {
    if (!video) return
    const seeking = () => {
      setLoading(video.seeking)
    }
    const seeked = () => {
      setLoading(video.seeking)
    }
    seeking()
    video.addEventListener('seeking', seeking)
    video.addEventListener('seeked', seeked)
    return () => {
      video.removeEventListener('seeking', seeking)
      video.removeEventListener('seeked', seeked)
    }
  }, [video])
  return {
    loading
  }
}
