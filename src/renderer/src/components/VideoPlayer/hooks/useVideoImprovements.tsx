import { EpisodeInfo, Optional, Store } from '@shared/types'
import { useAppDispatch } from '~/redux/utils'
import { useStaticStore } from '~/src/hooks/useStaticStore'
import { useLayoutEffect } from 'react'
import { handleSeek } from '../seekHandlers'
import {
  CURRENT_TIME_SAVE_DELAY,
  RATIO_TO_FOLLOW_AN_ANIME,
  SECONDS_LEFT_TO_NEXT_EPISODE,
  SECONDS_LEFT_TO_TRIGGER_NEXT_EPISODE,
  SECONDS_NEXT_BUTTON_DISPLAY
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
      handleAutoNavigation(refs, video, anime)
      handleSaving(video, anime, delayed)
      handleFollow(refs, video)
    }
    const handleMouseMove = () => {
      if (refs.nextButtonShown) dispatch(watch.setNextEpisodeTimeout(-1))
    }
    document.addEventListener('mousemove', handleMouseMove)
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [video])
  return { video }
}

const canGoToNextEpisode = (video: HTMLVideoElement) => {
  const { duration, currentTime } = video
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

const autoGoToNextEpisode = () => {
  const _state = store.getState()
  const userMovedMouse = _state.watch.nextEpisodeTimeout === -1
  if (userMovedMouse) return false
  dispatch(watch.nextEpisode())
  dispatch(watch.setNextEpisodeButton(false))
  return true
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

const handleAutoNavigation = (
  refs: Refs,
  video: HTMLVideoElement,
  anime: Optional<RecentAnimeData>
) => {
  const { duration, currentTime } = video
  if (canGoToNextEpisode(video)) {
    if (!refs.watched) {
      refs.watched = true
      // At this time of the video, the video can be considered "watched"
      dispatch(watched.updateRecentlyWatched(anime))
    }
    const canAutomaticallyGoToNextEpisode =
      Math.max(0, duration - (currentTime + SECONDS_LEFT_TO_TRIGGER_NEXT_EPISODE)) === 0
    if (canAutomaticallyGoToNextEpisode) {
      if (autoGoToNextEpisode()) {
        refs.nextButtonShown = false
        return
      }
    }

    if (!refs.nextButtonShown) {
      refs.nextButtonShown = true
      dispatch(watch.setNextEpisodeButton(true))
      dispatch(watch.setNextEpisodeTimeout(SECONDS_NEXT_BUTTON_DISPLAY))
    }
  } else if (refs.nextButtonShown) {
    refs.nextButtonShown = false
    dispatch(watch.setNextEpisodeButton(false))
  }
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
