import React, { useLayoutEffect, useMemo } from 'react'
import { recommendations } from '../../../redux/reducers/recommendations'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { AnimeCarouselContent } from '../../placeholders/AnimeCarouselContent'
import { AnimeDetails, AnimeDetailsEntry } from '../AnimeDetailsEntry'
import { AnimesCarousel } from '../AnimesCarousel'

export type AnimeRecommendationsProps = {
    animeName: string
}

const getRandomTitleBuilder = () => {
    const messages: Array<(name: string) => string> = [
        (name) => 'Porque viste ' + name,
        (name) => 'Similares a ' + name,
    ]
    return messages[Math.floor(Math.random() * messages.length)]
}

export const AnimeRecommendations: React.FC<AnimeRecommendationsProps> = React.memo(
    ({ animeName }) => {
        const buildTitle = useMemo(() => getRandomTitleBuilder(), [])
        const dispatch = useAppDispatch()
        const _recommendations = useAppSelector((d) => d.recommendations[animeName])
        const parsedRecommendations = useMemo<AnimeDetails[]>(
            () =>
                _recommendations?.recommendations?.map((x) => {
                    return {
                        name: x.name,
                        image: x.image,
                    }
                }) ?? [],
            [_recommendations],
        )
        useLayoutEffect(() => {
            dispatch(recommendations.fetchRecommendations(animeName))
        }, [])
        const status = _recommendations?.status
        const count = status !== 'succeeded' ? 1 : parsedRecommendations.length

        return (
            <React.Fragment>
                <AnimesCarousel
                    title={buildTitle(animeName)}
                    count={count}
                    loading={status !== 'succeeded'}
                    render={({ index, visible, sliding }) => {
                        if (status !== 'succeeded') {
                            // This is a skeleton
                            return (
                                <AnimeCarouselContent
                                    key={'placeholder' + index}
                                    count={5}
                                />
                            )
                        }
                        const x = parsedRecommendations[index]
                        if (!x) return null
                        return (
                            <AnimeDetailsEntry
                                index={index}
                                visible={visible}
                                sliding={sliding}
                                key={`${x.name}`}
                                anime={x}
                                onClick={(anime) => {
                                    console.debug('CLICKED', anime)
                                }}
                            />
                        )
                    }}
                />
            </React.Fragment>
        )
    },
)

AnimeRecommendations.displayName = 'AnimeRecommendations'

export default AnimeRecommendations
