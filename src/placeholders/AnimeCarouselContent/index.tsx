import React, { Fragment } from 'react'
import { FadeInRL } from '../../atoms/FadeIn'
import { range } from '../../utils'
import AnimeEntryPlaceholder from '../AnimeEntryPlaceholder'

export type AnimeCarouselContentProps = {
    count: number
}

export const AnimeCarouselContent: React.FC<AnimeCarouselContentProps> = React.memo(
    ({ count }) => {
        return (
            <Fragment>
                {range(count).map((x) => {
                    return (
                        <FadeInRL key={x} duration={1500 + 1500 * x}>
                            <AnimeEntryPlaceholder
                                style={{
                                    opacity: 1 - x * 0.1,
                                }}
                            />
                        </FadeInRL>
                    )
                })}
            </Fragment>
        )
    },
)

AnimeCarouselContent.displayName = 'AnimeCarouselContent'

export default AnimeCarouselContent
