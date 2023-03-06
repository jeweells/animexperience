import { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { createSlice } from '../utils'

export const slice = createSlice({
    name: 'notifications',
    reducers: {
        clear(state) {
            state.message = null
        },
        setMessage(state, { payload }: PayloadAction<{ message: string | null }>) {
            state.key = uuidv4()
            state.message = payload.message
        },
    },
})

export const notifications = {
    ...slice.actions,
}
export default slice.reducer
