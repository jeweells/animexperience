import { useIsFullscreen } from './useIsFullscreen'
import { useCallback } from 'react'

export const useFullscreen = () => {
  const isFullscreen = useIsFullscreen()

  return {
    isFullscreen,
    exitFullscreen: useCallback(() => {
      if (!isFullscreen) return
      return window.setFullscreen(false)
    }, [isFullscreen]),
    toggleFullscreen: useCallback(() => {
      return window.setFullscreen(!isFullscreen)
    }, [isFullscreen])
  }
}
