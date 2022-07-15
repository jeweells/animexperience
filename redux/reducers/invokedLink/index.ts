import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AnimeInfo } from '../../../globals/types'
import { FStatus } from '../../../src/types'
import { addFetchFlow } from '../utils'
import { WatchInvokedLink } from '../../../electron/sdk/openUrl'
import { rendererInvoke } from '../../../src/utils'
import { v4 as uuidv4 } from 'uuid'

export type PreAllowWatch = { data: AnimeInfo | null; request: WatchInvokedLink }

// Define a type for the slice state
interface InvokedLinkState {
    open: {
        watch?: string
    }
    preAllow: Partial<{
        watch: PreAllowWatch
    }>
    status: {
        watch?: FStatus
    }
}

// Define the initial state using that type
const initialState: InvokedLinkState = {
    open: {},
    preAllow: {},
    status: {},
}
const watchInvokeLink = createAsyncThunk(
    'invokedLink/watchInvokeLink',
    async (info: WatchInvokedLink, api): Promise<PreAllowWatch> => {
        api.dispatch(invokedLink.setWatchRequest(info))
        return {
            data: await rendererInvoke(
                'getAnimeFlvInfoFromPartialLink',
                info.partialLink,
            ),
            request: info,
        }
    },
)

export const slice = createSlice({
    name: 'invokedLink',
    initialState,
    reducers: {
        setWatchRequest(state, { payload }: PayloadAction<WatchInvokedLink>) {
            state.preAllow.watch = { data: null, request: payload }
        },
        show(state, { payload: key }: PayloadAction<keyof InvokedLinkState['open']>) {
            state.open[key] = uuidv4()
        },
        hide(state, { payload: key }: PayloadAction<keyof InvokedLinkState['open']>) {
            state.open[key] = undefined
        },
    },
    extraReducers: ({ addCase }) => {
        addFetchFlow(
            addCase,
            watchInvokeLink,
            'watch',
            (state, { payload }: PayloadAction<PreAllowWatch>) => {
                state.preAllow.watch = payload
            },
        )
    },
})

export const invokedLink = {
    ...slice.actions,
    watchInvokeLink,
}
export default slice.reducer
