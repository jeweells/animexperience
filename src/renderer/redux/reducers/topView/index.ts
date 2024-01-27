import { PayloadAction } from '@reduxjs/toolkit'
import { TopView } from '@shared/types'
import { createSlice } from '../utils'

export const slice = createSlice({
  name: 'topView',
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
    }
  }
})

export const topView = {
  ...slice.actions
}
export default slice.reducer
