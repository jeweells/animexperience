import { Fade } from '@material-ui/core'
import { Skeleton, SkeletonProps } from '@material-ui/lab'
import React from 'react'
import { Icon, IconButton } from 'rsuite'
import { FCol, FColG16, FColG32, FColG8, FRowG32 } from '../../atoms/Layout'
import { FExpand } from '../../atoms/Misc'
import { AnimePeekTitle } from '../../atoms/Text'
import { Content, ImageCol, TitleRow, Wrapper } from '../../components/AnimePeek'
import AnimesCarousel from '../../components/AnimesCarousel'
import { range } from '../../utils'
import AnimeCarouselContent from '../AnimeCarouselContent'
import { GradientFadeIn } from '../GradientFadeIn'

export type AnimePeekPlaceholderProps = {
    onClose?(): void
}

export const AnimePeekPlaceholder: React.FC<AnimePeekPlaceholderProps> = React.memo(
    ({ onClose }) => {
        const animation: SkeletonProps['animation'] = 'pulse'

        return (
            <Fade in={true} appear={true} timeout={1000}>
                <Wrapper>
                    <Content>
                        <FCol>
                            <TitleRow>
                                <AnimePeekTitle style={{ width: '40%' }}>
                                    <Skeleton
                                        animation={animation}
                                        variant={'text'}
                                        width={'100%'}
                                    />
                                </AnimePeekTitle>
                                <FExpand />
                                <IconButton
                                    onClick={onClose}
                                    icon={<Icon icon={'close'} size={'lg'} />}
                                    size={'lg'}
                                />
                            </TitleRow>
                            <div style={{ opacity: 0.5 }}>
                                <Skeleton
                                    animation={animation}
                                    variant={'text'}
                                    width={'30%'}
                                />
                            </div>
                        </FCol>
                        <FRowG32>
                            <ImageCol>
                                <Skeleton
                                    animation={animation}
                                    height={425}
                                    variant={'rect'}
                                    width={'100%'}
                                    style={{
                                        borderRadius: 8,
                                    }}
                                />
                                <FColG8 style={{ flexWrap: 'wrap', marginTop: 16 }}>
                                    {range(2).map((x) => (
                                        <React.Fragment key={x}>
                                            <Skeleton
                                                animation={animation}
                                                variant={'text'}
                                                width={'40%'}
                                                style={{ marginBottom: 16 }}
                                            />
                                            <GradientFadeIn
                                                count={5}
                                                render={() => {
                                                    return (
                                                        <Skeleton
                                                            animation={animation}
                                                            variant={'text'}
                                                            width={'100%'}
                                                        />
                                                    )
                                                }}
                                            />
                                        </React.Fragment>
                                    ))}
                                </FColG8>
                            </ImageCol>
                            <FColG32 style={{ flex: 1 }}>
                                <Skeleton
                                    animation={animation}
                                    variant={'text'}
                                    width={'30%'}
                                />
                                <FCol style={{ width: '100%', gap: '8px' }}>
                                    <GradientFadeIn
                                        count={8}
                                        render={(x) => {
                                            return (
                                                <Skeleton
                                                    animation={animation}
                                                    variant={'text'}
                                                    width={x === 7 ? '90%' : '100%'}
                                                />
                                            )
                                        }}
                                    />
                                </FCol>
                                <Skeleton
                                    animation={animation}
                                    variant={'text'}
                                    width={'30%'}
                                />
                                <FColG16 style={{ width: '100%' }}>
                                    <GradientFadeIn
                                        count={10}
                                        render={() => {
                                            return (
                                                <Skeleton
                                                    animation={animation}
                                                    height={40}
                                                    variant={'rect'}
                                                    width={'100%'}
                                                    style={{
                                                        borderRadius: 8,
                                                    }}
                                                />
                                            )
                                        }}
                                    />
                                </FColG16>
                            </FColG32>
                        </FRowG32>
                    </Content>
                    <div>
                        <AnimesCarousel
                            count={1}
                            loading={true}
                            render={({ index }) => {
                                return (
                                    <AnimeCarouselContent
                                        key={'placeholder' + index}
                                        count={5}
                                    />
                                )
                            }}
                        />
                    </div>
                </Wrapper>
            </Fade>
        )
    },
)

AnimePeekPlaceholder.displayName = 'AnimePeekPlaceholder'

export default AnimePeekPlaceholder
