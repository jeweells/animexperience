import { Draft, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
import { AnimeInfo, FollowedAnime, Store } from '@shared/types'
import { RecentAnimeData } from '../../../src/hooks/useRecentAnimes'
import { formatKeys, getStaticStore, setStaticStore } from '../../../src/hooks/useStaticStore'
import { FStatus } from '@shared/types'
import { rendererInvoke } from '../../../src/utils'
import { addFetchFlow, asyncAction, createSlice } from '../utils'
import { FollowedAnimesState } from '../../state/types'
import { ForcedAny } from '@shared/types'
import { debug, error, info } from '@dev/events'

export interface FollowedAnimeWStatus extends FollowedAnime {
  status: FStatus
}

const nextCheck = (now: number): number => now

const fetchStore = asyncAction('followedAnimes/fetchStore', async (_, api) => {
  const followed: FollowedAnime[] = await getStaticStore(Store.FOLLOWED, 'followed').then((x) =>
    x ? Object.values(x) : []
  )

  const followedCpy: (FollowedAnimeWStatus | null)[] = followed.map((x) => ({
    ...x,
    status: 'idle'
  }))
  const now = moment.now()
  return await Promise.all(
    followedCpy.map((x, index) => {
      if (x === null) return null
      return Promise.resolve({ ...x })
        .then(async (value) => {
          if (now < value.nextCheckAt) {
            debug(
              'For',
              value.name,
              'next check at',
              moment(value.nextCheckAt).format(),
              'now is',
              moment(now).format()
            )
            return value
          }
          if (value.lastEpisodeWatched < value.nextEpisodeToWatch) {
            debug(
              'For',
              value.name,
              'already has episodes to watch',
              value.lastEpisodeWatched,
              '<',
              value.nextEpisodeToWatch
            )
            // We already have a new episode to watch, so we skip fetching new info
            return value
          }
          debug('Getting anime info of', value.name)
          const info: AnimeInfo | null = await rendererInvoke(
            'getAnimeFlvInfo',
            value.name,
            value.link
          ).catch((err) => {
            error('FAILED TO FETCH', err)
            return null
          })
          if (!info) return value

          if (
            info.status === 'Finalizada' &&
            info.episodesRange?.max === value.lastEpisodeWatched
          ) {
            debug(value.name, 'has finished; Removed from the follow list')
            return null
          }
          const _now = moment.now()
          const lastEpisode = info.episodesRange?.max ?? 0
          const hasNewEpisodeAvailable =
            lastEpisode > value.lastEpisodeWatched &&
            value.lastEpisodeWatched >= value.nextEpisodeToWatch

          if (hasNewEpisodeAvailable) {
            value.nextEpisodeToWatch = value.lastEpisodeWatched
            value.nextEpisodeToWatch++
            debug('[Followed] New episode found!')
            value.lastSuccessAt = _now
          }
          value.lastCheckAt = _now
          value.nextCheckAt = nextCheck(value.lastSuccessAt)
          debug('Got info of', value.name, {
            info,
            lastEpisode,
            hasNewEpisodeAvailable
          })
          return value
        })
        .then((value) => {
          if (value !== null) {
            value.status = 'succeeded'
          }
          debug('[FollowedAnimes] Succeding fetching:', value)
          followedCpy[index] = value
          return value
        })
    })
  )
    .then((values) => {
      api.dispatch(
        followedAnimes.set({
          followed: followedCpy
        })
      )
      return values
    })
    .catch((err) => {
      error('[Followed] ERROR', err)
      throw err
    })
})

// Define the initial state using that type

const sortFollowed = (arr: FollowedAnimeWStatus[]): FollowedAnimeWStatus[] => {
  return arr
    .filter((x) => x.status === 'succeeded')
    .sort((a, b) => b.lastSuccessAt - a.lastSuccessAt)
    .concat(arr.filter((x) => x.status !== 'succeeded'))
}
const followedToDict = (
  state: Draft<FollowedAnimesState>,
  arr: FollowedAnimeWStatus[]
): Record<string, FollowedAnime> => {
  const result = arr.reduce(
    (
      acc: ForcedAny,
      {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        status,
        ...rest
      }
    ) => {
      const key = formatKeys([rest.name ?? ''])
      if (!key) return acc
      acc[key] = rest
      return acc
    },
    {}
  )
  state.followedDict = result
  return result
}

const set = (
  state: Draft<FollowedAnimesState>,
  {
    payload
  }: PayloadAction<{
    followed: (FollowedAnimeWStatus | null)[]
    noUpdate?: boolean
  }>
) => {
  state.followed = sortFollowed(payload.followed.filter((x): x is FollowedAnimeWStatus => !!x))
  if (!payload.noUpdate) {
    setStaticStore(Store.FOLLOWED, 'followed', followedToDict(state, state.followed)).catch(error)
  }
}

export const slice = createSlice({
  name: 'followedAnimes',
  reducers: {
    set,
    unfollow(state, action: PayloadAction<{ name: string }>) {
      return set(state, {
        ...action,
        payload: {
          followed: state.followed.filter((x) => x.name !== action.payload.name)
        }
      })
    },
    follow(state, { payload }: PayloadAction<{ info: AnimeInfo; anime: RecentAnimeData }>) {
      if (payload.anime.name && payload.info.link) {
        const now = moment.now()
        const lastEpisode = payload.info.episodesRange?.max ?? 0
        const episode = payload.anime.episode ?? 0
        const followedIndex = state.followed.findIndex((x) => x.name === payload.anime.name)

        const newFollow: FollowedAnimeWStatus = {
          status: 'succeeded',
          name: payload.anime.name,
          link: payload.info.link,
          lastSuccessAt: now,
          lastEpisodeWatched: episode,
          nextEpisodeToWatch: episode,
          lastCheckAt: now,
          image: payload.anime.img ?? '',
          nextCheckAt: nextCheck(now)
        }
        if (followedIndex > -1) {
          const targetFollowed = state.followed[followedIndex]
          newFollow.lastEpisodeWatched = Math.max(
            newFollow.lastEpisodeWatched,
            targetFollowed.lastEpisodeWatched
          )
          newFollow.nextEpisodeToWatch = newFollow.lastEpisodeWatched
        }
        if (lastEpisode > newFollow.lastEpisodeWatched) {
          newFollow.nextEpisodeToWatch++
        }

        if (followedIndex > -1) {
          state.followed[followedIndex] = newFollow
        } else {
          state.followed.push(newFollow)
        }
        state.followed = sortFollowed(state.followed)

        debug('Saving followed anime')
        setStaticStore(Store.FOLLOWED, 'followed', followedToDict(state, state.followed)).catch(
          error
        )
      } else {
        debug('Invalid anime to follow', payload.anime.name, payload.info.link)
      }
    }
  },
  extraReducers: ({ addCase }) => {
    addFetchFlow(addCase, fetchStore, 'followed', () => {
      info('FOLLOWED SUCCEEDED')
    })
  }
})

export const followedAnimes = {
  ...slice.actions,
  fetchStore
}
export default slice.reducer
