// Target must be iframe.contents() ... always
import $ from 'jquery'
import { Optional } from '@shared/types'
import { $IframeContents } from './types'

export function* deepIframes(
  target: $IframeContents,
  depth = 5,
  currDepth = 1
): Generator<$IframeContents> {
  if (!target || target.length === 0 || currDepth >= depth) return
  if (currDepth === 1) {
    yield target
  }
  const iframes = target
    .find('iframe')
    .get()
    .map((x) => $(x).contents())
  for (const iframe of iframes) {
    yield iframe
  }
  for (const iframe of iframes) {
    for (const t of deepIframes(iframe, depth, currDepth + 1)) {
      yield t
    }
  }
}

// The array returned will always be of length greater than 0
export const deepFindVideos = (
  target: $IframeContents,
  depth = 5
): Optional<HTMLVideoElement[]> => {
  for (const iframe of deepIframes(target, depth)) {
    const video = iframe.find('video')
    if (video.length > 0) {
      return video.get()
    }
  }
  return
}
