import React, { useLayoutEffect } from 'react'
import { followedAnimes } from '../../../redux/reducers/followedAnimes'
import { watch } from '../../../redux/reducers/watch'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { RecentAnimeData } from '../../hooks/useRecentAnimes'
import AnimeCarouselContent from '../../placeholders/AnimeCarouselContent'
import { AnimesCarousel } from '../AnimesCarousel'
import FollowedAnimeEpisodeEntry from '../FollowedAnimeEpisodeEntry'

export type FollowedAnimesUpdatesProps = {}

export const FollowedAnimesUpdates: React.FC<FollowedAnimesUpdatesProps> = React.memo(
    ({}) => {
        const followed = useAppSelector((d) => d.followedAnimes.followed) ?? []
        const status = useAppSelector((d) => d.followedAnimes.status.followed)
        const dispatch = useAppDispatch()
        useLayoutEffect(() => {
            dispatch(followedAnimes.fetchStore())
        }, [])
        const filteredFollowed = React.useMemo(() => {
            return followed.filter((x) => {
                return !(
                    x.status === 'succeeded' &&
                    x.nextEpisodeToWatch === x.lastEpisodeWatched
                )
            })
        }, [followed])

        const handleCardClick = React.useCallback((anime: RecentAnimeData) => {
            if (anime.name && anime.episode) {
                dispatch(watch.watchEpisode(anime))
            } else {
                console.error('No enough data to perform animeSearch')
            }
        }, [])
        if (status === 'succeeded' && filteredFollowed.length === 0) {
            return null
        }
        const carouselLoading = status !== 'succeeded' && filteredFollowed.length === 0

        return (
            <React.Fragment>
                <AnimesCarousel
                    title={'Animes que sigues'}
                    count={carouselLoading ? 1 : filteredFollowed.length}
                    loading={carouselLoading}
                    render={({ index, visible, sliding }) => {
                        if (carouselLoading) {
                            return (
                                <AnimeCarouselContent
                                    key={'placeholder-' + index}
                                    count={5}
                                />
                            )
                        }
                        return (
                            <FollowedAnimeEpisodeEntry
                                index={index}
                                visible={visible}
                                sliding={sliding}
                                key={`${filteredFollowed[index].name}`}
                                onClick={handleCardClick}
                                followed={filteredFollowed[index]}
                            />
                        )
                    }}
                />
            </React.Fragment>
        )
    },
)

FollowedAnimesUpdates.displayName = 'FollowedAnimesUpdates'

export default FollowedAnimesUpdates
