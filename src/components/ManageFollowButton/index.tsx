import React from 'react'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import Tooltip from '@mui/material/Tooltip'
import styled from 'styled-components'
import ButtonBase from '@mui/material/ButtonBase'
import { Optional } from '../../types'
import { RecentAnimeData } from '../../hooks/useRecentAnimes'
import { useFollowedByName } from '~/redux/reducers/followedAnimes/selectors'
import { followedAnimes } from '@reducers'
import { useAppDispatch } from '~/redux/utils'

const Button = styled(ButtonBase)`
    filter: drop-shadow(0px 0px 1px #000000aa);
    font-size: 24px;
`

type ManageFollowButtonProps = {
    anime: Optional<RecentAnimeData>
}

export const ManageFollowButton: React.FC<ManageFollowButtonProps> =
    React.memo<ManageFollowButtonProps>(({ anime }) => {
        const followed = useFollowedByName(anime?.name ?? '')

        const dispatch = useAppDispatch()

        return (
            <Tooltip arrow title={followed ? 'Dejar de seguir' : 'Seguir'}>
                <Button
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
