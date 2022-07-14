import React from 'react'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { peek } from '../../../redux/reducers/peek'
import { player } from '../../../redux/reducers/player'
import { watch } from '../../../redux/reducers/watch'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { TopView } from '../../types'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
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
            >
                <KeyboardArrowLeftRoundedIcon />
            </IconButton>
            <IconButton
                onClick={() => {
                    if (!watching?.name) return
                    dispatch(peek.peek(watching.name))
                }}
            >
                <MenuRoundedIcon />
            </IconButton>
            <IconButton disabled={!hasMax} onClick={() => dispatch(watch.nextEpisode())}>
                <KeyboardArrowRightRoundedIcon />
            </IconButton>
        </React.Fragment>
    )
})

EpisodeNavigation.displayName = 'EpisodeNavigation'

export default EpisodeNavigation
