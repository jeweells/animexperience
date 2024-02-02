import { VideoURLFailed } from '@shared/types'
import { getMainWindow } from './windows'
import { eventNames } from '@shared/constants'
import { OnCompletedListenerDetails } from 'electron'

export const handleFailedVideoUrls = (details: OnCompletedListenerDetails) => {
  ;[streamtape].forEach((handle) => {
    handle(details)
  })
}

const streamtape = (details: OnCompletedListenerDetails) => {
  if (details.resourceType !== 'xhr') return
  if (!details.url.startsWith('https://streamtape.com/')) return
  getMainWindow()?.webContents.send(eventNames.videoUrlFailed, {
    option: 'streamtape',
    url: details.url
  } as VideoURLFailed)
}
