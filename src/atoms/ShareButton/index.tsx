import React from 'react'
import ShareIcon from '@mui/icons-material/Share'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'

export const ShareButton = React.memo<IconButtonProps>((props) => {
    return (
        <IconButton {...props}>
            <ShareIcon />
        </IconButton>
    )
})

ShareButton.displayName = 'ShareButton'

export default ShareButton
