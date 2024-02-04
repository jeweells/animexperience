import { session } from 'electron'
import { PUBLIC_PATH } from '../constants'
import { debug } from '@dev'

export const onBeforeSendHeaders = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders(async (details, callback) => {
    debug('onBeforeHeaders', details.url)

    if (
      ['https://jkanime.net/', 'https://www3.animeflv.net/', 'https://animeflv.net/'].some((u) =>
        details.url.startsWith(u)
      )
    ) {
      const url = new URL(details.url)
      details.requestHeaders.Origin = url.origin
      if (
        !details.url.includes(PUBLIC_PATH) &&
        details.requestHeaders.Referer &&
        details.requestHeaders.Referer.includes(PUBLIC_PATH)
      ) {
        details.requestHeaders.Referer = details.url
        debug('ADDED REFERER FOR', details.url)
      }
    }
    return callback({ cancel: false, requestHeaders: details.requestHeaders })
  })
}
