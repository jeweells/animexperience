import { Fragment, useMemo, memo } from 'react'
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
import { AnimeInfo, Img, ImgWrapper, ManageButtons } from '../AnimeEntry/components'

export type ManagementVisibility = Partial<{
  follow: boolean
}>

export type AnimeEpisodeEntryProps = {
  anime: Optional<RecentAnimeData>
  // Whether it can follow or unfollow this anime
  management?: ManagementVisibility
  onClick?(anime: Optional<RecentAnimeData>): void
} & Omit<AnimeEntryProps, 'render' | 'onClick'>

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
