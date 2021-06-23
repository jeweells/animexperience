import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Store } from '../../../globals/types'
import { getStaticStore, setStaticStore } from '../../../src/hooks/useStaticStore'
import { FStatus } from '../../../src/types'
import { addFetchFlow } from '../utils'

export type OptionInfo = {
    name: string
    prefer?: boolean
    score: number
}
// Define a type for the slice state
interface PlayerOptionsState {
    options?: OptionInfo[]
    history?: string[]
    preferred?: string[]
    status: Partial<{
        options: FStatus
    }>
}

const OPTIONS_HISTORY_SIZE = 30

const fetchStore = createAsyncThunk('playerOptions/fetchStore', async (arg, api) => {
    const history: Array<string> = await getStaticStore(
        Store.PLAYER_OPTIONS,
        'history',
    ).then((x) => (Array.isArray(x) ? x : []))
    const preferred = await getStaticStore(Store.PLAYER_OPTIONS, 'preferred').then((x) =>
        Array.isArray(x) ? x : [],
    )
    // Order is important
    api.dispatch(playerOptions.setPreferred(preferred))
    api.dispatch(playerOptions.setHistory(history))
    api.dispatch(playerOptions.updateOptions())
    return { history, preferred }
})

const use = createAsyncThunk('playerOptions/use', async (optName: string, api) => {
    const history = [optName, ...api.getState().playerOptions.history].slice(
        0,
        OPTIONS_HISTORY_SIZE,
    )
    // Order is important
    api.dispatch(playerOptions.setHistory(history))
    api.dispatch(playerOptions.updateOptions())
    await setStaticStore(Store.PLAYER_OPTIONS, 'history', history)
})

const prefer = createAsyncThunk(
    'playerOptions/prefer',
    async (
        opts: {
            name: string
            value: boolean
        },
        api,
    ) => {
        const preferredSet = new Set(api.getState().playerOptions.preferred ?? [])
        if (opts.value) {
            preferredSet.add(opts.name)
        } else {
            preferredSet.delete(opts.name)
        }
        const preferred = [...preferredSet]
        console.debug('Setting preferred:', preferred, opts)
        api.dispatch(playerOptions.setPreferred(preferred))
        api.dispatch(playerOptions.updateOptions())
        await setStaticStore(Store.PLAYER_OPTIONS, 'preferred', preferred)
    },
)

// Define the initial state using that type
const initialState: PlayerOptionsState = {
    status: {},
}

export const slice = createSlice({
    name: 'playerOptions',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setHistory(state, { payload }: PayloadAction<string[]>) {
            state.history = payload ?? []
        },
        setPreferred(state, { payload }: PayloadAction<string[]>) {
            state.preferred = payload ?? []
        },
        updateOptions(state) {
            if (!Array.isArray(state.history)) return
            const count: Record<string, number> = {}
            for (const h of state.history) {
                if (!(h in count)) {
                    count[h] = 0
                }
                count[h]++
            }
            const { history, preferred } = state
            const uniqOptions = [...new Set(history.concat(...(preferred ?? [])))]
            state.options = uniqOptions
                .map((x) => {
                    const prefer = preferred?.includes(x)
                    return {
                        name: x,
                        prefer,
                        score: (count[x] ?? 0) / history.length + (prefer ? 1 : 0),
                    } as OptionInfo
                })
                .sort((a, b) => {
                    return b.score - a.score
                })
        },
    },
    extraReducers: ({ addCase }) => {
        addFetchFlow(addCase, fetchStore, 'options')
    },
})

export const playerOptions = {
    ...slice.actions,
    fetchStore,
    use,
    prefer,
}
export default slice.reducer
