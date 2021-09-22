import React from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'

export const CloseButton = React.memo<IconButtonProps>((props) => {
    return (
        <IconButton {...props}>
            <CloseRoundedIcon />
        </IconButton>
    )
})

CloseButton.displayName = 'CloseButton'

export default CloseButton
