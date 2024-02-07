import { session } from 'electron'
import { handleFailedVideoUrlsCompleted } from '../handleFailedVideoUrls'

export const onWebRequestCompleted = () => {
  session.defaultSession.webRequest.onCompleted((details) => {
    handleFailedVideoUrlsCompleted(details)
  })
}
