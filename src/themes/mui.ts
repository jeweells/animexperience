import { SkeletonClassKey } from '@material-ui/lab/Skeleton'

declare module '@material-ui/core/styles/overrides' {
    export interface ComponentNameToClassKey {
        MuiSkeleton: SkeletonClassKey
    }
}

export * from '../gatsby-theme-material-ui-top-layout/theme'
