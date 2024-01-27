import * as React from 'react'
import ShareIcon from '@mui/icons-material/Share'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

export type ShareButtonProps = IconButtonProps & { tooltip?: string }

export const ShareButton = React.memo<ShareButtonProps>(
  ({ tooltip = 'Copiar al portapapeles', ...props }) => {
    return (
      <Tooltip title={tooltip} arrow>
        <IconButton {...props}>
          <ShareIcon />
        </IconButton>
      </Tooltip>
    )
  }
)

ShareButton.displayName = 'ShareButton'

export default ShareButton
