import { session } from 'electron'
import { handleFailedVideoUrls } from '../handleFailedVideoUrls'

export const onWebRequestCompleted = () => {
  session.defaultSession.webRequest.onCompleted((details) => {
    handleFailedVideoUrls(details)
  })
}
