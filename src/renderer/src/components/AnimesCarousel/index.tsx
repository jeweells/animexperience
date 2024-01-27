import { Fragment, FC, ReactNode, memo } from 'react'
import { Transition } from 'react-transition-group'
import { styled } from '@mui/system'
import { range } from '../../utils'
import { NavigationButton } from './components/NavigationButton'
import { useSizes, useSliding } from './hooks'

import { CarouselTitleWithLoading } from '~/src/components'

const Scroller = styled('div')`
  overflow-x: hidden;
  position: relative;
`

const Items = styled('div')<{ gap: number }>`
  display: flex;
  width: min-content;
  gap: ${(props) => props.gap}px;
`

export type AnimesCarouselProps = {
  render(info: { index: number; visible: boolean; sliding: boolean }): ReactNode
  loading?: boolean
  count: number
  title?: string
}

export const AnimesCarousel: FC<AnimesCarouselProps> = memo(({ count, loading, title, render }) => {
  const { gap, navigationWidth, containerWidth } = useSizes()
  const {
    containerRef,
    scrollerRef,
    handleNext,
    handlePrev,
    hasNext,
    hasPrev,
    slideProps,
    sliding,
    viewed,
    totalInViewport,
    onSlidingComplete
  } = useSliding(gap, count, navigationWidth)
  const duration = 400
  if (!loading && count === 0) return null
  return (
    <Fragment>
      <CarouselTitleWithLoading title={title} loading={loading} />
      <Scroller ref={scrollerRef} style={{ width: containerWidth }}>
        <NavigationButton onClick={handlePrev} disabled={loading || !hasPrev} direction={'left'} />
        <Transition in={sliding} unmountOnExit={false} onEntered={onSlidingComplete} timeout={400}>
          {() => (
            <Items
              ref={containerRef}
              gap={gap}
              style={{
                transition: `all ${duration}ms`,
                ...slideProps.style
              }}
            >
              {range(count).map((x) => {
                return render({
                  index: x,
                  visible: viewed <= x && x < viewed + totalInViewport,
                  // This way a few range of elements is going to re-render
                  sliding:
                    sliding && viewed - totalInViewport <= x && x < viewed + 2 * totalInViewport
                })
              })}
            </Items>
          )}
        </Transition>
        <NavigationButton onClick={handleNext} disabled={loading || !hasNext} direction={'right'} />
      </Scroller>
    </Fragment>
  )
})

AnimesCarousel.displayName = 'AnimesCarousel'

export default AnimesCarousel
