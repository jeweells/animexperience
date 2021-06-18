import React from 'react'
import { Icon, IconButton } from 'rsuite'
import { peek } from '../../../redux/reducers/peek'
import { player } from '../../../redux/reducers/player'
import { watch } from '../../../redux/reducers/watch'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { TopView } from '../../types'

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
    const topview = useAppSelector((d) => d.topview.views[0])
    React.useLayoutEffect(() => {
        // Avoids the player to keep playing but does not closes the modal
        dispatch(player.freeze(topview !== TopView.PLAYER))
    }, [topview])

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
                    if (!watching?.name) return
                    dispatch(peek.peek(watching.name))
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
