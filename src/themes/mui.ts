import { createMuiTheme } from '@material-ui/core/styles'
import { SkeletonClassKey } from '@material-ui/lab/Skeleton'

declare module '@material-ui/core/styles/overrides' {
    export interface ComponentNameToClassKey {
        MuiSkeleton: SkeletonClassKey
    }
}

export const muiTheme = createMuiTheme({
    overrides: {
        MuiSkeleton: {
            root: {
                backgroundColor: 'rgba(255, 255, 255, 0.11)',
            },
            pulse: {
                animation: 'MuiSkeleton-keyframes-pulse 3s ease-in 0.5s infinite',
            },
        },
    },
})
