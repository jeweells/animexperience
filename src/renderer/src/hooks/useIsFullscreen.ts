import { useSyncExternalStore } from 'react'

const subscribe = (callback: () => void) => {
  document.addEventListener('fullscreenchange', callback)
  return () => {
    document.removeEventListener('fullscreenchange', callback)
  }
}

const getSnapshot = () => !!document.fullscreenElement

export const useIsFullscreen = () => {
  return useSyncExternalStore(subscribe, getSnapshot)
}
