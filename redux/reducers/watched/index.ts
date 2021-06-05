import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EpisodeInfo, RecentAnimeInfo, Store } from '../../../globals/types'
import { RecentAnimeData } from '../../../src/hooks/useRecentAnimes'
import { FStatus } from '../../../src/types'
import {
    formatKeys,
    getStaticStore,
    setStaticStore,
} from '../../../src/hooks/useStaticStore'
import { addFetchFlow } from '../utils'

// Define a type for the slice state
interface WatchedState {
    episodes: {
        [name: string]: EpisodeInfo
    }
    recently: RecentAnimeInfo[]
    status: {
        episodes?: FStatus
        recently?: FStatus
    }
}

// Define the initial state using that type
const initialState: WatchedState = {
    recently: [],
    episodes: {},
    status: {},
}

const fetchStore = createAsyncThunk(
    'watched/fetchStore',
    async (arg: RecentAnimeData, { dispatch }) => {
        return await getStaticStore(Store.WATCHED, arg?.name, arg?.episode)
            .then((x) => ({
                anime: arg,
                info: x as EpisodeInfo,
            }))
            .then((x) => {
                if (x.info) {
                    dispatch(watched.set({ ...x, noUpdate: true }))
                }
            })
    },
)

const fetchRecentlyStore = createAsyncThunk(
    'watched/fetchRecentlyStore',
    async (arg, { dispatch }) => {
        return await getStaticStore(Store.RECENTLY_WATCHED, 'sorted')
            .then((x) => (x ?? []) as RecentAnimeInfo[])
            .then((x) => {
                dispatch(
                    watched.setRecently({
                        recently: x,
                        noUpdate: true,
                    }),
                )
            })
    },
)

export const slice = createSlice({
    name: 'watched',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        set(
            state,
            {
                payload,
            }: PayloadAction<{
                anime: RecentAnimeData
                info: EpisodeInfo
                noUpdate?: boolean
            }>,
        ) {
            const keys = [payload.anime?.name, payload.anime?.episode]
            state.episodes[formatKeys(keys)] = payload.info
            if (!payload.noUpdate) {
                setStaticStore(Store.WATCHED, ...keys, payload.info).catch(console.error)
            }
        },
        setRecently(
            state,
            {
                payload,
            }: PayloadAction<{
                recently: RecentAnimeInfo[]
                noUpdate?: boolean
            }>,
        ) {
            state.recently = payload.recently
            if (!payload.noUpdate) {
                setStaticStore(Store.RECENTLY_WATCHED, 'sorted', payload.recently).catch(
                    console.error,
                )
            }
        },
    },
    extraReducers: ({ addCase }) => {
        addFetchFlow(addCase, fetchStore, 'episodes')
        addFetchFlow(addCase, fetchRecentlyStore, 'recently')
    },
})

export const watched = {
    ...slice.actions,
    fetchStore,
    fetchRecentlyStore,
}
export default slice.reducer
