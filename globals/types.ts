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
    tags: string[]
    type: 'Serie'
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
