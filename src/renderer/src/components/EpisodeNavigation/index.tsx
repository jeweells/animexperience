import * as React from 'react'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { peek } from '@reducers/peek'
import { player } from '@reducers/player'
import { watch } from '@reducers/watch'

import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { TopView } from '@shared/types'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import Tooltip from '@mui/material/Tooltip'
import { EPISODE_NAVIGATION } from '@selectors'

export const EpisodeNavigation: React.FC = React.memo(() => {
  const data = useAppSelector((d) => d.watch.info)
  const watching = useAppSelector((d) => d.watch.watching)
  const { min, max } = data?.episodesRange ?? {}
  const hasMin =
    typeof min === 'number' && typeof watching?.episode === 'number' && watching.episode > min
  const hasMax =
    typeof max === 'number' && typeof watching?.episode === 'number' && watching.episode < max

  const dispatch = useAppDispatch()
  const topView = useAppSelector((d) => d.topView.views[0])
  React.useLayoutEffect(() => {
    // Avoids the player to keep playing but does not close the modal
    dispatch(player.freeze(topView !== TopView.PLAYER))
  }, [topView])

  return (
    <React.Fragment>
      <Tooltip title={'Episodio anterior'} arrow>
        <IconButton
          data-testid={EPISODE_NAVIGATION.PREVIOUS_EPISODE_BUTTON}
          disabled={!hasMin}
          onClick={() => dispatch(watch.previousEpisode())}
        >
          <KeyboardArrowLeftRoundedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={'Ver anime'} arrow>
        <IconButton
          data-testid={EPISODE_NAVIGATION.ANIME_DETAILS_BUTTON}
          onClick={() => {
            if (!watching?.name) return
            dispatch(peek.peek(watching.name))
          }}
        >
          <MenuRoundedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={'Siguiente episodio'} arrow>
        <IconButton
          data-testid={EPISODE_NAVIGATION.NEXT_EPISODE_BUTTON}
          disabled={!hasMax}
          onClick={() => dispatch(watch.nextEpisode())}
        >
          <KeyboardArrowRightRoundedIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  )
})

EpisodeNavigation.displayName = 'EpisodeNavigation'

export default EpisodeNavigation
