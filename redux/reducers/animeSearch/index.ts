import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ipcRenderer } from 'electron'
import { DeepAnimeIdSearchResult } from '../../../globals/types'
import { FStatus, Optional } from '../../../src/types'
import { addFetchFlow } from '../utils'
import { v4 as uuidv4 } from 'uuid'

// Define a type for the slice state
interface AnimeSearchState {
    // Boolean id
    searching?: string
    result?: Optional<DeepAnimeIdSearchResult>
    status: Partial<{
        result: FStatus
        moreResults: FStatus
    }>
}

const search = createAsyncThunk('animeSearch/search', async (name: string, api) => {
    const result: DeepAnimeIdSearchResult = await ipcRenderer.invoke(
        'deepSearchAnimeId',
        name,
    )
    api.dispatch(
        animeSearch.setResult({
            ...result,
            search: name,
        }),
    )
    return result
})

const searchMore = createAsyncThunk('animeSearch/searchMore', async (arg, api) => {
    const current = api.getState().animeSearch.result
    if (
        !(
            current &&
            typeof current.nextPage === 'number' &&
            typeof current.maxPage === 'number'
        )
    ) {
        return
    }
    if (current.nextPage >= current.maxPage) return

    const result: DeepAnimeIdSearchResult = await ipcRenderer.invoke(
        'deepSearchAnimeIdByPage',
        current.search,
        current.nextPage,
    )

    api.dispatch(
        animeSearch.setResult({
            ...result,
            matches: current.matches.concat(...result.matches),
        }),
    )
    return result
})

// Define the initial state using that type
const initialState: AnimeSearchState = {
    status: {},
}

export const slice = createSlice({
    name: 'animeSearch',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setResult(state, { payload }: PayloadAction<Optional<DeepAnimeIdSearchResult>>) {
            state.result = payload
        },
        setSearching(state, { payload }: PayloadAction<boolean>) {
            state.searching = payload ? uuidv4() : undefined
        },
    },
    extraReducers: ({ addCase }) => {
        addFetchFlow(addCase, search, 'result')
        addFetchFlow(addCase, searchMore, 'moreResults')
    },
})

export const animeSearch = {
    ...slice.actions,
    search,
    searchMore,
}
export default slice.reducer
