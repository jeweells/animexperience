import { Fade } from '@material-ui/core'
import { Skeleton, SkeletonProps } from '@material-ui/lab'
import React, { Fragment } from 'react'
import { useSizes } from '../../components/AnimesCarousel/hooks'
import { range } from '../../utils'
import { Wrapper } from '../../components/AnimeEntry'

export type AnimeCarouselContentProps = {
    count: number
}

export const AnimeCarouselContent: React.FC<AnimeCarouselContentProps> = React.memo(({ count }) => {
    const { navigationWidth, gap, containerWidth } = useSizes()
    const animation: SkeletonProps['animation'] = 'pulse'

    return (
        <Fragment>
            {range(count).map((x) => {
                return (
                    <Fade key={x} in={true} timeout={2000 + 500 * x} appear={true}>
                        <div>
                            <Wrapper
                                gap={gap}
                                style={{
                                    cursor: 'default',
                                    opacity: 1 - x * 0.2,
                                }}
                                containerWidth={containerWidth}
                                navigationWidth={navigationWidth}
                            >
                                <Skeleton
                                    animation={animation}
                                    variant={'rect'}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </Wrapper>
                        </div>
                    </Fade>
                )
            })}
        </Fragment>
    )
})

AnimeCarouselContent.displayName = 'AnimeCarouselContent'

export default AnimeCarouselContent
