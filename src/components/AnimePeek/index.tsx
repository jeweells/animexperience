import React from 'react'
import { Button, Icon, IconButton } from 'rsuite'
import styled from 'styled-components'
import { peek } from '../../../redux/reducers/peek'
import { player } from '../../../redux/reducers/player'
import { watch } from '../../../redux/reducers/watch'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { FCol, FColG16, FRow, FRowG16 } from '../../atoms/Layout'
import { FExpand } from '../../atoms/Misc'
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
    const dispatch = useAppDispatch()
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
                            <img
                                src={info.image}
                                style={{ width: '100%', minHeight: 200 }}
                            />
                            <Button
                                style={{
                                    pointerEvents: 'none',
                                    backgroundColor: 'darkred',
                                    bottom: 16,
                                    right: 16,
                                    position: 'absolute',
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
                        <div style={{ textAlign: 'justify' }}>{info.description}</div>
                        <FColG16>
                            {range(max - min + 1).map((e) => {
                                const epN = e + min
                                return (
                                    <EpisodeButton
                                        onClick={() => {
                                            dispatch(
                                                watch.watchEpisode({
                                                    episode: epN,
                                                    name: info.title,
                                                    link: info.episodeLink.replace(
                                                        info.episodeReplace,
                                                        String(epN),
                                                    ),
                                                    img: info.image,
                                                }),
                                            )
                                            dispatch(player.freeze(false))
                                        }}
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
