import React, { Fragment } from 'react'
import styled from 'styled-components'
import { AnimeDescription, AnimeTitle } from '../../atoms/Text'
import { RecentAnimeData } from '../../hooks/useRecentAnimes'
import { useWatched } from '../../hooks/useWatched'
import { Optional } from '../../types'
import AnimeEntry, { AnimeEntryProps } from '../AnimeEntry'
import WatchedRange from '../WatchedRange'
import Tooltip from '@mui/material/Tooltip'
import ManageFollowButton from '../ManageFollowButton'

export type ManagementVisibility = Partial<{
    follow: boolean
}>

export type AnimeEpisodeEntryProps = {
    anime: Optional<RecentAnimeData>
    // Whether it can follow or unfollow this anime
    management?: ManagementVisibility
    onClick?(anime: Optional<RecentAnimeData>): void
} & Omit<AnimeEntryProps, 'render' | 'onClick'>

const ManageButtons = styled('div')`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 8px;
    background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.7),
        rgba(0, 0, 0, 0.5) 20%,
        rgba(0, 0, 0, 0) 90%
    );
    -webkit-backface-visibility: initial;
`

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
    & ${ManageButtons} {
        opacity: 0;
        transition: opacity 300ms ease-in-out;
    }
    &:hover ${ManageButtons} {
        opacity: 1;
    }
`

export const Img = styled.img`
    object-fit: cover;
    width: 100%;
    height: 100%;
`

export const AnimeEpisodeEntry = React.memo<AnimeEpisodeEntryProps>(
    ({ anime, management = {}, onClick, ...rest }) => {
        const isManagementVisible = React.useMemo(
            () => Object.values(management).filter(Boolean).length > 0,
            [management],
        )
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
                                {isManagementVisible && (
                                    <ManageButtons>
                                        {management.follow && (
                                            <ManageFollowButton anime={anime} />
                                        )}
                                    </ManageButtons>
                                )}
                                <Tooltip
                                    enterDelay={1000}
                                    enterNextDelay={1000}
                                    enterTouchDelay={1000}
                                    followCursor
                                    title={anime.name || ''}
                                >
                                    <AnimeTitle>{anime.name}</AnimeTitle>
                                </Tooltip>
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
