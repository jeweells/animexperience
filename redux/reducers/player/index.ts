import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface PlayerState {
    open?: boolean
    freezed?: boolean
}

// Define the initial state using that type
const initialState: PlayerState = {}

export const slice = createSlice({
    name: 'player',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        show(state) {
            state.open = true
        },
        hide(state) {
            state.open = false
        },
        freeze(state, { payload }: PayloadAction<boolean>) {
            state.freezed = payload
        },
    },
})

export const player = {
    ...slice.actions,
}
export default slice.reducer
