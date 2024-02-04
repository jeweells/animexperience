import $ from 'jquery'
import { EpisodeInfo } from '@shared/types'
import { Optional } from '@shared/types'
import { VideoOption } from './index'
import { $IframeContents, KnownOption } from './types'
import { deepIframes } from './utils'
import { debug, error } from '@dev/events'

export const initializePlayerOption = (
  option: Optional<VideoOption>,
  contents: $IframeContents,
  episodeInfo: Optional<EpisodeInfo>
): boolean => {
  const methods: Partial<
    Record<KnownOption, (contents: $IframeContents, episodeInfo?: Optional<EpisodeInfo>) => boolean>
  > = {
    fembed,
    okru,
    mixdrop,
    streamtape,
    stape: streamtape,
    mega
  }
  const handler = methods[option?.name?.toLowerCase() ?? '']
  if (!handler) return false
  for (const iframe of deepIframes(contents)) {
    if (handler(iframe, episodeInfo)) {
      return true
    }
  }
  return false
}

export const streamtape = (iframe: $IframeContents) => {
  const adOverlay = iframe.find('.plyr-container > .plyr-overlay')
  if (adOverlay.length > 0) {
    if (adOverlay.css('display') !== 'none') {
      adOverlay.trigger('click')
    }
  }
  return false
}

export const mega = (iframe: $IframeContents) => {
  const playBtn = iframe.find('.play-video-button')
  if (!playBtn.length) return false
  playBtn.trigger('click')
  return true
}

export const fembed = (iframe: $IframeContents) => {
  debug('Fembed: Clicking play button')
  const playBtn = iframe.find('.faplbu')
  if (playBtn.length > 0) {
    debug('GOT', playBtn)
    playBtn.trigger('click')
    return true
  }
  return false
}
export const okru = (iframe: $IframeContents, episodeInfo?: Optional<EpisodeInfo>) => {
  debug('Okru: Clicking play button')
  const playBtn = iframe.find('div#embedVideoC.vid-card_cnt_w')
  if (playBtn.length > 0) {
    const video = iframe.find('video')
    if (video.length === 0) {
      // I need to inject the function that returns the current time of the video from the localStorage
      // (On load time in the current source will be stored on a variable, and it's useless to change the
      // localStorage again) Okru will automatically handle playing it at the corresponding time
      if (episodeInfo && 'currentTime' in episodeInfo) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const targetWindow = iframe[0]?.defaultView
        const targetStorage = targetWindow?.OK?.VideoPlayer?.storage
        const targetFn = targetStorage?.getMovieLastPlayingTime
        const targetPlayer = iframe.find('div[data-module=OKVideo]')
        debug('Target player; Target storage', targetStorage)
        if (!(targetStorage && targetPlayer.length > 0)) return false

        if (!targetFn?.injected) {
          const dataOptionsStr = targetPlayer.attr('data-options')
          if (dataOptionsStr) {
            try {
              const dataOptions = JSON.parse(dataOptionsStr)
              if (dataOptions?.flashvars) {
                // By default, is 0.85, so we wouldn't be able to automatically seek after that certain
                // point of the video
                dataOptions.flashvars.notSavePositionAfter = 1
                debug('Injecting data options; notSavePositionAfter=1')
              }
              targetPlayer.attr('data-options', JSON.stringify(dataOptions))
            } catch (e) {
              error(e)
            }
          }
          const idRegex = /\/([0-9]+)\/?$/
          const url = targetWindow?.location.href
          const videoId = idRegex.exec(url ?? '')?.[1]
          debug('VideoId', videoId)
          if (videoId) {
            targetStorage.getMovieLastPlayingTime = (n: string) => {
              debug('CHECKING', n, videoId, videoId === n, typeof n, episodeInfo)
              if (videoId === n) {
                debug('CHECKING:: RETURN', episodeInfo, episodeInfo.currentTime)
                return episodeInfo.currentTime
              }
              return targetFn(n)
            }
            targetStorage.getMovieLastPlayingTime.injected = true
          }
        }
      }
      debug('GOT', playBtn)
      playBtn.trigger('click')
      // Let it spam or else it won't work
      return false
    }
  }
  return false
}
export const mixdrop = (iframe: $IframeContents) => {
  let adClicked = false
  for (const adClick of iframe.find('div[onclick]').get()) {
    const onclick = adClick.getAttribute('onclick')
    if (onclick && onclick.includes('$(this).remove()')) {
      $(adClick).trigger('click')
      adClicked = true
    }
  }
  if (!adClicked) {
    iframe.find('button.vjs-big-play-button').trigger('click')
  }
  return false
}
