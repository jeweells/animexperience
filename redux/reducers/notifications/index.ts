import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

interface InvokedLinkState {
    message: string | null
    key: string
}

// Define the initial state using that type
const initialState: InvokedLinkState = {
    message: null,
    key: '_',
}

export const slice = createSlice({
    name: 'notifications',
    initialState,
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
