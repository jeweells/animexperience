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

export type RecentAnimeData = {
    entry: {
        mal_id: number
        images: MALImageFormats
        title: string
    }
    episodes: RecentAnimeEpisode[]
}

export type RecentAnimesResult = {
    data: RecentAnimeData[]
}

export type AnimeIDSearchItem = {
    id: string
    text: string
    date: string
    image: string
    link: string
}

export type AnimeIDSearchResponse = Array<AnimeIDSearchItem>
/* eslint-enable camelcase */

export type FStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
export type Optional<T> = T | undefined | null

export enum TopView {
    PLAYER = 'player',
    PEEK = 'peek',
    SEARCH = 'search',
    INVOKED_LINK = 'invoked-link',
}
