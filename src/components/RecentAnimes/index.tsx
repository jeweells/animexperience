import React from 'react'
import { watch } from '../../../redux/reducers/watch'
import { VSpace } from '../../atoms/Spacing'
import { RecentAnimeData, useRecentAnimes } from '../../hooks/useRecentAnimes'
import { AnimeCarouselContent } from '../../placeholders/AnimeCarouselContent'
import { AnimeEpisodeEntry } from '../AnimeEpisodeEntry'
import { AnimesCarousel } from '../AnimesCarousel'
import { useAppDispatch } from '../../../redux/utils'

export type RecentAnimesProps = {}

export const RecentAnimes: React.FC<RecentAnimesProps> = React.memo(({}) => {
    const { data: recentAnimes, status } = useRecentAnimes()
    const dispatch = useAppDispatch()

    const filteredAnimes = recentAnimes?.flat(1).filter((x): x is RecentAnimeData => !!x)

    const count = status !== 'succeeded' ? 1 : filteredAnimes?.length ?? 1
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
            <AnimesCarousel
                title={'Recientes'}
                count={count}
                loading={status !== 'succeeded'}
                render={({ index, visible, sliding }) => {
                    if (status !== 'succeeded') {
                        return (
                            <AnimeCarouselContent key={'placeholder' + index} count={5} />
                        )
                    }
                    if (!filteredAnimes) return null
                    const x = filteredAnimes[index]
                    return (
                        <AnimeEpisodeEntry
                            index={index}
                            visible={visible}
                            sliding={sliding}
                            key={`${x.name} ${x.episode}`}
                            anime={x}
                            onClick={handleCardClick}
                        />
                    )
                }}
            />
        </React.Fragment>
    )
})

RecentAnimes.displayName = 'RecentAnimes'

export default RecentAnimes
