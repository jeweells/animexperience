import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ipcRenderer } from 'electron'
import { AnimeIDAnimeMatch, AnimeInfo } from '../../../globals/types'
import { FStatus, Optional } from '../../../src/types'
import { addFetchFlow } from '../utils'

// Define a type for the slice state
interface PeekState {
    name?: string
    status: Partial<{
        info: FStatus
    }>
    info?: Optional<AnimeInfo>
    peeking?: boolean
}

// Define the initial state using that type
const initialState: PeekState = {
    status: {},
}

const _peek = createAsyncThunk('peek/peek', async (name: string, api) => {
    api.dispatch(peek.setPeeking(true))

    const animes: AnimeIDAnimeMatch[] =
        (await ipcRenderer.invoke('searchAnimeID', name)) ?? []
    const anime = animes?.[0]
    if (anime?.link) {
        const info = await ipcRenderer.invoke('getAnimeIDInfo', anime.link)
        api.dispatch(peek.setInfo(info))
        return info
    }
    return null
})

export const slice = createSlice({
    name: 'peek',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setInfo(state, { payload }: PayloadAction<Optional<AnimeInfo>>) {
            state.info = payload
        },
        setPeeking(state, { payload }: PayloadAction<boolean>) {
            state.peeking = payload
        },
    },
    extraReducers: ({ addCase }) => {
        addFetchFlow(addCase, _peek, 'info')
    },
})

export const peek = {
    ...slice.actions,
    peek: _peek,
}
export default slice.reducer
