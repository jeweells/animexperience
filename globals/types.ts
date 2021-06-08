import { RecentAnimeData } from '../src/hooks/useRecentAnimes'

export enum Store {
    WATCHED = 'watched',
    RECENTLY_WATCHED = 'recently-watched',
    WATCH_HISTORY = 'watch-history',
}

export enum StoreMethod {
    getStore = 'getStore',
    setStore = 'setStore',
}

export type EpisodeInfo = {
    currentTime: number
    duration: number
    at: number
}

export type AnimeInfo = Partial<{
    episodesRange: {
        min: number
        max: number
    }
}>

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
