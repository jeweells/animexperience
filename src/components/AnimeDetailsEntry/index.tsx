import React, { Fragment } from 'react'
import { AnimeTitle } from '../../atoms/Text'
import { Optional } from '../../types'
import AnimeEntry, { AnimeEntryProps } from '../AnimeEntry'
import { AnimeInfo, Img } from '../AnimeEpisodeEntry'

export type AnimeDetails = {
    name: string
    image: string
}

export type AnimeEpisodeEntryProps = {
    anime: Optional<AnimeDetails>
    onClick?(anime: Optional<AnimeDetails>): void
} & Omit<AnimeEntryProps, 'render' | 'onClick'>

export const AnimeDetailsEntry = React.memo<AnimeEpisodeEntryProps>(
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
                            <AnimeInfo>
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
