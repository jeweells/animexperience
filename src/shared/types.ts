export type RecentAnimeData = Partial<{
  name: string
  episode: number
  img: string
  link: string
  date: string
}>

export enum Store {
  WATCHED = 'watched',
  RECENTLY_WATCHED = 'recently-watched',
  WATCH_HISTORY = 'watch-history',
  PLAYER_OPTIONS = 'player-options',
  FOLLOWED = 'followed'
}

export enum StoreMethod {
  getStore = 'getStore',
  setStore = 'setStore'
}

export type EpisodeInfo = {
  currentTime: number
  duration: number
  at: number
}

export type RelatedAnime = {
  name: string
  link: string
  type: 'Ova' | 'Serie' | 'Película' | 'Especial'
}

export type AnimeInfo = Partial<{
  episodesRange: {
    min: number
    max: number
  }
  title: string
  otherTitles: string[]
  description: string
  image: string
  thumbnail: string
  tags: string[]
  type: 'Ova' | 'Serie' | 'Película' | 'Especial'
  status: 'En emisión' | 'Finalizada'
  emitted: Partial<{ from: number; to: number }>
  related: Array<RelatedAnime>
}> & {
  episodeLink: string
  episodeReplace: string
  link: string
}

export type RecentAnimeInfo = {
  name: string
  lastEpisode: number
  at: number
}

/* eslint-disable camelcase */
export type MalAnimeInfo = {
  id: number
  type: string
  name: string
  image_url: string
  payload: {
    aired: string
    media_type: string
    score: string
    start_year: number
    status: string
  }
  es_score: number
  url: string
  thumbnail_url: string
}
/* eslint-enable camelcase */

export type RecommendationInfo = {
  id: number
  name: string
  image: string
}

export type WatchHistoryItem = {
  at: number
  info: RecentAnimeData
}

export type AnimeIDAnimeMatch = {
  name: string
  link: string
  image: string
}

export type DeepAnimeIdSearchResult = {
  matches: AnimeIDAnimeMatch[]
  search: string
  nextPage?: number
  maxPage?: number
  hasNext: boolean
}

export type DeepAnimeIdSearchResultWithPages = Omit<
  DeepAnimeIdSearchResult,
  'maxPage' | 'nextPage'
> & {
  nextPage: number
  maxPage: number
}

export type FollowedAnime = {
  name: string
  image: string
  link: string
  nextEpisodeToWatch: number
  lastEpisodeWatched: number
  lastCheckAt: number
  nextCheckAt: number
  lastSuccessAt: number
}

export type Optional<T> = T | undefined | null

// eslint-disable-next-line
export type ForcedAny = any

export type AnimeIDSearchItem = {
  id: string
  text: string
  date: string
  image: string
  link: string
}

export type AnimeIDSearchResponse = Array<AnimeIDSearchItem>
/* eslint-disable camelcase */

export type MALImage = {
  image_url: string
  small_image_url: string
  large_image_url: string
}
export type MALImageFormats = {
  jpg: MALImage
  webp: MALImage
}

export type RecentAnimeEpisode = {
  mal_id: number
  url: string
  name: string
}

export type FStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export enum TopView {
  PLAYER = 'player',
  PEEK = 'peek',
  SEARCH = 'search',
  INVOKED_LINK = 'invoked-link'
}

export type WatchInvokedLink = {
  action: 'watch'
  episode: number
  partialLink: string
}
export type InvokedLink = WatchInvokedLink
