import moment from 'moment'
import React, { useRef } from 'react'
import { Button, Icon, IconButton } from 'rsuite'
import styled from 'styled-components'
import { AnimeInfo } from '../../../globals/types'
import { peek } from '../../../redux/reducers/peek'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { FCol, FColG16, FRow, FRowG16 } from '../../atoms/Layout'
import { FExpand } from '../../atoms/Misc'
import { AnimePeekTitle, AnimePeekType } from '../../atoms/Text'
import AnimeRecommendations from '../AnimeRecommendations'
import Episodes from './components/Episodes'
import { ContentContext } from '../Topbar'
import Image from './components/Image'

const TitleRow = styled(FRow)`
    align-items: center;
    gap: 16px;
`

const ImageCol = styled(FCol)`
    min-width: 300px;
    max-width: 300px;
    gap: 16px;
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
                    <FRowG16>
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
                            <FRowG16
                                style={{ flexWrap: 'wrap', justifyContent: 'center' }}
                            >
                                {info.tags?.map((tag) => {
                                    return <Button key={tag}>{tag}</Button>
                                })}
                            </FRowG16>
                            {typeof info.emitted?.from === 'number' && (
                                <div>{`Emitido: ${moment
                                    .unix(info.emitted.from)
                                    .format('DD/MM/YYYY')}`}</div>
                            )}
                        </ImageCol>
                        <FColG16 style={{ flex: 1 }}>
                            <div style={{ textAlign: 'justify' }}>{info.description}</div>
                            <Episodes info={info} />
                        </FColG16>
                    </FRowG16>
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
