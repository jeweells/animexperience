import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EpisodeInfo, Store } from '../../../globals/types'
import { RecentAnimeData } from '../../../src/hooks/useRecentAnimes'
import { formatKeys, getStaticStore, setStaticStore } from '../../../src/hooks/useStaticStore'

// Define a type for the slice state
interface WatchedState {
    [name: string]: EpisodeInfo
}

// Define the initial state using that type
const initialState: WatchedState = {}

const fetchStore = createAsyncThunk('watched/fetchStore', async (arg: RecentAnimeData, { dispatch }) => {
    return await getStaticStore(Store.WATCHED, arg?.name, arg?.episode)
        .then((x) => ({
            anime: arg,
            info: x as EpisodeInfo,
        }))
        .then((x) => {
            if (x.info) {
                dispatch(watched.set(x))
            }
        })
})

export const slice = createSlice({
    name: 'watched',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        set(state, { payload }: PayloadAction<{ anime: RecentAnimeData; info: EpisodeInfo; noUpdate?: boolean }>) {
            const keys = [payload.anime?.name, payload.anime?.episode]
            state[formatKeys(keys)] = payload.info
            if (!payload.noUpdate) {
                setStaticStore(Store.WATCHED, ...keys, payload.info).catch(console.error)
            }
        },
    },
})

export const watched = {
    ...slice.actions,
    fetchStore,
}
export default slice.reducer
