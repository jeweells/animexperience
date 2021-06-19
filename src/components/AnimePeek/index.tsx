import moment from 'moment'
import React, { useRef } from 'react'
import { Button, Divider, Icon, IconButton } from 'rsuite'
import styled from 'styled-components'
import { AnimeInfo } from '../../../globals/types'
import { peek } from '../../../redux/reducers/peek'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { FCol, FColG16, FColG32, FRow, FRowG16, FRowG32 } from '../../atoms/Layout'
import { FExpand } from '../../atoms/Misc'
import { AnimePeekTitle, AnimePeekType } from '../../atoms/Text'
import AnimeRecommendations from '../AnimeRecommendations'
import Episodes from './components/Episodes'
import { ContentContext } from '../Topbar'
import Image from './components/Image'
import Info from './components/Info'

const TitleRow = styled(FRow)`
    align-items: center;
    gap: 16px;
`

const ImageCol = styled(FCol)`
    min-width: 300px;
    max-width: 300px;
`

const SDivider = styled(Divider)`
    margin-left: 16px;
    margin-right: 16px;
    opacity: 0.5;
`

export type AnimePeekProps = {}

export const AnimePeek: React.FC<AnimePeekProps> = React.memo(({}) => {
    const info = useAppSelector((d) => d.peek.info)
    const dispatch = useAppDispatch()
    const contentRef = useRef<HTMLDivElement>(null)
    if (!info) return null
    return (
        <ContentContext.Provider value={contentRef}>
            <FColG16
                ref={contentRef}
                style={{
                    // @ts-ignore
                    overflowY: 'overlay',
                    paddingBottom: 32,
                    height: '100%',
                    position: 'relative',
                }}
            >
                <FColG16
                    style={{
                        padding: '32px 64px',
                    }}
                >
                    <FCol>
                        <TitleRow>
                            <AnimePeekTitle>{info.title}</AnimePeekTitle>
                            <AnimePeekType>{info.type}</AnimePeekType>
                            <FExpand />
                            <IconButton
                                onClick={() => {
                                    dispatch(peek.setPeeking(undefined))
                                }}
                                icon={<Icon icon={'close'} size={'lg'} />}
                                size={'lg'}
                            />
                        </TitleRow>
                        {(info.otherTitles?.length ?? 0) > 0 && (
                            <AnimePeekType>{info.otherTitles?.join(', ')}</AnimePeekType>
                        )}
                    </FCol>
                    <FRowG32>
                        <ImageCol>
                            <div style={{ position: 'relative' }}>
                                {info.title && (
                                    <Image
                                        animeName={info.title}
                                        src={info.image}
                                        containerStyle={{
                                            width: '100%',
                                            overflow: 'hidden',
                                            borderRadius: 8,
                                            height: 425,
                                        }}
                                        style={{
                                            width: '100%',
                                            height: 425,
                                            objectFit: 'cover',
                                        }}
                                    />
                                )}
                                <Button
                                    style={{
                                        pointerEvents: 'none',
                                        backgroundColor: ({
                                            'En emisión': '#3d773d',
                                            Finalizada: 'darkred',
                                        } as Record<
                                            Required<AnimeInfo>['status'],
                                            string
                                        >)[info.status ?? 'Finalizada'],
                                        bottom: 16,
                                        right: 16,
                                        position: 'absolute',
                                    }}
                                >
                                    {info.status}
                                </Button>
                            </div>
                            <SDivider />
                            <FRowG16 style={{ flexWrap: 'wrap' }}>
                                {info.tags?.map((tag) => {
                                    return <Button key={tag}>{tag}</Button>
                                })}
                            </FRowG16>
                            <SDivider />
                            {typeof info.emitted?.from === 'number' && (
                                <React.Fragment>
                                    <Info icon={'calendar-o'} title={'Emitido'}>
                                        {`${moment
                                            .unix(info.emitted.from)
                                            .format('DD/MM/YYYY')}`}
                                    </Info>
                                </React.Fragment>
                            )}
                        </ImageCol>
                        <FColG32 style={{ flex: 1 }}>
                            <Info icon={'align-justify'} title={'Sinopsis'}>
                                <div style={{ textAlign: 'justify' }}>
                                    {info.description}
                                </div>
                            </Info>
                            <Info icon={'tv'} title={'Episodios'}>
                                <Episodes info={info} />
                            </Info>
                        </FColG32>
                    </FRowG32>
                </FColG16>
                {info.title && (
                    <div>
                        <AnimeRecommendations
                            animeName={info.title}
                            title={'Similares a ' + info.title}
                        />
                    </div>
                )}
            </FColG16>
        </ContentContext.Provider>
    )
})

AnimePeek.displayName = 'AnimePeek'

export default AnimePeek
