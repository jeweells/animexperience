import { useMemo, useState, useRef, useLayoutEffect, HTMLAttributes } from 'react'
import useResizeObserver from 'use-resize-observer'

export const useSliding = (gap: number, countElements: number, prevButtonWidth: number) => {
  const { ref: containerRef, width: containerWidth = 1 } = useResizeObserver<HTMLDivElement>()
  const { ref: scrollerRef, width: scrollerWidth = 1 } = useResizeObserver<HTMLDivElement>()
  const [viewed, setViewed] = useState(0)
  const availableScrollerWidth = scrollerWidth - prevButtonWidth

  const elementWidth = useMemo(() => {
    return (containerWidth - gap * (countElements - 1)) / countElements
  }, [countElements, gap, containerWidth])
  const totalInViewport = useMemo(() => {
    const elementWidthWithGap = elementWidth + gap

    let visibleElementsCount = Math.floor(availableScrollerWidth / elementWidthWithGap)
    if (elementWidthWithGap * visibleElementsCount + elementWidth <= availableScrollerWidth) {
      visibleElementsCount++
    }
    return visibleElementsCount
  }, [availableScrollerWidth, elementWidth])

  const [sliding, setSliding] = useState<boolean>(false)
  const handlePrev = () => {
    if (!sliding) {
      setViewed((viewed) => Math.min(countElements, Math.max(viewed - totalInViewport, 0)))
    }
  }

  const handleNext = () => {
    if (!sliding) {
      setViewed((viewed) => Math.min(countElements, Math.max(viewed + totalInViewport, 0)))
    }
  }

  const distance = useMemo(() => {
    const elementWithGap = elementWidth + gap
    return -prevButtonWidth + elementWithGap * viewed
  }, [viewed, elementWidth, gap, prevButtonWidth])
  const mounted = useRef(false)
  useLayoutEffect(() => {
    if (mounted.current) {
      setSliding(true)
    }
    mounted.current = true
  }, [distance, totalInViewport, viewed])

  const slideProps = useMemo<Partial<HTMLAttributes<HTMLElement>>>(
    () => ({
      style: {
        transform: `translate3d(${-distance}px, 0, 0)`,
        // These will be unset when the transition ends
        pointerEvents: sliding ? 'none' : 'all'
      }
    }),
    // Do not depend it on distance; very important! Otherwise, 1 frame will be inconsistent
    [sliding]
  )

  const hasPrev = distance > 0
  const hasNext = viewed + totalInViewport < countElements

  return {
    scrollerRef,
    handlePrev,
    handleNext,
    slideProps,
    containerRef,
    hasPrev,
    hasNext,
    sliding,
    viewed,
    totalInViewport,
    onSlidingComplete: () => {
      setSliding(false)
    }
  }
}

const defaultSizes = {
  gap: 16,
  containerWidth: '100vw',
  navigationWidth: 72
}

export const useSizes = () => {
  return defaultSizes
}
