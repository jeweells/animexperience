import { PayloadAction, unwrapResult } from '@reduxjs/toolkit'
import { EpisodeInfo, RecentAnimeInfo, Store } from '@shared/types'
import { RecentAnimeData } from '../../../src/hooks/useRecentAnimes'
import { formatKeys, getStaticStore, setStaticStore } from '../../../src/hooks/useStaticStore'
import { Optional } from '@shared/types'
import { addFetchFlow, asyncAction, createSlice } from '../utils'
import { watchHistory } from '../watchHistory'
import { debug, error } from '@dev/events'

const fetchStore = asyncAction('watched/fetchStore', async (arg: RecentAnimeData, { dispatch }) => {
  return await getStaticStore(Store.WATCHED, arg?.name, arg?.episode)
    .then((x) => ({
      anime: arg,
      info: x as EpisodeInfo
    }))
    .then((x) => {
      if (x.info) {
        dispatch(watched.set({ ...x }))
      }
    })
})

const fetchRecentlyStore = asyncAction('watched/fetchRecentlyStore', async (_, { dispatch }) => {
  return await getStaticStore(Store.RECENTLY_WATCHED, 'sorted')
    .then((x) => (Array.isArray(x) ? x : []) as RecentAnimeInfo[])
    .then((x) => {
      dispatch(
        watched.setRecently({
          recently: x,
          noUpdate: true
        })
      )
      return x
    })
})

const updateRecentlyWatched = asyncAction(
  'watched/updateRecentlyWatched',
  async (anime: Optional<RecentAnimeData>, api) => {
    if (!(anime?.name && typeof anime.episode === 'number')) return
    const recently: RecentAnimeInfo[] =
      api.getState().watched.recently?.slice() ??
      (await api.dispatch(watched.fetchRecentlyStore()).then(unwrapResult)) ??
      []
    const targetIdx = recently.findIndex((x) => x.name === anime.name)
    const newData: RecentAnimeInfo = {
      name: anime.name,
      at: new Date().getTime(),
      lastEpisode: anime.episode
    }
    if (targetIdx > -1) {
      const targetAnime = recently[targetIdx]
      if (targetAnime.lastEpisode < newData.lastEpisode) {
        targetAnime.lastEpisode = newData.lastEpisode
      }
      targetAnime.at = newData.at
    } else {
      recently.push(newData)
    }
    debug('Updating recently watched anime', newData)
    recently.sort((a, b) => b.at - a.at)
    api.dispatch(
      watched.setRecently({
        recently: recently.slice(0, 5)
      })
    )
  }
)

const updateWatched = asyncAction(
  'watched/updateWatched',
  async (
    payload: {
      anime: RecentAnimeData
      info: EpisodeInfo
    },
    api
  ) => {
    api.dispatch(watched.set(payload))
    const keys = [payload.anime?.name, payload.anime?.episode]
    await Promise.all([
      setStaticStore(Store.WATCHED, ...keys, payload.info).catch(error),
      // Should remove it because we can consider it as "watched"
      payload.info.currentTime / payload.info.duration > 0.85
        ? api.dispatch(watchHistory.remove(payload.anime.name))
        : api.dispatch(
            watchHistory.push({
              at: new Date().getTime(),
              info: payload.anime
            })
          )
    ])
  }
)

export const slice = createSlice({
  name: 'watched',
  reducers: {
    // Do not call this directly, use updateWatched instead if you wish to update the static stores
    set(
      state,
      {
        payload
      }: PayloadAction<{
        anime: RecentAnimeData
        info: EpisodeInfo
      }>
    ) {
      const keys = [payload.anime?.name, payload.anime?.episode]
      state.episodes[formatKeys(keys)] = payload.info
    },
    setRecently(
      state,
      {
        payload
      }: PayloadAction<{
        recently: RecentAnimeInfo[]
        noUpdate?: boolean
      }>
    ) {
      state.recently = payload.recently
      if (!payload.noUpdate) {
        setStaticStore(Store.RECENTLY_WATCHED, 'sorted', payload.recently).catch(error)
      }
    }
  },
  extraReducers: ({ addCase }) => {
    addFetchFlow(addCase, fetchStore, 'episodes')
    addFetchFlow(addCase, fetchRecentlyStore, 'recently')
  }
})

export const watched = {
  ...slice.actions,
  fetchStore,
  fetchRecentlyStore,
  updateWatched,
  updateRecentlyWatched
}
export default slice.reducer
