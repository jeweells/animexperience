import React, { useMemo } from 'react'
import { AnimeInfo } from '../../../../../globals/types'
import { FCol, FColG16 } from '../../../../atoms/Layout'
import { range } from '../../../../utils'
import { EpisodeButton, SEpisodeButton } from '../EpisodeButton'
import Collapse from '@mui/material/Collapse'

export type EpisodesGroupProps = {
    size: number
    min: number
    max: number
    info: AnimeInfo
    sort: number
}

export const EpisodesGroup: React.FC<EpisodesGroupProps> = React.memo(
    ({ size, info, min, max, sort }) => {
        const [show, setShow] = React.useState(false)
        const episodes = useMemo(() => {
            const _episodes = range(max - min + 1)
            if (sort < 0) {
                return _episodes.reverse()
            }
            return _episodes
        }, [max, min, sort])

        const renderEpisodes = () => {
            return (
                <FColG16>
                    {episodes.map((e) => {
                        const epN = e + min
                        return <EpisodeButton key={epN} episode={epN} info={info} />
                    })}
                </FColG16>
            )
        }
        if (max - min + 1 === size) {
            return (
                <React.Fragment>
                    <SEpisodeButton onClick={() => setShow((p) => !p)}>
                        {`Episodios ${min} - ${max}`}
                    </SEpisodeButton>
                    <Collapse
                        in={show}
                        mountOnEnter={false}
                        unmountOnExit={true}
                        appear={false}
                    >
                        <FCol style={{ paddingLeft: 16 }}>{renderEpisodes()}</FCol>
                    </Collapse>
                </React.Fragment>
            )
        }
        return renderEpisodes()
    },
)

EpisodesGroup.displayName = 'EpisodesGroup'

export default EpisodesGroup
