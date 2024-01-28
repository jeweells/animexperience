import { Optional } from '@shared/types'
import { VideoOption } from '@components/VideoPlayer/index'
import { $IframeContents, KnownOption } from '@components/VideoPlayer/types'
import { deepIframes } from '@components/VideoPlayer/utils'
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
    stape
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

const fembed: OptionFn = () => {
  return false
}

const okru: OptionFn = () => {
  return false
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
  const hasFailedText = iframe.find(':contains("server error occurred")').length > 0
  if (hasFailedText) console.debug('Stape skipped since text is shown')
  return hasFailedText
}

const isDocument = (iframe: $IframeContents[number]): iframe is Document => {
  if ('location' in iframe) return true
  return false
}

const streamtape: OptionFn = () => {
  return false
}
