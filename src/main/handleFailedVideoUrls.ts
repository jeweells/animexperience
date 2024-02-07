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
  ;[streamtape].forEach((handle) => {
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
  if (details.resourceType !== 'xhr') return
  if (!details.url.startsWith('https://streamtape.com/')) return
  getMainWindow()?.webContents.send(eventNames.videoUrlFailed, {
    option: 'streamtape',
    url: details.url
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
