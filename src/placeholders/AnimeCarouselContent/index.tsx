import { Fade } from '@material-ui/core'
import React, { Fragment } from 'react'
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
                        <Fade key={x} in={true} timeout={2000 + 500 * x} appear={true}>
                            <div>
                                <AnimeEntryPlaceholder
                                    style={{
                                        opacity: 1 - x * 0.2,
                                    }}
                                />
                            </div>
                        </Fade>
                    )
                })}
            </Fragment>
        )
    },
)

AnimeCarouselContent.displayName = 'AnimeCarouselContent'

export default AnimeCarouselContent
