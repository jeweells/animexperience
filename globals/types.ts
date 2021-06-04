export enum Store {
    WATCHED = 'watched',
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
