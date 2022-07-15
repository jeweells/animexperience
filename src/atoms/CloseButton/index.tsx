import React from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

export const CloseButton = React.memo<IconButtonProps>((props) => {
    return (
        <Tooltip title='Cerrar' arrow>
            <IconButton {...props}>
                <CloseRoundedIcon />
            </IconButton>
        </Tooltip>
    )
})

CloseButton.displayName = 'CloseButton'

export default CloseButton
