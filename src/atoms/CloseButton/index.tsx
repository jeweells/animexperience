import { IconButton } from 'gatsby-theme-material-ui'
import React from 'react'
import { Icon } from 'rsuite'
import { IconButtonProps } from '@material-ui/core'

export const CloseButton: React.FC<IconButtonProps> = React.memo((props) => {
    return (
        <IconButton {...props}>
            <Icon icon={'close'} />
        </IconButton>
    )
})

CloseButton.displayName = 'CloseButton'

export default CloseButton
