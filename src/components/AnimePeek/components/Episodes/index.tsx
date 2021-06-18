import React from 'react'
import { AnimeInfo } from '../../../../../globals/types'
import { FColG16 } from '../../../../atoms/Layout'
import { Optional } from '../../../../types'
import { range } from '../../../../utils'
import EpisodesGroup from '../EpisodesGroup'

export type EpisodesProps = {
    info: Optional<AnimeInfo>
    groupSize?: number
}

export const Episodes: React.FC<EpisodesProps> = React.memo(
    ({ info, groupSize = 30 }) => {
        if (!info) return null
        const { min, max } = info.episodesRange ?? {
            min: 0,
            max: 0,
        }
        const episodes = max - min + 1
        return (
            <FColG16>
                {range(Math.ceil(episodes / groupSize)).map((group) => {
                    return (
                        <EpisodesGroup
                            key={'group-' + group}
                            size={groupSize}
                            min={group * groupSize + min}
                            max={Math.min((group + 1) * groupSize + min - 1, max)}
                            info={info}
                        />
                    )
                })}
            </FColG16>
        )
    },
)

Episodes.displayName = 'Episodes'

export default Episodes
