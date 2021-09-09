import { ButtonProps, makeStyles, ButtonBase, lighten } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => {
    const root = theme.overrides?.MuiButton?.root
    const text = theme.overrides?.MuiButton?.text
    return {
        common: {
            transition: 'color 0.2s linear, background-color 0.3s linear',
        },
        root: {
            ...root,
            ...text,
            borderRadius: 0,
        },
        secondary: {
            ...root,
            ...text,
            backgroundColor: theme.palette.secondary.main,
            borderRadius: 0,
        },
        wrapper: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            borderRadius: root?.borderRadius,
            overflow: 'hidden',
            '&:hover $root': {
                backgroundColor: lighten(theme.palette.secondary.main, 0.05),
            },
            '&:hover $secondary': {
                backgroundColor: lighten(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    root?.backgroundColor ?? theme.palette.primary.main,
                    0.25,
                ),
            },
        },
    }
})

export type ButtonWIconProps = {
    icon: React.ReactNode
} & ButtonProps

const cls = (...arr: (string | undefined)[]) => arr.filter(Boolean).join(' ')

export const ButtonWIcon: React.FC<ButtonWIconProps> = React.memo(
    ({ icon, children, ...props }) => {
        const classes = useStyles()
        return (
            <ButtonBase
                {...props}
                classes={{
                    ...props.classes,
                    root: cls(classes.wrapper, props.classes?.root),
                }}
            >
                <div className={cls(classes.common, classes.secondary)}>{icon}</div>
                <div className={cls(classes.common, classes.root)}>{children}</div>
            </ButtonBase>
        )
    },
)

ButtonWIcon.displayName = 'ButtonWIcon'

export default ButtonWIcon
