import { memo, useLayoutEffect, useMemo, useCallback, FC, Fragment } from 'react'
import { followedAnimes, watch } from '@reducers'

import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { VSpace } from '../../atoms/Spacing'
import { RecentAnimeData } from '../../hooks/useRecentAnimes'
import AnimeCarouselContent from '../../placeholders/AnimeCarouselContent'
import { AnimesCarousel } from '../AnimesCarousel'
import FollowedAnimeEpisodeEntry from '../FollowedAnimeEpisodeEntry'

export const FollowedAnimesUpdates: FC = memo(() => {
  const followed = useAppSelector((d) => d.followedAnimes.followed) ?? []
  const status = useAppSelector((d) => d.followedAnimes.status.followed)
  const dispatch = useAppDispatch()
  useLayoutEffect(() => {
    dispatch(followedAnimes.fetchStore())
  }, [])
  const filteredFollowed = useMemo(() => {
    return followed.filter((x) => {
      return !(x.status === 'succeeded' && x.nextEpisodeToWatch === x.lastEpisodeWatched)
    })
  }, [followed])

  const handleCardClick = useCallback((anime: RecentAnimeData) => {
    if (anime.name && anime.episode) {
      dispatch(watch.watchEpisode(anime))
    } else {
      console.error('No enough data to perform animeSearch')
    }
  }, [])
  if (status === 'succeeded' && filteredFollowed.length === 0) {
    return null
  }
  const carouselLoading = status !== 'succeeded' && filteredFollowed.length === 0

  return (
    <Fragment>
      <VSpace size={32} />
      <AnimesCarousel
        title={'Animes que sigues'}
        count={carouselLoading ? 1 : filteredFollowed.length}
        loading={carouselLoading}
        render={({ index, visible, sliding }) => {
          if (carouselLoading) {
            return <AnimeCarouselContent key={'placeholder-' + index} count={5} />
          }
          return (
            <FollowedAnimeEpisodeEntry
              index={index}
              visible={visible}
              sliding={sliding}
              key={`${filteredFollowed[index].name}`}
              onClick={handleCardClick}
              followed={filteredFollowed[index]}
            />
          )
        }}
      />
    </Fragment>
  )
})

FollowedAnimesUpdates.displayName = 'FollowedAnimesUpdates'

export default FollowedAnimesUpdates
