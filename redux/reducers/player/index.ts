import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

// Define a type for the slice state
interface PlayerState {
    open?: string
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
            state.open = uuidv4()
        },
        hide(state) {
            state.open = undefined
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
