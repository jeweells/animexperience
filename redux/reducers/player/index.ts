import { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { createSlice } from '../utils'

export const slice = createSlice({
    name: 'player',
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
