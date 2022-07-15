import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { AnimeInfo } from '../../../../../globals/types'
import { watch } from '../../../../../redux/reducers/watch'
import { useAppDispatch } from '../../../../../redux/store'
import { FRowG16 } from '../../../../atoms/Layout'
import { useWatched } from '../../../../hooks/useWatched'
import WatchedRange from '../../../WatchedRange'
import Button from '@mui/material/Button'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
export const SEpisodeButton = styled(Button)`
    width: 100%;
    text-align: left;
    justify-content: flex-start;
`

export type EpisodeButtonProps = {
    info: AnimeInfo
    episode: number
}

const WatchedInfo = styled(FRowG16)`
    flex: 1;
    align-items: center;
`

const Content = styled(FRowG16)`
    align-items: center;
    width: 100%;
    justify-content: space-between;
`

export const EpisodeButton: React.FC<EpisodeButtonProps> = React.memo(
    ({ episode, info }) => {
        const epData = useMemo(() => {
            return {
                episode,
                name: info.title,
                link: info.episodeLink.replace(info.episodeReplace, String(episode)),
                img: info.image,
            }
        }, [info, episode])
        const watched = useWatched(epData)
        const dispatch = useAppDispatch()
        return (
            <SEpisodeButton
                onClick={useCallback(() => {
                    dispatch(watch.watchEpisode(epData))
                }, [])}
            >
                <Content>
                    <div>{`Episodio ${episode}`}</div>
                    <WatchedInfo>
                        {watched && (
                            <WatchedRange
                                info={watched}
                                showTime={true}
                                hideBorder={true}
                            />
                        )}
                    </WatchedInfo>
                    <PlayArrowRoundedIcon
                        style={{ fontSize: '1.4rem', overflow: 'hidden' }}
                    />
                </Content>
            </SEpisodeButton>
        )
    },
)

EpisodeButton.displayName = 'EpisodeButton'

export default EpisodeButton
