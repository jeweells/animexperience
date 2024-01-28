import { VideoURLFailed } from '@shared/types'
import { WebRequest } from 'electron'
import { getMainWindow } from './windows'
import { eventNames } from '@shared/constants'

export const handleFailedVideoUrls = (webRequest: WebRequest) => {
  ;[streamtape].forEach((handle) => {
    handle(webRequest)
  })
  streamtape(webRequest)
}

const streamtape = (webRequest: WebRequest) => {
  webRequest.onCompleted(
    {
      urls: ['https://streamtape.com/*'],
      types: ['xhr']
    },
    (a) => {
      getMainWindow()?.webContents.send(eventNames.videoUrlFailed, {
        option: 'streamtape',
        url: a.url
      } as VideoURLFailed)
    }
  )
}
