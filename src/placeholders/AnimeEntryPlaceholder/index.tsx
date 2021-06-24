import { Skeleton, SkeletonProps } from '@material-ui/lab'
import React from 'react'
import { Wrapper } from '../../components/AnimeEntry'
import { useSizes } from '../../components/AnimesCarousel/hooks'

export type AnimeEntryPlaceholderProps = {} & React.ComponentProps<typeof Wrapper>

export const AnimeEntryPlaceholder: React.FC<AnimeEntryPlaceholderProps> = React.memo(
    ({ ...rest }) => {
        const animation: SkeletonProps['animation'] = 'pulse'
        const { navigationWidth, gap, containerWidth } = useSizes()

        return (
            <Wrapper
                gap={gap}
                containerWidth={containerWidth}
                navigationWidth={navigationWidth}
                {...rest}
                style={{
                    cursor: 'default',
                    ...(rest.style || {}),
                }}
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
        )
    },
)

AnimeEntryPlaceholder.displayName = 'AnimeEntryPlaceholder'

export default AnimeEntryPlaceholder
