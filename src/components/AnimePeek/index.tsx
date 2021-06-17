import React from 'react'
import { Button } from 'rsuite'
import styled from 'styled-components'
import { useAppSelector } from '../../../redux/store'
import { FCol, FColG16, FRow, FRowG16 } from '../../atoms/Layout'
import { AnimePeekTitle, AnimePeekType } from '../../atoms/Text'
import { range } from '../../utils'

const TitleRow = styled(FRow)`
    align-items: center;
    gap: 16px;
`

const ImageCol = styled(FCol)`
    min-width: 300px;
    gap: 16px;
`

const EpisodeButton = styled(Button)`
    width: 100%;
`

export type AnimePeekProps = {}

export const AnimePeek: React.FC<AnimePeekProps> = React.memo(({}) => {
    const info = useAppSelector((d) => d.peek.info)
    if (!info) return null
    const { min, max } = info.episodesRange ?? {
        min: 0,
        max: 0,
    }
    return (
        <React.Fragment>
            <FColG16
                style={{
                    // @ts-ignore
                    overflowY: 'overlay',
                    padding: '32px 64px',
                    height: '100%',
                }}
            >
                <TitleRow>
                    <AnimePeekTitle>{info.title}</AnimePeekTitle>
                    <AnimePeekType>{info.type}</AnimePeekType>
                </TitleRow>
                {(info.otherTitles?.length ?? 0) > 0 && (
                    <AnimePeekType>{info.otherTitles?.join(', ')}</AnimePeekType>
                )}
                <FRowG16>
                    <ImageCol>
                        <div style={{ position: 'relative' }}>
                            <img src={info.image} />
                            <Button
                                style={{
                                    pointerEvents: 'none',
                                    backgroundColor: 'darkred',
                                }}
                            >
                                {info.status}
                            </Button>
                        </div>
                        <FRowG16 style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                            {info.tags?.map((tag) => {
                                return <Button key={tag}>{tag}</Button>
                            })}
                        </FRowG16>
                    </ImageCol>
                    <FColG16>
                        <div>{info.description}</div>
                        <FColG16>
                            {range(max - min + 1).map((e) => {
                                const epN = e + min
                                return (
                                    <EpisodeButton
                                        key={epN}
                                    >{`Episodio ${epN}`}</EpisodeButton>
                                )
                            })}
                        </FColG16>
                    </FColG16>
                </FRowG16>
            </FColG16>
        </React.Fragment>
    )
})

AnimePeek.displayName = 'AnimePeek'

export default AnimePeek
