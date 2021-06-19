import React, { useCallback, useMemo } from 'react'
import { Button, Icon } from 'rsuite'
import styled from 'styled-components'
import { AnimeInfo } from '../../../../../globals/types'
import { watch } from '../../../../../redux/reducers/watch'
import { useAppDispatch } from '../../../../../redux/store'
import { FRowG16 } from '../../../../atoms/Layout'
import { useWatched } from '../../../../hooks/useWatched'
import WatchedRange from '../../../WatchedRange'

export const SEpisodeButton = styled(Button)`
    width: 100%;
    text-align: left;
`

export type EpisodeButtonProps = {
    info: AnimeInfo
    episode: number
}

const WatchedInfo = styled(FRowG16)`
    flex: 1;
    align-items: center;
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
                <FRowG16 style={{ alignItems: 'center' }}>
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
                    <Icon icon={'caret-right'} />
                </FRowG16>
            </SEpisodeButton>
        )
    },
)

EpisodeButton.displayName = 'EpisodeButton'

export default EpisodeButton
