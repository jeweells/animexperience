import { PayloadAction } from '@reduxjs/toolkit'
import { Store } from '@shared/types'
import { getStaticStore, setStaticStore } from '~/src/hooks'
import { addFetchFlow, asyncAction, createSlice } from '../utils'
import { OptionInfo } from '../../state/types'
import { debug } from '@dev/events'
import { playerOptionSchema } from '@shared/schemas'

const OPTIONS_HISTORY_SIZE = 30

const fetchStore = asyncAction('playerOptions/fetchStore', async (_, api) => {
  const history = await getStaticStore(Store.PLAYER_OPTIONS, 'history').then((x) => {
    return Array.isArray(x)
      ? x
          .map((value) => {
            const parsed = playerOptionSchema.safeParse(value)
            if (parsed.success) return parsed.data
            return null
          })
          .filter((value) => value !== null)
      : []
  })
  const preferred = await getStaticStore(Store.PLAYER_OPTIONS, 'preferred').then((x) => {
    const parsed = playerOptionsSchema.safeParse(x)
    if (parsed.success) return parsed.data
    return []
  })
  // Order is important
  api.dispatch(playerOptions.setPreferred(preferred))
  api.dispatch(playerOptions.setHistory(history))
  api.dispatch(playerOptions.updateOptions())
  return { history, preferred }
})

const use = asyncAction('playerOptions/use', async (optName: string, api) => {
  const history = [optName, ...(api.getState().playerOptions.history ?? [])].slice(
    0,
    OPTIONS_HISTORY_SIZE
  )
  // Order is important
  api.dispatch(playerOptions.setHistory(history))
  api.dispatch(playerOptions.updateOptions())
  await setStaticStore(Store.PLAYER_OPTIONS, 'history', history)
})

const prefer = asyncAction(
  'playerOptions/prefer',
  async (
    opts: {
      name: string
      value: boolean
    },
    api
  ) => {
    const preferredSet = new Set(api.getState().playerOptions.preferred ?? [])
    if (opts.value) {
      preferredSet.add(opts.name)
    } else {
      preferredSet.delete(opts.name)
    }
    const preferred = [...preferredSet]
    debug('Setting preferred:', preferred, opts)
    api.dispatch(playerOptions.setPreferred(preferred))
    api.dispatch(playerOptions.updateOptions())
    await setStaticStore(Store.PLAYER_OPTIONS, 'preferred', preferred)
  }
)

export const slice = createSlice({
  name: 'playerOptions',
  // `createSlice` will infer the state type from the `initialState` argument
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
            score: (count[x] ?? 0) / history.length + (prefer ? 1 : 0)
          } as OptionInfo
        })
        .sort((a, b) => {
          return b.score - a.score
        })
    }
  },
  extraReducers: ({ addCase }) => {
    addFetchFlow(addCase, fetchStore, 'options')
  }
})

export const playerOptions = {
  ...slice.actions,
  fetchStore,
  use,
  prefer
}
export default slice.reducer
