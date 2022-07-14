import React, { useLayoutEffect, Fragment } from 'react'
import { watched } from '../../../redux/reducers/watched'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { VSpace } from '../../atoms/Spacing'
import AnimeRecommendations from '../AnimeRecommendations'

export type RecentlyWatchedRecommendationsProps = {}

export const RecentlyWatchedRecommendations: React.FC<RecentlyWatchedRecommendationsProps> =
    React.memo(({}) => {
        const recently = useAppSelector((d) => d.watched.recently) ?? []
        const dispatch = useAppDispatch()
        useLayoutEffect(() => {
            dispatch(watched.fetchRecentlyStore())
        }, [])
        return (
            <React.Fragment>
                {recently.length > 0 && <VSpace size={32} />}
                {recently.map((r, idx) => (
                    <Fragment key={r.name}>
                        {!!idx && <VSpace size={32} />}
                        <AnimeRecommendations animeName={r.name} />
                    </Fragment>
                ))}
            </React.Fragment>
        )
    })

RecentlyWatchedRecommendations.displayName = 'RecentlyWatchedRecommendations'

export default RecentlyWatchedRecommendations
