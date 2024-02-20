import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useControls } from './useControls'

const VOLUME_KEY = 'volume.previous'

const defaultVolume = 0.85

export const useVolume = () => {
  const { video } = useControls()
  const [volume, setVolume] = useState(() => {
    const value = localStorage.getItem(VOLUME_KEY)
    if (value === null) return defaultVolume
    const volume = Number(value)
    if (!isNaN(volume) && isFinite(volume)) return volume
    return defaultVolume
  })

  useEffect(() => {
    localStorage.setItem(VOLUME_KEY, String(volume))
  }, [volume])

  useLayoutEffect(() => {
    if (!video) return
    video.volume = volume
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
