import { PayloadAction } from '@reduxjs/toolkit'
import { DeepAnimeIdSearchResult, DeepAnimeIdSearchResultWithPages } from '@shared/types'
import { Optional } from '@shared/types'
import { rendererInvoke } from '../../../src/utils'
import { addFetchFlow, asyncAction, createSlice } from '../utils'
import { v4 as uuidv4 } from 'uuid'

const search = asyncAction('animeSearch/search', async (name: string, api) => {
  const result: DeepAnimeIdSearchResult = await rendererInvoke('deepSearchAnimeFlv', name)
  api.dispatch(
    animeSearch.setResult({
      ...result,
      search: name
    })
  )
  return result
})

const resultHasPages = (
  r: Optional<DeepAnimeIdSearchResult>
): r is DeepAnimeIdSearchResultWithPages => {
  return !!(r?.hasNext && typeof r.nextPage === 'number' && typeof r.maxPage === 'number')
}

const searchMore = asyncAction('animeSearch/searchMore', async (_, api) => {
  const current = api.getState().animeSearch.result
  if (!resultHasPages(current)) {
    return
  }

  const result: DeepAnimeIdSearchResult = await rendererInvoke(
    'deepSearchAnimeFlvByPage',
    current.search,
    current.nextPage
  )

  api.dispatch(
    animeSearch.setResult({
      ...result,
      matches: current.matches.concat(...result.matches)
    })
  )
  return result
})

export const slice = createSlice({
  name: 'animeSearch',
  reducers: {
    setResult(state, { payload }: PayloadAction<Optional<DeepAnimeIdSearchResult>>) {
      state.result = payload
    },
    setSearching(state, { payload }: PayloadAction<boolean>) {
      state.searching = payload ? uuidv4() : undefined
    }
  },
  extraReducers: ({ addCase }) => {
    addFetchFlow(addCase, search, 'result')
    addFetchFlow(addCase, searchMore, 'moreResults')
  }
})

export const animeSearch = {
  ...slice.actions,
  search,
  searchMore
}
export default slice.reducer
