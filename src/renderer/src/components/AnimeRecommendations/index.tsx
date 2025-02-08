import { useCallback, useLayoutEffect, useMemo, FC, memo, Fragment } from 'react'
import { peek } from '@reducers/peek'
import { recommendations } from '@reducers/recommendations'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { AnimeCarouselContent } from '../../placeholders/AnimeCarouselContent'
import { Optional } from '@shared/types'
import { AnimeDetails, AnimeDetailsEntry } from '../AnimeDetailsEntry'
import { AnimesCarousel } from '../AnimesCarousel'
import { random } from '~/src/utils'
import { debug } from '@dev/events'

export type AnimeRecommendationsProps = {
  animeName: string
  title?: string
}

const getRandomTitleBuilder = () => {
  const messages: Array<(name: string) => string> = [
    (name) => 'Porque viste ' + name,
    (name) => 'Similares a ' + name
  ]
  return messages[Math.floor(random() * messages.length)]
}

export const AnimeRecommendations: FC<AnimeRecommendationsProps> = memo(({ animeName, title }) => {
  const buildTitle = useMemo(() => (title && (() => title)) || getRandomTitleBuilder(), [title])
  const dispatch = useAppDispatch()
  const _recommendations = useAppSelector((d) => d.recommendations[animeName])
  const parsedRecommendations = useMemo<AnimeDetails[]>(
    () =>
      _recommendations?.recommendations?.map((x) => {
        return {
          name: x.name,
          image: x.image
        }
      }) ?? [],
    [_recommendations]
  )
  useLayoutEffect(() => {
    dispatch(recommendations.fetchRecommendations(animeName))
  }, [])
  const status = _recommendations?.status
  const count = status !== 'succeeded' ? 1 : parsedRecommendations.length
  const handleAnimePeek = useCallback(
    (anime: Optional<AnimeDetails>) => {
      if (!anime) return
      dispatch(peek.peek(anime.name))
      debug('CLICKED', anime)
    },
    [dispatch]
  )
  return (
    <Fragment>
      <AnimesCarousel
        title={buildTitle(animeName)}
        count={count}
        loading={status !== 'succeeded'}
        render={({ index, visible, sliding }) => {
          if (status !== 'succeeded') {
            // This is a skeleton
            return <AnimeCarouselContent key={'placeholder' + index} count={5} />
          }
          const x = parsedRecommendations[index]
          if (!x) return null
          return (
            <AnimeDetailsEntry
              index={index}
              visible={visible}
              sliding={sliding}
              key={`${x.name}`}
              anime={x}
              onClick={handleAnimePeek}
            />
          )
        }}
      />
    </Fragment>
  )
})

AnimeRecommendations.displayName = 'AnimeRecommendations'

export default AnimeRecommendations
