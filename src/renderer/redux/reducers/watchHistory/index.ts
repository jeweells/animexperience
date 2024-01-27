import { PayloadAction, unwrapResult } from '@reduxjs/toolkit'
import { Store, WatchHistoryItem } from '@shared/types'
import { getStaticStore, setStaticStore } from '../../../src/hooks/useStaticStore'
import { addFetchFlow, asyncAction, createSlice } from '../utils'

const fetchStore = asyncAction('watchHistory/fetchStore', async (_, api) => {
  const history: WatchHistoryItem[] = await getStaticStore(Store.WATCH_HISTORY, 'sorted').then(
    (x) => (Array.isArray(x) ? x : [])
  )
  api.dispatch(
    watchHistory.set({
      sorted: history,
      noUpdate: true
    })
  )
  return history
})

const push = asyncAction('watchHistory/push', async (arg: WatchHistoryItem, api) => {
  const history =
    api.getState().watchHistory.sorted?.slice() ??
    (await api.dispatch(watchHistory.fetchStore()).then(unwrapResult)) ??
    []
  const idx = history.findIndex((x) => x.info?.name === arg.info.name)
  if (idx > -1) {
    history.splice(idx, 1)
  }
  history.unshift(arg)
  api.dispatch(
    watchHistory.set({
      sorted: history.slice(0, 20)
    })
  )
})

const remove = asyncAction(
  'watchHistory/remove',
  async (name: WatchHistoryItem['info']['name'], api) => {
    const history =
      api.getState().watchHistory.sorted?.slice() ??
      (await api.dispatch(watchHistory.fetchStore()).then(unwrapResult)) ??
      []
    const idx = history.findIndex((x) => x.info?.name === name)
    if (idx > -1) {
      history.splice(idx, 1)
      api.dispatch(
        watchHistory.set({
          sorted: history.slice(0, 20)
        })
      )
    }
  }
)

export const slice = createSlice({
  name: 'watchHistory',
  reducers: {
    set(state, { payload }: PayloadAction<{ sorted: WatchHistoryItem[]; noUpdate?: boolean }>) {
      const sliced = payload.sorted.slice(0, 20)
      state.sorted = sliced
      if (!payload.noUpdate) {
        setStaticStore(Store.WATCH_HISTORY, 'sorted', sliced).catch(console.error)
      }
    }
  },
  extraReducers: ({ addCase }) => {
    addFetchFlow(addCase, fetchStore, 'sorted')
  }
})

export const watchHistory = {
  ...slice.actions,
  fetchStore,
  push,
  remove
}
export default slice.reducer
