import { useLayoutEffect, FC, memo, useCallback, Fragment } from 'react'
import { watch, watchHistory } from '@reducers'

import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { VSpace } from '../../atoms/Spacing'
import { RecentAnimeData } from '../../hooks/useRecentAnimes'
import { AnimeCarouselContent } from '../../placeholders/AnimeCarouselContent'
import { AnimeEpisodeEntry } from '../AnimeEpisodeEntry'
import { AnimesCarousel } from '../AnimesCarousel'
import { error } from '@dev/events'

export const ContinueWatching: FC = memo(() => {
  const history = useAppSelector((d) => d.watchHistory.sorted) ?? []
  const status = useAppSelector((d) => d.watchHistory.status.sorted)
  const dispatch = useAppDispatch()
  useLayoutEffect(() => {
    dispatch(watchHistory.fetchStore())
  }, [])

  const filteredAnimes = history.map((x) => x.info)

  const count = status !== 'succeeded' ? 1 : filteredAnimes?.length ?? 1
  const handleCardClick = useCallback((anime: RecentAnimeData) => {
    if (anime.name && typeof anime.episode === 'number') {
      dispatch(watch.watchEpisode(anime))
    } else {
      error('No enough data to perform animeSearch')
    }
  }, [])
  if (status === 'succeeded' && filteredAnimes.length === 0) {
    return null
  }

  return (
    <Fragment>
      <VSpace size={32} />
      <AnimesCarousel
        title={'Sigue mirando'}
        count={count}
        loading={status !== 'succeeded'}
        render={({ index, visible, sliding }) => {
          if (status !== 'succeeded') {
            return <AnimeCarouselContent key={'placeholder' + index} count={5} />
          }
          if (!filteredAnimes) return null
          const x = filteredAnimes[index]
          return (
            <AnimeEpisodeEntry
              index={index}
              visible={visible}
              sliding={sliding}
              key={`${x.name} ${x.episode}`}
              anime={x}
              onClick={handleCardClick}
            />
          )
        }}
      />
    </Fragment>
  )
})

ContinueWatching.displayName = 'ContinueWatching'

export default ContinueWatching
