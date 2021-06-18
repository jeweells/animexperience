import React, { useMemo, useState } from 'react'
import { Icon, IconButton } from 'rsuite'
import { AnimeInfo } from '../../../../../globals/types'
import { FColG16, FRow } from '../../../../atoms/Layout'
import { Optional } from '../../../../types'
import { range } from '../../../../utils'
import EpisodesGroup from '../EpisodesGroup'

export type EpisodesProps = {
    info: Optional<AnimeInfo>
    groupSize?: number
}

export const Episodes: React.FC<EpisodesProps> = React.memo(
    ({ info, groupSize = 30 }) => {
        const [sort, setSort] = useState(-1)
        if (!info) return null
        const { min, max } = info.episodesRange ?? {
            min: 0,
            max: 0,
        }
        const episodes = max - min + 1

        const groups = useMemo(() => {
            const _groups = range(Math.ceil(episodes / groupSize))
            if (sort < 0) {
                return _groups.reverse()
            }
            return _groups
        }, [episodes, groupSize, sort])
        return (
            <FColG16>
                <FRow style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <IconButton
                        icon={
                            <Icon
                                icon={sort > 0 ? 'sort-numeric-desc' : 'sort-numeric-asc'}
                            />
                        }
                        placement={'left'}
                        onClick={() => setSort((s) => -s)}
                    >
                        Ordenar
                    </IconButton>
                </FRow>
                {groups.map((group) => {
                    return (
                        <EpisodesGroup
                            sort={sort}
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
