import React, { Fragment } from 'react'
import { AnimeTitle } from '../../atoms/Text'
import { Optional } from '../../types'
import AnimeEntry, { AnimeEntryProps } from '../AnimeEntry'
import { AnimeInfo, Img } from '../AnimeEpisodeEntry'
import { ANIME_DETAILS_ENTRY } from '@selectors'

export type AnimeDetails = {
    name: string
    image: string
}

export type AnimeDetailsEntryProps = {
    anime: Optional<AnimeDetails>
    onClick?(anime: Optional<AnimeDetails>): void
} & Omit<AnimeEntryProps, 'render' | 'onClick'>

export const AnimeDetailsEntry = React.memo<AnimeDetailsEntryProps>(
    ({ anime, onClick, ...rest }) => {
        if (!anime) return null
        const handleClick = () => {
            onClick?.(anime)
        }
        return (
            <AnimeEntry
                render={() => {
                    return (
                        <Fragment>
                            <Img alt={anime.name} src={anime.image} />
                            <AnimeInfo data-testid={ANIME_DETAILS_ENTRY.ANIME_INFO}>
                                <AnimeTitle>{anime.name}</AnimeTitle>
                            </AnimeInfo>
                        </Fragment>
                    )
                }}
                {...rest}
                onClick={handleClick}
            />
        )
    },
)

AnimeDetailsEntry.displayName = 'AnimeDetailsEntry'

export default AnimeDetailsEntry
