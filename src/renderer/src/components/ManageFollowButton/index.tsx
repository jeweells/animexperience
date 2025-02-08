import * as React from 'react'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/system'
import ButtonBase from '@mui/material/ButtonBase'
import { Optional } from '@shared/types'
import { RecentAnimeData } from '../../hooks/useRecentAnimes'
import { useFollowedByName } from '~/redux/reducers/followedAnimes/selectors'
import { followedAnimes } from '@reducers/followedAnimes'
import { useAppDispatch } from '~/redux/utils'
import { MANAGE_FOLLOW_BUTTON } from '@selectors'

const Button = styled(ButtonBase)`
  filter: drop-shadow(0px 0px 1px #000000aa);
  font-size: 24px;
`

export type ManageFollowButtonProps = {
  anime: Optional<RecentAnimeData>
}

export const ManageFollowButton: React.FC<ManageFollowButtonProps> =
  React.memo<ManageFollowButtonProps>(({ anime }) => {
    const followed = useFollowedByName(anime?.name ?? '')

    const dispatch = useAppDispatch()

    return (
      <Tooltip arrow title={followed ? 'Dejar de seguir' : 'Seguir'}>
        <Button
          data-testid={MANAGE_FOLLOW_BUTTON.BUTTON}
          onClick={(e) => {
            e.stopPropagation()
            if (!followed) {
              // follow
            } else {
              dispatch(followedAnimes.unfollow({ name: followed?.name }))
            }
          }}
        >
          {followed ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
        </Button>
      </Tooltip>
    )
  })

ManageFollowButton.displayName = 'ManageFollowButton'

export default ManageFollowButton
