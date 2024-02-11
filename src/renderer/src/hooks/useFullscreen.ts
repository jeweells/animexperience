import { useIsFullscreen } from './useIsFullscreen'

export const useFullscreen = () => {
  const isFullscreen = useIsFullscreen()

  return {
    isFullscreen,
    toggleFullscreen: () => {
      return window.setFullscreen(!isFullscreen)
    }
  }
}
