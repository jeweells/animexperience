import React from 'react'
import { Icon, IconButton } from 'rsuite'
import { watch } from '../../../redux/reducers/watch'
import { useAppDispatch, useAppSelector } from '../../../redux/store'

export type EpisodeNavigationProps = {}

export const EpisodeNavigation: React.FC<EpisodeNavigationProps> = React.memo(({}) => {
    const data = useAppSelector((d) => d.watch.info)
    const watching = useAppSelector((d) => d.watch.watching)
    const { min, max } = data?.episodesRange ?? {}
    const hasMin =
        typeof min === 'number' &&
        typeof watching?.episode === 'number' &&
        watching.episode > min
    const hasMax =
        typeof max === 'number' &&
        typeof watching?.episode === 'number' &&
        watching.episode < max

    const dispatch = useAppDispatch()
    return (
        <React.Fragment>
            <IconButton
                disabled={!hasMin}
                onClick={() => dispatch(watch.previousEpisode())}
                icon={<Icon icon={'angle-left'} size={'lg'} />}
                size={'lg'}
            />
            <IconButton
                onClick={() => {
                    console.error('Not implemented yet')
                }}
                icon={<Icon icon={'bars'} size={'lg'} />}
                size={'lg'}
            />
            <IconButton
                disabled={!hasMax}
                onClick={() => dispatch(watch.nextEpisode())}
                icon={<Icon icon={'angle-right'} size={'lg'} />}
                size={'lg'}
            />
        </React.Fragment>
    )
})

EpisodeNavigation.displayName = 'EpisodeNavigation'

export default EpisodeNavigation
