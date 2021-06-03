import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ipcRenderer } from 'electron'
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
    }
    showNextEpisodeButton?: boolean
    nextEpisodeTimeout: number
}

// Define the initial state using that type
const initialState: WatchState = {
    status: {},
    nextEpisodeTimeout: -1,
}

const getAvailableVideos = createAsyncThunk('watch/animeEpisode', async (arg, api) => {
    const state = api.getState()
    const anime = state.watch.watching
    if (!anime) {
        return api.rejectWithValue('Needs to be watching to request available videos')
    }
    return (await ipcRenderer.invoke('getJKAnimeEpisodeVideos', anime.name, anime.episode)) as Optional<VideoOption[]>
})

const nextEpisode = createAsyncThunk('watch/nextEpisode', async (arg, api) => {
    const state = api.getState()
    const watching = state.watch.watching
    if (watching && typeof watching.episode === 'number') {
        await api.dispatch(
            watchEpisode({
                ...watching,
                episode: watching.episode + 1,
            }),
        )
    }
})

const watchEpisode = createAsyncThunk('watch/watchEpisode', async (anime: RecentAnimeData, { getState, dispatch }) => {
    const state = getState()
    const watching = state.watch.watching
    if (watching?.name === anime?.name && watching?.episode === anime?.episode) return
    dispatch(watch.set(anime))
    const p = dispatch(watch.getAvailableVideos())
    dispatch(player.show())
    await p
})

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
                state.availableVideos = payload
            },
        )
    },
})

export const watch = {
    ...slice.actions,
    getAvailableVideos,
    nextEpisode,
    watchEpisode,
}
export default slice.reducer
