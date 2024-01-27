import { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { AnimeIDAnimeMatch, AnimeInfo } from '@shared/types'
import { Optional } from '@shared/types'
import { rendererInvoke } from '../../../src/utils'
import { addFetchFlow, asyncAction, createSlice } from '../utils'

const _peek = asyncAction('peek/peek', async (name: string, api) => {
  api.dispatch(peek.setPeeking(uuidv4()))

  const animes: AnimeIDAnimeMatch[] = (await rendererInvoke('searchAnimeFlv', name)) ?? []
  const anime = animes?.[0]
  if (anime?.link) {
    const info = await rendererInvoke('getAnimeFlvInfo', anime.name, anime.link)
    api.dispatch(peek.setInfo(info))
    return info
  }
  return null
})

export const slice = createSlice({
  name: 'peek',
  reducers: {
    setInfo(state, { payload }: PayloadAction<Optional<AnimeInfo>>) {
      state.info = payload
    },
    setPeeking(state, { payload }: PayloadAction<string | undefined>) {
      state.peeking = payload
    }
  },
  extraReducers: ({ addCase }) => {
    addFetchFlow(addCase, _peek, 'info')
  }
})

export const peek = {
  ...slice.actions,
  peek: _peek
}
export default slice.reducer
