import { FStatus, Optional, TopView } from '@shared/types'
import {
  AnimeInfo,
  DeepAnimeIdSearchResult,
  EpisodeInfo,
  FollowedAnime,
  RecentAnimeInfo,
  RecommendationInfo,
  WatchHistoryItem
} from '@shared/types'
import { FollowedAnimeWStatus } from '../reducers/followedAnimes'
import { PreAllowWatch } from '../reducers/invokedLink'
import { RecentAnimeData } from '~/src/hooks'
import { VideoOption } from '../../src/components/VideoPlayer'
import { playerOptionsSchema } from '@shared/schemas'
import { z } from 'zod'

export type AnimeSearchState = {
  // Boolean id
  searching?: string
  result?: Optional<DeepAnimeIdSearchResult>
  status: Partial<{
    result: FStatus
    moreResults: FStatus
  }>
}

export type FollowedAnimesState = {
  followedDict: Record<string, FollowedAnime>
  followed: FollowedAnimeWStatus[]
  status: Partial<{
    followed: FStatus
  }>
}

export type InvokedLinkState = {
  open: {
    watch?: string
  }
  preAllow: Partial<{
    watch: PreAllowWatch
  }>
  status: {
    watch?: FStatus
  }
}

export type NotificationsState = {
  message: string | null
  key: string
}

export type PeekState = {
  name?: string
  status: Partial<{
    info: FStatus
  }>
  info?: Optional<AnimeInfo>
  peeking?: string
}

export type PlayerState = {
  open?: string
  freezed?: boolean
}

export type OptionInfo = {
  name: string
  prefer?: boolean
  score: number
}
// Define a type for the slice state
export type PlayerOptionsState = {
  options?: OptionInfo[]
  history?: z.infer<typeof playerOptionsSchema>
  preferred?: z.infer<typeof playerOptionsSchema>
  status: Partial<{
    options: FStatus
  }>
}

export type RecommendationsState = {
  [name: string]: Partial<{
    status: FStatus
    recommendations: RecommendationInfo[]
  }>
}

export type TopviewState = {
  views: TopView[]
}

export type WatchState = {
  watching?: Optional<RecentAnimeData>
  availableVideos?: Optional<VideoOption[]>
  status: {
    availableVideos?: FStatus
    info?: FStatus
    watchEpisode?: FStatus
  }
  info?: Optional<AnimeInfo>
  showNextEpisodeButton?: boolean
  nextEpisodeTimeout: number
  autoFullScreen?: boolean
}

export type WatchedState = {
  episodes: {
    [name: string]: EpisodeInfo
  }
  recently?: RecentAnimeInfo[]
  status: {
    episodes?: FStatus
    recently?: FStatus
  }
}

export type WatchHistoryState = {
  sorted?: WatchHistoryItem[]
  status: {
    sorted?: FStatus
  }
}
