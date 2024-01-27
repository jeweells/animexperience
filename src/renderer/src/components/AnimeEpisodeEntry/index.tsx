import { Fragment, useMemo, memo } from 'react'
import { styled } from '@mui/system'
import { AnimeDescription, AnimeTitle } from '../../atoms/Text'
import { RecentAnimeData } from '../../hooks/useRecentAnimes'
import { useWatched } from '../../hooks/useWatched'
import { Optional } from '@shared/types'
import AnimeEntry, { AnimeEntryProps } from '../AnimeEntry'
import WatchedRange from '../WatchedRange'
import Tooltip from '@mui/material/Tooltip'
import ManageFollowButton from '../ManageFollowButton'
import { ANIME_EPISODE_ENTRY } from '@selectors'
import { useEnsureAnimeImage } from '~/src/hooks/useEnsureAnimeImage'

export type ManagementVisibility = Partial<{
  follow: boolean
}>

export type AnimeEpisodeEntryProps = {
  anime: Optional<RecentAnimeData>
  // Whether it can follow or unfollow this anime
  management?: ManagementVisibility
  onClick?(anime: Optional<RecentAnimeData>): void
} & Omit<AnimeEntryProps, 'render' | 'onClick'>

export const ManageButtons = styled('div', { target: 'ManageButtons' })`
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

export const AnimeInfo = styled('div', { target: 'AnimeInfo' })`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: ${(props) => props.theme.palette.primary.main};
  padding: 16px;
  flex-shrink: 0;
`

export const Img = styled('img')`
  object-fit: cover;
  width: 100%;
  height: 100%;
`

export const ImgWrapper = styled('div')`
  flex: 1;
  overflow: hidden;
`

export const AnimeEpisodeEntry = memo<AnimeEpisodeEntryProps>(
  ({ anime, management = {}, onClick, ...rest }) => {
    const isManagementVisible = useMemo(
      () => Object.values(management).filter(Boolean).length > 0,
      [management]
    )
    const { src: imgSrc, onError } = useEnsureAnimeImage(anime?.img)
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
              <ImgWrapper>
                <Img alt={anime.name} src={imgSrc} onError={onError} />
              </ImgWrapper>
              <AnimeInfo data-testid={ANIME_EPISODE_ENTRY.ANIME_INFO}>
                {isManagementVisible && (
                  <ManageButtons>
                    {management.follow && <ManageFollowButton anime={anime} />}
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
  }
)

AnimeEpisodeEntry.displayName = 'AnimeEpisodeEntry'

export default AnimeEpisodeEntry
