import React from 'react'
import AnimeEntryPlaceholder from '../AnimeEntryPlaceholder'
import GradientFadeIn from '../GradientFadeIn'
import Grid from '@mui/material/Grid'

export type AnimeSearchPlaceholderProps = {
    count: number
}

export const AnimeSearchPlaceholder: React.FC<AnimeSearchPlaceholderProps> = React.memo(
    ({ count }) => {
        return (
            <GradientFadeIn
                count={count}
                renderWrapper={(props, children) => {
                    return (
                        <Grid item lg={3} md={4} sm={6} xs={12} {...props}>
                            {children}
                        </Grid>
                    )
                }}
                render={() => {
                    return <AnimeEntryPlaceholder />
                }}
            />
        )
    },
)

AnimeSearchPlaceholder.displayName = 'AnimeSearchPlaceholder'

export default AnimeSearchPlaceholder
