import { session } from 'electron'
import { ANIMEFLV_URL_REGEX, PUBLIC_PATH } from '../constants'
import { handleFailedVideoUrlsBeforeHeaders } from '../handleFailedVideoUrls'

export const onBeforeSendHeaders = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders(async (details, callback) => {
    if (handleFailedVideoUrlsBeforeHeaders(details, callback)) return
    if ([/^https:\/\/jkanime\.net\//, ANIMEFLV_URL_REGEX].some((u) => !!details.url.match(u))) {
      const url = new URL(details.url)
      details.requestHeaders.Origin = url.origin
      if (
        !details.url.includes(PUBLIC_PATH) &&
        details.requestHeaders.Referer &&
        details.requestHeaders.Referer.includes(PUBLIC_PATH)
      ) {
        details.requestHeaders.Referer = details.url
      }
    }
    return callback({ cancel: false, requestHeaders: details.requestHeaders })
  })
}
