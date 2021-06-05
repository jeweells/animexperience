import React, { useMemo } from 'react'
import { EpisodeInfo } from '../../globals/types'
import { watched } from '../../redux/reducers/watched'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { Optional } from '../types'
import { RecentAnimeData } from './useRecentAnimes'
import { formatKeys } from './useStaticStore'

export const useWatched = (anime: Optional<RecentAnimeData>): Optional<EpisodeInfo> => {
    const key = useMemo(() => {
        if (!anime) return null
        return formatKeys([anime?.name, anime?.episode])
    }, [anime?.name, anime?.episode])
    const data = useAppSelector((d) => (key ? d.watched.episodes[key] : null))
    const dispatch = useAppDispatch()
    React.useLayoutEffect(() => {
        if (key && !data && anime) {
            dispatch(watched.fetchStore(anime))
        }
    }, [key])
    return data
}
