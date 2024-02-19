import { VideoURLFailed } from '@shared/types'
import { getMainWindow } from './windows'
import { eventNames } from '@shared/constants'
import {
  OnCompletedListenerDetails,
  BeforeSendResponse,
  OnBeforeSendHeadersListenerDetails
} from 'electron'

type OnBeforeHeaders = (
  details: OnBeforeSendHeadersListenerDetails,
  callback: (beforeSendResponse: BeforeSendResponse) => void
) => boolean

export const handleFailedVideoUrlsCompleted = (details: OnCompletedListenerDetails) => {
  ;[streamtape, fembed].forEach((handle) => {
    handle(details)
  })
}

export const handleFailedVideoUrlsBeforeHeaders: OnBeforeHeaders = (details, callback) => {
  for (const handle of [yourupload]) {
    if (handle(details, callback)) return true
  }
  return false
}

const streamtape = (details: OnCompletedListenerDetails) => {
  if (details.statusCode !== 404) return
  if (!['xhr', 'subFrame'].includes(details.resourceType)) return
  if (!details.url.startsWith('https://streamtape.com/')) return

  getMainWindow()?.webContents.send(eventNames.videoUrlFailed, {
    option: 'streamtape',
    url: details.url
  } as VideoURLFailed)
}

const fembed = (details: OnCompletedListenerDetails) => {
  if (details.statusCode !== 522) return
  if (!['xhr', 'subFrame'].includes(details.resourceType)) return
  if (!details.url.startsWith('https://embedsito.com')) return

  getMainWindow()?.webContents.send(eventNames.videoUrlFailed, {
    option: 'fembed',
    url: 'chrome-error://chromewebdata/'
  } as VideoURLFailed)
}

const yourupload: OnBeforeHeaders = (details, callback) => {
  if (!details.url.includes('www.yourupload.com/embed/novideo.mp4')) return false
  callback({ cancel: true })
  getMainWindow()?.webContents.send(eventNames.videoUrlFailed, {
    option: 'yourupload',
    url: details.url
  } as VideoURLFailed)
  return true
}
