import { FC, useMemo } from 'react'
import { random } from '~/src/utils'
import { CarouselTitle } from '~/src/atoms/Text'
import { FadeInRL } from '~/src/atoms/FadeIn'
import Skeleton from '@mui/material/Skeleton'
import { useSizes } from '@components/AnimesCarousel/hooks'

type CarouselTitleWithLoadingProps = {
  title?: string
  loading?: boolean
}

const CarouselTitleWithLoading: FC<CarouselTitleWithLoadingProps> = ({ title, loading }) => {
  const titleSkeletonWidth = useMemo(() => {
    return 15 + random() * 20 + '%'
  }, [])
  const { navigationWidth } = useSizes()

  if (!title) return null
  return (
    <CarouselTitle
      style={{
        marginLeft: navigationWidth,
        marginBottom: 24
      }}
    >
      {loading ? (
        <FadeInRL duration={1500}>
          <Skeleton
            animation={'pulse'}
            variant={'text'}
            style={{
              width: titleSkeletonWidth
            }}
          />
        </FadeInRL>
      ) : (
        title
      )}
    </CarouselTitle>
  )
}

CarouselTitleWithLoading.displayName = 'CarouselTitleWithLoading'

export default CarouselTitleWithLoading
