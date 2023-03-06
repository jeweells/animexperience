import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import { useAppSelector } from '~/redux/utils'
import { useTopBarHeight } from '../Topbar'
import { makeStyles } from '@mui/styles'
import { alpha, Theme } from '@mui/material'

const useStyles = makeStyles<Theme>((theme) => {
    return {
        root: {
            '& > .MuiPaper-root': {
                backdropFilter: 'blur(1px)',
                backgroundColor: alpha(theme.palette.primary.main, 0.8),
                color: '#ffffffba',
                fontWeight: 'bold',
            },
        },
    }
})

export const Notifications: React.FC = React.memo(() => {
    const classes = useStyles()
    const message = useAppSelector((s) => s.notifications.message)
    const key = useAppSelector((s) => s.notifications.key)
    const topBarHeight = useTopBarHeight()
    const [open, setOpen] = React.useState(false)
    React.useEffect(() => {
        setOpen(!!message)
    }, [key])
    return (
        <Snackbar
            classes={classes}
            autoHideDuration={2000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            style={{
                marginTop: topBarHeight,
            }}
            open={open}
            onClose={() => {
                setOpen(false)
            }}
            message={message}
            key={key}
        />
    )
})

Notifications.displayName = 'Notifications'

export default Notifications
