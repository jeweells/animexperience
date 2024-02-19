import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useControls } from './useControls'

export const useVolume = () => {
  const { video } = useControls()
  const [volume, setVolume] = useState(0)
  useLayoutEffect(() => {
    if (video) return
    setVolume(0)
  }, [video])

  useEffect(() => {
    if (!video) return
    const updateVolume = () => {
      setVolume(video.volume)
    }
    updateVolume()
    video.addEventListener('volumechange', updateVolume)
    return () => {
      video.removeEventListener('volumechange', updateVolume)
    }
  }, [video])
  return {
    volume,
    setVolume: useCallback(
      (value: number) => {
        if (!video) return
        video.volume = value
        setVolume(value)
      },
      [video]
    )
  }
}
