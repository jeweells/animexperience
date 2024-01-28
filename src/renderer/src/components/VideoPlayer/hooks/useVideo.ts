import { BasicVideoInfo } from '@components/VideoPlayer/types'
import { Optional } from '@shared/types'
import { useLayoutEffect, useState } from 'react'
import { useAppSelector } from '~/redux/utils'
import { useWatched } from '~/src/hooks/useWatched'
import $ from 'jquery'
import { polling } from '~/src/utils'
import { handleSpecificOptions } from '@components/VideoPlayer/autoPlayHandlers'
import { deepFindVideo } from '@components/VideoPlayer/utils'

export const useVideo = (info: BasicVideoInfo, container: Optional<HTMLDivElement>, ms = 300) => {
  const [video, setVideo] = useState<Optional<HTMLVideoElement>>(null)
  const [detachedVideo, setDetachedVideo] = useState<Optional<HTMLVideoElement>>(null)
  const watchEpisodeStatus = useAppSelector((d) => d.watch.status.watchEpisode)
  const episodeInfo = useWatched(info.anime)

  useLayoutEffect(() => {
    if (!video) return
    const jTargetVideo = $(video)
    jTargetVideo.on('DOMNodeRemoved', () => {
      if (jTargetVideo.parent().length !== 0) return
      console.debug('VIDEO DETACHED')
      setDetachedVideo(video)
    })
    return () => {
      jTargetVideo.off('DOMNodeRemoved')
    }
  }, [video])

  useLayoutEffect(() => {
    if (!(watchEpisodeStatus === 'succeeded' && container && episodeInfo !== null)) return
    const iframeContent = $(container).find('iframe')
    return polling(
      {
        handledSpecificOptions: false
      },
      (data, stop) => {
        const contents = iframeContent.contents()
        if (!data.handledSpecificOptions) {
          data.handledSpecificOptions = handleSpecificOptions(info.option, contents, episodeInfo)
        }
        const targetVideo = deepFindVideo(contents)
        if (!targetVideo) return data
        setVideo(targetVideo)
        return stop()
      },
      ms
    )
  }, [
    info.anime?.name,
    info.anime?.episode,
    info.option?.name,
    container,
    ms,
    detachedVideo,
    episodeInfo === null,
    watchEpisodeStatus
  ])
  return video
}
