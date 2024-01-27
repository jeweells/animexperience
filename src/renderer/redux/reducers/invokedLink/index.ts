import { PayloadAction } from '@reduxjs/toolkit'
import { AnimeInfo } from '@shared/types'
import { addFetchFlow, asyncAction, createSlice } from '../utils'
import { WatchInvokedLink } from '@shared/types'
import { rendererInvoke } from '../../../src/utils'
import { v4 as uuidv4 } from 'uuid'
import { InvokedLinkState } from '../../state/types'

export type PreAllowWatch = { data: AnimeInfo | null; request: WatchInvokedLink }

const watchInvokeLink = asyncAction(
  'invokedLink/watchInvokeLink',
  async (info: WatchInvokedLink, api): Promise<PreAllowWatch> => {
    api.dispatch(invokedLink.setWatchRequest(info))
    return {
      data: await rendererInvoke('getAnimeFlvInfoFromPartialLink', info.partialLink),
      request: info
    }
  }
)

export const slice = createSlice({
  name: 'invokedLink',
  reducers: {
    setWatchRequest(state, { payload }: PayloadAction<WatchInvokedLink>) {
      state.preAllow.watch = { data: null, request: payload }
    },
    show(state, { payload: key }: PayloadAction<keyof InvokedLinkState['open']>) {
      state.open[key] = uuidv4()
    },
    hide(state, { payload: key }: PayloadAction<keyof InvokedLinkState['open']>) {
      state.open[key] = undefined
    }
  },
  extraReducers: ({ addCase }) => {
    addFetchFlow(
      addCase,
      watchInvokeLink,
      'watch',
      (state, { payload }: PayloadAction<PreAllowWatch>) => {
        state.preAllow.watch = payload
      }
    )
  }
})

export const invokedLink = {
  ...slice.actions,
  watchInvokeLink
}
export default slice.reducer
