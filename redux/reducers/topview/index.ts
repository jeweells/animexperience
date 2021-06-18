import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TopView } from '../../../src/types'

// Define a type for the slice state
interface TopviewState {
    views: TopView[]
}

// Define the initial state using that type
const initialState: TopviewState = {
    views: [],
}

export const slice = createSlice({
    name: 'topview',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        push(state, { payload }: PayloadAction<TopView>) {
            const idx = state.views.indexOf(payload)
            if (idx > 0) {
                state.views.splice(idx, 1)
            }
            if (idx !== 0) {
                state.views.unshift(payload)
            }
        },
        pop(state, { payload }: PayloadAction<TopView>) {
            const idx = state.views.indexOf(payload)
            if (idx > -1) {
                state.views.splice(idx, 1)
            }
        },
    },
})

export const topview = {
    ...slice.actions,
}
export default slice.reducer
