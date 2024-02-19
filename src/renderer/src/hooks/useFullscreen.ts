import { useIsFullscreen } from './useIsFullscreen'
import { useCallback } from 'react'

export const useFullscreen = () => {
  const isFullscreen = useIsFullscreen()

  return {
    isFullscreen,
    toggleFullscreen: useCallback(() => {
      return window.setFullscreen(!isFullscreen)
    }, [isFullscreen])
  }
}
