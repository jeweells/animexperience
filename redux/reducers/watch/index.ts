import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ipcRenderer } from 'electron'
import { AnimeInfo } from '../../../globals/types'
import { VideoOption } from '../../../src/components/VideoPlayer'
import { RecentAnimeData } from '../../../src/hooks/useRecentAnimes'
import { Optional, Status } from '../../../src/types'
import { player } from '../player'
import { addFetchFlow } from '../utils'

// Define a type for the slice state
interface WatchState {
    watching?: Optional<RecentAnimeData>
    availableVideos?: Optional<VideoOption[]>
    status: {
        availableVideos?: Status
        info?: Status
    }
    info?: Optional<AnimeInfo>
    showNextEpisodeButton?: boolean
    nextEpisodeTimeout: number
}

// Define the initial state using that type
const initialState: WatchState = {
    status: {},
    nextEpisodeTimeout: -1,
}

const getAvailableVideos = createAsyncThunk('watch/availableVideos', async (arg, api) => {
    const state = api.getState()
    const anime = state.watch.watching
    if (!anime) {
        return api.rejectWithValue('Needs to be watching to request available videos')
    }
    console.debug('Getting available videos of', anime)
    return await Promise.all([
        ipcRenderer.invoke('getAnimeIDEpisodeVideos', anime.link),
        ipcRenderer.invoke('getJKAnimeEpisodeVideos', anime.name, anime.episode),
    ]).then((x) =>
        (x.filter(Array.isArray).flat(1) as VideoOption[]).filter((x) => {
            const opt = x.name?.toLowerCase()
            switch (opt) {
                // IOS: What a horrible option full of ads and annoying stuff
                case 'ios':
                    return false
            }
            return true
        }),
    )
})

const getAnimeInfo = createAsyncThunk('watch/getAnimeInfo', async (arg, api) => {
    const state = api.getState()
    const anime = state.watch.watching
    if (!anime) {
        return api.rejectWithValue('Needs to be watching to request available videos')
    }
    return await ipcRenderer.invoke('getAnimeInfo', anime.link)
})

const nextEpisode = createAsyncThunk('watch/nextEpisode', async (arg, api) => {
    const state = api.getState()
    const watching = state.watch.watching
    if (watching && typeof watching.episode === 'number') {
        const newEpisode = watching.episode + 1
        await api.dispatch(
            watchEpisode({
                ...watching,
                episode: newEpisode,
                // AnimeID link
                link: watching.link?.replace(/[0-9]+$/, String(newEpisode)),
            }),
        )
    }
})

const previousEpisode = createAsyncThunk('watch/previousEpisode', async (arg, api) => {
    const state = api.getState()
    const watching = state.watch.watching
    if (watching && typeof watching.episode === 'number') {
        const newEpisode = watching.episode - 1
        await api.dispatch(
            watchEpisode({
                ...watching,
                episode: newEpisode,
                // AnimeID link
                link: watching.link?.replace(/[0-9]+$/, String(newEpisode)),
            }),
        )
    }
})

const watchEpisode = createAsyncThunk(
    'watch/watchEpisode',
    async (anime: RecentAnimeData, { getState, dispatch }) => {
        const state = getState()
        const watching = state.watch.watching
        if (watching?.name === anime?.name && watching?.episode === anime?.episode) return
        console.debug('WATCH:', anime)
        dispatch(watch.set(anime))
        const p = dispatch(watch.getAvailableVideos())
        const info = dispatch(watch.getAnimeInfo())
        dispatch(player.show())
        await Promise.all([p, info])
    },
)

export const slice = createSlice({
    name: 'watch',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        set(state, { payload }: PayloadAction<Optional<RecentAnimeData>>) {
            state.watching = payload
        },
        reset() {
            return initialState
        },
        setNextEpisodeButton(state, { payload }: PayloadAction<boolean>) {
            state.showNextEpisodeButton = payload
            if (!payload) {
                state.nextEpisodeTimeout = -1
            }
        },
        setNextEpisodeTimeout(state, { payload }: PayloadAction<number>) {
            state.nextEpisodeTimeout = payload
        },
    },
    extraReducers: ({ addCase }) => {
        addFetchFlow(
            addCase,
            getAvailableVideos,
            'availableVideos',
            (state, { payload }: PayloadAction<Optional<VideoOption[]>>) => {
                console.debug('Available videos:', payload)
                state.availableVideos = payload
            },
        )
        addFetchFlow(
            addCase,
            getAnimeInfo,
            'info',
            (state, { payload }: PayloadAction<Optional<AnimeInfo>>) => {
                state.info = payload
            },
        )
    },
})

export const watch = {
    ...slice.actions,
    getAvailableVideos,
    nextEpisode,
    previousEpisode,
    watchEpisode,
    getAnimeInfo,
}
export default slice.reducer
