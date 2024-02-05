import * as React from 'react'
import { styled } from '@mui/system'
import { VideoOption } from '../../../VideoPlayer'
import { usePlayerOption } from './hooks'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import Tooltip from '@mui/material/Tooltip'
import { debug } from '@dev/events'
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import IconButton from '@mui/material/IconButton'

export type OptionButtonProps = {
  onClick?(): void
  option?: VideoOption
  disabled?: boolean
}

const StarButton = styled(IconButton)`
  min-width: 0;
  flex-shrink: 0;
  border: none;
  pointer-events: all;
  &,
  &:hover {
    background: transparent;
  }
`

export const OptionButton: React.FC<OptionButtonProps> = React.memo(
  ({ option, disabled, onClick }) => {
    const { prefer, option: optionInfo, use } = usePlayerOption(option?.name)
    if (!option) return null
    return (
      <MenuItem
        disabled={disabled}
        onClick={() => {
          use()
          onClick?.()
        }}
      >
        <ListItemIcon>
          <Tooltip
            placement="left"
            title={!optionInfo?.prefer ? 'Preferir esta opción' : 'No preferir esta opción'}
            arrow
          >
            <StarButton
              onClick={(e) => {
                e.stopPropagation()
                debug('CLICKING PREFER', optionInfo)
                prefer(!optionInfo?.prefer)
              }}
            >
              {optionInfo?.prefer ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
            </StarButton>
          </Tooltip>
        </ListItemIcon>
        <ListItemText>{option.name}</ListItemText>
      </MenuItem>
    )
  }
)

OptionButton.displayName = 'OptionButton'

export default OptionButton
