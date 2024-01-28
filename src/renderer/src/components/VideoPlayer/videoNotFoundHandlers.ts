import { Optional } from '@shared/types'
import { VideoOption } from '@components/VideoPlayer/index'
import { $IframeContents, KnownOption } from '@components/VideoPlayer/types'
import { deepIframes } from '@components/VideoPlayer/utils'
import $ from 'jquery'
import { urlHasFailed } from '~/src/hooks/useVideoURLFailed'

type OptionFn = (contents: $IframeContents) => boolean

export const optionNotLongerAvailable = (
  option: Optional<VideoOption>,
  contents: $IframeContents
) => {
  const methods: Partial<Record<KnownOption, OptionFn>> = {
    fembed,
    okru,
    mixdrop,
    streamtape,
    stape,
    maru,
    mega,
    sw,
    yourupload
  }
  const handler = methods[option?.name?.toLowerCase() ?? '']
  if (!handler) return false
  for (const iframe of deepIframes(contents)) {
    if (handler(iframe)) {
      return true
    }
  }
  return false
}

const fembed: OptionFn = (iframe) => {
  return _checkText(iframe, 'Fembed', 'could not be found')
}

const maru: OptionFn = (iframe) => {
  return _checkText(iframe, 'Maru', 'not available')
}

const okru: OptionFn = (iframe) => {
  return _checkText(iframe, 'Okru', 'not been found')
}
const mixdrop: OptionFn = () => {
  return false
}
const stape: OptionFn = (iframe) => {
  const _document = iframe[0]
  if (isDocument(_document) && urlHasFailed(_document.location.href)) {
    console.debug('Stape skipped since URL failed')
    return true
  }
  return _checkText(iframe, 'Streamtape', 'server error occurred')
}

const isDocument = (iframe: $IframeContents[number]): iframe is Document => {
  return 'location' in iframe
}

const streamtape: OptionFn = () => {
  return false
}

const mega: OptionFn = (iframe) => {
  return _checkText(iframe, 'Mega', 'no longer accessible')
}
const sw: OptionFn = (iframe) => {
  return _checkText(iframe, 'SW', 'Not Found')
}

const yourupload: OptionFn = (iframe) => {
  return _checkText(iframe, 'YourUpload', 'File not found')
}

const _checkText = (iframe: $IframeContents, optionName: string, text: string) => {
  const hasFailedText =
    iframe.filter(function () {
      return new RegExp(text, 'i').test($(this).text())
    }).length > 0
  if (hasFailedText) console.debug(`${optionName} skipped since text is shown`)
  return hasFailedText
}
