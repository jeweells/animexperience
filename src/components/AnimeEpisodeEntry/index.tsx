import React, { Fragment } from 'react'
import styled from 'styled-components'
import { AnimeDescription, AnimeTitle } from '../../atoms/Text'
import { RecentAnimeData } from '../../hooks/useRecentAnimes'
import { useWatched } from '../../hooks/useWatched'
import { Optional } from '../../types'
import AnimeEntry, { AnimeEntryProps } from '../AnimeEntry'
import WatchedRange from '../WatchedRange'

export type AnimeEpisodeEntryProps = {
    anime: Optional<RecentAnimeData>
    onClick?(anime: Optional<RecentAnimeData>): void
} & Omit<AnimeEntryProps, 'render' | 'onClick'>

export const AnimeInfo = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background-image: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.7),
        rgba(0, 0, 0, 0.5) 20%,
        rgba(0, 0, 0, 0) 40%
    );
    padding: 16px;
`
export const Img = styled.img`
    object-fit: cover;
    width: 100%;
    height: 100%;
`

export const AnimeEpisodeEntry = React.memo<AnimeEpisodeEntryProps>(
    ({ anime, onClick, ...rest }) => {
        const watched = useWatched(anime)
        if (!anime) return null
        const handleClick = () => {
            onClick?.(anime)
        }
        return (
            <AnimeEntry
                render={() => {
                    return (
                        <Fragment>
                            <Img alt={anime.name} src={anime.img} />
                            <AnimeInfo>
                                <AnimeTitle>{anime.name}</AnimeTitle>
                                <AnimeDescription>{`Episodio ${anime.episode}`}</AnimeDescription>
                                {watched && (
                                    <Fragment>
                                        <div style={{ minHeight: 8 }} />
                                        <WatchedRange info={watched} />
                                    </Fragment>
                                )}
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

AnimeEpisodeEntry.displayName = 'AnimeEpisodeEntry'
