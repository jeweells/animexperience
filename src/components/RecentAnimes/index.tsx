import React from 'react'
import { watch } from '@reducers'
import { VSpace } from '../../atoms/Spacing'
import { RecentAnimeData, useRecentAnimes } from '../../hooks/useRecentAnimes'
import { AnimeEpisodeEntry } from '../AnimeEpisodeEntry'
import { useAppDispatch } from '~/redux/utils'
import { CarouselTitleWithLoading } from '~/src/components'
import AnimeSearchPlaceholder from '~/src/placeholders/AnimeSearchPlaceholder'
import AnimesGrid from '@components/AnimesGrid'
import { useSizes } from '@components/AnimesCarousel/hooks'

export type RecentAnimesProps = {}

export const RecentAnimes: React.FC<RecentAnimesProps> = React.memo(({}) => {
    const { data: recentAnimes, status } = useRecentAnimes()
    const dispatch = useAppDispatch()

    const { navigationWidth } = useSizes()
    const filteredAnimes = recentAnimes?.flat(1).filter((x): x is RecentAnimeData => !!x)

    const count = status !== 'succeeded' ? 0 : filteredAnimes?.length ?? 0
    const handleCardClick = React.useCallback((anime: RecentAnimeData) => {
        if (anime.name && anime.episode) {
            dispatch(watch.watchEpisode(anime))
        } else {
            console.error('No enough data to perform animeSearch')
        }
    }, [])
    return (
        <React.Fragment>
            <VSpace size={32} />
            <CarouselTitleWithLoading
                title={'Recientes'}
                loading={status !== 'succeeded'}
            />
            <div style={{ marginLeft: navigationWidth }}>
                <AnimesGrid
                    count={count}
                    render={({ index }) => {
                        const anime = filteredAnimes![index]
                        if (!anime) return null
                        return (
                            <AnimeEpisodeEntry
                                index={index}
                                visible={true}
                                sliding={false}
                                anime={anime}
                                onClick={handleCardClick}
                            />
                        )
                    }}
                >
                    {status !== 'succeeded' && <AnimeSearchPlaceholder count={36} />}
                </AnimesGrid>
            </div>
        </React.Fragment>
    )
})

RecentAnimes.displayName = 'RecentAnimes'

export default RecentAnimes
