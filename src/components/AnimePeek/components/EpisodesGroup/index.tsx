import { Collapse } from '@material-ui/core'
import React from 'react'
import { AnimeInfo } from '../../../../../globals/types'
import { FCol, FColG16 } from '../../../../atoms/Layout'
import { range } from '../../../../utils'
import { EpisodeButton, SEpisodeButton } from '../EpisodeButton'

export type EpisodesGroupProps = {
    size: number
    min: number
    max: number
    info: AnimeInfo
}

export const EpisodesGroup: React.FC<EpisodesGroupProps> = React.memo(
    ({ size, info, min, max }) => {
        const [show, setShow] = React.useState(false)

        const renderEpisodes = () => {
            return (
                <FColG16>
                    {range(max - min + 1).map((e) => {
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
