import { eventNames } from '@shared/constants'
import { useLayoutEffect } from 'react'
import { create } from 'zustand'
import { VideoURLFailed } from '@shared/types'
import { error } from '@dev/events'

const ipcRenderer = window.electron.ipcRenderer

const useVideoURLFailed = create(() => ({
  failedUrls: [] as VideoURLFailed[]
}))

const get = useVideoURLFailed.getState
const set = useVideoURLFailed.setState

export const urlHasFailed = (url: string) => {
  console.log('Checking if failed:', url)
  const failedUrl = get().failedUrls.find((info) => info.url === url)
  if (!failedUrl) return false
  set({ failedUrls: get().failedUrls.filter((info) => info !== failedUrl) })
  return true
}

export const useVideoURLFailedListener = () => {
  useLayoutEffect(() => {
    return ipcRenderer.on(eventNames.videoUrlFailed, (_info, args: VideoURLFailed) => {
      error('Got new url failed', args)
      set({ failedUrls: [...get().failedUrls, args] })
    })
  }, [])
}
