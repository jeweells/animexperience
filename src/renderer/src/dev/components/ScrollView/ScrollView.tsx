import {
  ReactNode,
  useRef,
  useState,
  useLayoutEffect,
  useDeferredValue,
  forwardRef,
  useImperativeHandle
} from 'react'
import { Box, Stack } from '@mui/material'
import { range } from '~/src/utils'
import { GoToEndButton } from './GoToEndButton'

type Props = {
  height: number
  itemSize: number
  count: number
  render: (index: number) => ReactNode
  bgcolor: string
}

export type ScrollViewController = {
  scrollToIndex(index: number): void
}

export const ScrollView = forwardRef<ScrollViewController, Props>(
  ({ count, render, height, itemSize, bgcolor }: Props, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const oldCount = useDeferredValue(count)
    const [offset, setOffset] = useState(0)
    const startVisibleIndex = Math.ceil(offset / itemSize)
    const visibleIndexY = startVisibleIndex * itemSize
    const maxItemsInHeight = Math.floor((height - (visibleIndexY - offset)) / itemSize)
    const endVisibleIndex = startVisibleIndex + maxItemsInHeight
    const croppedItems = 3
    const startIndex = Math.max(0, startVisibleIndex - croppedItems)
    const endIndex = Math.min(count, startIndex + maxItemsInHeight + 2 * croppedItems) - 1
    const renderedItems = endIndex - startIndex + 1

    const startY = startIndex * itemSize
    const stopY = startY + renderedItems * itemSize
    const maxOffset = itemSize * (count - renderedItems)
    const totalHeight = itemSize * count

    const goToEnd = () => {
      if (!scrollRef.current) return
      scrollRef.current.scrollTo({ top: 0, behavior: 'instant' })
    }

    const goToIndex = (index: number) => {
      if (!scrollRef.current) return
      const validIndex = Math.max(0, Math.min(index, count))
      if (validIndex >= startVisibleIndex && validIndex <= endVisibleIndex) return
      const targetOffset = validIndex * itemSize - height / 2
      const newOffset = Math.min(maxOffset, Math.max(0, targetOffset))
      const _scroll = scrollRef.current
      console.log({ newOffset, targetOffset, validIndex, height, offset, startVisibleIndex })
      _scroll.scrollTo({ top: -newOffset, behavior: 'instant' })
    }

    useImperativeHandle(ref, () => {
      return {
        scrollToIndex: goToIndex
      }
    })

    useLayoutEffect(() => {
      if (offset === 0) return
      if (!scrollRef.current) return
      const newOffset = Math.min(0, -offset - (count - oldCount) * itemSize)
      scrollRef.current.scrollTo({ top: newOffset, behavior: 'instant' })
      setOffset(-newOffset)
    }, [oldCount !== count])

    return (
      <Box bgcolor={bgcolor} p={1} borderRadius={1} position={'relative'}>
        <Stack
          ref={scrollRef}
          style={{ height, scrollBehavior: 'smooth' }}
          direction={'column-reverse'}
          overflow={'auto'}
          onScroll={(e) => {
            setOffset(-e.currentTarget.scrollTop)
          }}
        >
          <Stack
            width={'100%'}
            direction={'column-reverse'}
            style={{
              maxHeight: totalHeight,
              overflow: 'hidden',
              minHeight: totalHeight,
              paddingBottom: startY,
              paddingTop: totalHeight - stopY
            }}
          >
            {range(renderedItems).map((_, idx) => {
              return (
                <div
                  key={idx + startIndex}
                  style={{ minHeight: itemSize, flexShrink: 0, flexGrow: 0 }}
                >
                  {render(idx + startIndex)}
                </div>
              )
            })}
          </Stack>
        </Stack>
        <GoToEndButton startIndex={startIndex} onClick={goToEnd} />
      </Box>
    )
  }
)

ScrollView.displayName = 'ScrollView'
