import { Fragment, memo } from 'react'
import { AnimeTitle } from '../../atoms/Text'
import { Optional } from '@shared/types'
import AnimeEntry, { AnimeEntryProps } from '../AnimeEntry'
import { AnimeInfo, Img, ImgWrapper } from '../AnimeEntry/components'
import { ANIME_DETAILS_ENTRY } from '@selectors'
import { useEnsureAnimeImage } from '~/src/hooks/useEnsureAnimeImage'
import Tooltip from '@mui/material/Tooltip'

export type AnimeDetails = {
  name: string
  image: string
}

export interface AnimeDetailsEntryProps extends Omit<AnimeEntryProps, 'render' | 'onClick'> {
  anime: Optional<AnimeDetails>
  onClick?(anime: Optional<AnimeDetails>): void
}

export const AnimeDetailsEntry = memo<AnimeDetailsEntryProps>(({ anime, onClick, ...rest }) => {
  const { src: imgSrc, onError } = useEnsureAnimeImage(anime?.image)

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
            <AnimeInfo data-testid={ANIME_DETAILS_ENTRY.ANIME_INFO}>
              <Tooltip
                enterDelay={1000}
                enterNextDelay={1000}
                enterTouchDelay={1000}
                followCursor
                title={anime.name || ''}
              >
                <AnimeTitle>{anime.name}</AnimeTitle>
              </Tooltip>
            </AnimeInfo>
          </Fragment>
        )
      }}
      {...rest}
      onClick={handleClick}
    />
  )
})

AnimeDetailsEntry.displayName = 'AnimeDetailsEntry'

export default AnimeDetailsEntry
