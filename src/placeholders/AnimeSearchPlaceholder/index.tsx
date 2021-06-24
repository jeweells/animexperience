import React from 'react'
import AnimeEntryPlaceholder from '../AnimeEntryPlaceholder'
import GradientFadeIn from '../GradientFadeIn'

export type AnimeSearchPlaceholderProps = {
    count: number
}

export const AnimeSearchPlaceholder: React.FC<AnimeSearchPlaceholderProps> = React.memo(
    ({ count }) => {
        return (
            <GradientFadeIn
                count={count}
                render={() => {
                    return <AnimeEntryPlaceholder />
                }}
            />
        )
    },
)

AnimeSearchPlaceholder.displayName = 'AnimeSearchPlaceholder'

export default AnimeSearchPlaceholder
