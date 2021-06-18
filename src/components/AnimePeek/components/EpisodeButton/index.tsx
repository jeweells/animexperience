import React, { useCallback } from 'react'
import { Button } from 'rsuite'
import styled from 'styled-components'
import { AnimeInfo } from '../../../../../globals/types'
import { watch } from '../../../../../redux/reducers/watch'
import { useAppDispatch } from '../../../../../redux/store'

export const SEpisodeButton = styled(Button)`
    width: 100%;
    text-align: left;
`

export type EpisodeButtonProps = {
    info: AnimeInfo
    episode: number
}

export const EpisodeButton: React.FC<EpisodeButtonProps> = React.memo(
    ({ episode, info }) => {
        const dispatch = useAppDispatch()
        return (
            <SEpisodeButton
                onClick={useCallback(() => {
                    dispatch(
                        watch.watchEpisode({
                            episode,
                            name: info.title,
                            link: info.episodeLink.replace(
                                info.episodeReplace,
                                String(episode),
                            ),
                            img: info.image,
                        }),
                    )
                }, [])}
            >
                {`Episodio ${episode}`}
            </SEpisodeButton>
        )
    },
)

EpisodeButton.displayName = 'EpisodeButton'

export default EpisodeButton
