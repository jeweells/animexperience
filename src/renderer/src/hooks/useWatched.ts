import { useMemo, useLayoutEffect } from 'react'
import { Optional, EpisodeInfo } from '@shared/types'
import { watched } from '@reducers'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { RecentAnimeData } from './useRecentAnimes'
import { formatKeys } from './useStaticStore'

export const useWatched = (anime: Optional<RecentAnimeData>): Optional<EpisodeInfo> => {
  const key = useMemo(() => {
    if (!anime) return null
    return formatKeys([anime?.name, anime?.episode])
  }, [anime?.name, anime?.episode])
  const data = useAppSelector((d) => (key ? d.watched.episodes[key] : null))
  const dispatch = useAppDispatch()
  useLayoutEffect(() => {
    if (key && !data && anime) {
      dispatch(watched.fetchStore(anime))
    }
  }, [key])
  return data
}
