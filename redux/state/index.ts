import {
    AnimeSearchState,
    FollowedAnimesState,
    InvokedLinkState,
    NotificationsState,
    PeekState,
    PlayerOptionsState,
    PlayerState,
    RecommendationsState,
    TopviewState,
    WatchedState,
    WatchHistoryState,
    WatchState,
} from './types'

const animeSearch: AnimeSearchState = {
    status: {},
}

const followedAnimes: FollowedAnimesState = {
    followed: [],
    followedDict: {},
    status: {},
}

const invokedLink: InvokedLinkState = {
    open: {},
    preAllow: {},
    status: {},
}

const notifications: NotificationsState = {
    message: null,
    key: '_',
}

const peek: PeekState = {
    status: {},
}

const player: PlayerState = {}

const playerOptions: PlayerOptionsState = {
    status: {},
}

const recommendations: RecommendationsState = {}

const topView: TopviewState = {
    views: [],
}

const watch: WatchState = {
    status: {},
    nextEpisodeTimeout: -1,
}

const watched: WatchedState = {
    episodes: {},
    status: {},
}

const watchHistory: WatchHistoryState = {
    status: {},
}

export const initialState = {
    animeSearch,
    followedAnimes,
    invokedLink,
    notifications,
    peek,
    player,
    playerOptions,
    recommendations,
    topView,
    watch,
    watched,
    watchHistory,
}

export type RootState = typeof initialState
