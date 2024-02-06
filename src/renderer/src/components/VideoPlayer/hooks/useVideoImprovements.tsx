import { EpisodeInfo, Optional, Store } from '@shared/types'
import { useAppDispatch } from '~/redux/utils'
import { useStaticStore } from '~/src/hooks/useStaticStore'
import { useLayoutEffect } from 'react'
import { handleSeek } from '../seekHandlers'
import {
  CURRENT_TIME_SAVE_DELAY,
  RATIO_TO_FOLLOW_AN_ANIME,
  SECONDS_LEFT_TO_NEXT_EPISODE
} from '../constants'
import { followedAnimes, watch, watched } from '@reducers'
import store from '~/redux/store'
import { UseVideoArgs, useVideo } from './useVideo'
import { dispatch } from '~/redux/dispatch'
import { RecentAnimeData } from '~/src/hooks/useRecentAnimes'
import { debug } from '@dev/events'

type Refs = Partial<{
  nextButtonShown: boolean
  nextBtnRef: JQuery | null
  watched: boolean
  followed: boolean
}>

export const useVideoImprovements = ({ info, container, onOptionNotFound, ms }: UseVideoArgs) => {
  const video = useVideo({ info, container, onOptionNotFound, ms })
  const dispatch = useAppDispatch()
  const staticStore = useStaticStore(Store.WATCHED)

  useLayoutEffect(() => {
    if (!video) return
    if (!video.autoplay) {
      video.autoplay = true
    }
    const anime = info.anime
    if (anime) {
      staticStore.get(anime.name, anime.episode).then((data: Optional<EpisodeInfo>) => {
        // Try autoplay the video at latest time stored
        handleSeek(info, data, video)
      })
    }
    const refs: Refs = {}

    const delayed = withDelay(CURRENT_TIME_SAVE_DELAY)
    const handleTimeUpdate = () => {
      if (!isFinite(video.duration)) return
      handleWatchedDetector(refs, video, anime)
      handleSaving(video, anime, delayed)
      handleFollow(refs, video)
    }
    const handleVideoEnded = () => {
      dispatch(watch.nextEpisode())
    }
    video.addEventListener('ended', handleVideoEnded)
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleVideoEnded)
    }
  }, [video])
  return { video }
}

export const canGoToNextEpisode = (time: { duration: number; currentTime: number }) => {
  const { duration, currentTime } = time
  return currentTime + SECONDS_LEFT_TO_NEXT_EPISODE >= duration
}

const canTrackUpdatesOfThisAnime = (video: HTMLVideoElement) => {
  const { duration, currentTime } = video
  const currentTimeRatio = duration === 0 ? 0 : currentTime / duration
  return currentTimeRatio >= RATIO_TO_FOLLOW_AN_ANIME
}

const handleFollow = (refs: Refs, video: HTMLVideoElement) => {
  if (refs.followed || !canTrackUpdatesOfThisAnime(video)) return
  const watchState = store.getState().watch
  if (!(watchState.info && watchState.watching)) return
  debug('Marking this anime as followed')
  store.dispatch(
    followedAnimes.follow({
      anime: watchState.watching,
      info: watchState.info
    })
  )
  refs.followed = true
}

const withDelay = <T extends () => void>(delay: number) => {
  let canCall = true
  let lastCallback: T | null
  return (callback: T) => {
    lastCallback = callback

    if (!canCall) return

    lastCallback()
    lastCallback = null
    canCall = false

    setTimeout(() => {
      lastCallback?.()
      lastCallback = null
      canCall = true
    }, delay)
  }
}

const handleWatchedDetector = (
  refs: Refs,
  video: HTMLVideoElement,
  anime: Optional<RecentAnimeData>
) => {
  if (!canGoToNextEpisode(video)) return
  if (refs.watched) return
  refs.watched = true
  dispatch(watched.updateRecentlyWatched(anime))
}

const handleSaving = (
  video: HTMLVideoElement,
  anime: Optional<RecentAnimeData>,
  delayed: ReturnType<typeof withDelay>
) => {
  const canBeSaved = anime && anime.name && typeof anime.episode === 'number'
  if (!canBeSaved) return

  const { duration, currentTime } = video
  const at = new Date().getTime()
  delayed(() => {
    dispatch(
      watched.updateWatched({
        anime,
        info: {
          duration,
          currentTime,
          at
        }
      })
    )
  })
}
