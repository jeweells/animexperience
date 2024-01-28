import { useSliding } from './hooks'
import { renderHook, act } from '@testing-library/react'
import useResizeObserver from 'use-resize-observer'

describe('AnimesCarousel > useSliding', () => {
  const useResizeObserverMock = useResizeObserver as jest.Mock

  const snapshot = ({ name, hook }: { name?: string; hook: ReturnType<typeof useSliding> }) => {
    const { scrollerRef, containerRef, onSlidingComplete, handleNext, handlePrev, ...props } = hook
    if (name) expect(props).toMatchSnapshot(name)
    else expect(props).toMatchSnapshot()
  }

  const getHook = (gap = 20, countElements = 4, prevButtonWidth = 50) => {
    return () => useSliding(gap, countElements, prevButtonWidth)
  }

  beforeEach(() => {
    useResizeObserverMock.mockReturnValue({ ref: jest.fn(), width: 100, height: 100 })
  })

  it('renders default', () => {
    const { result } = renderHook(getHook())
    snapshot({ hook: result.current })
  })

  it('renders when clicking next/prev', () => {
    const { result } = renderHook(getHook())

    act(() => {
      result.current.handleNext()
    })

    snapshot({ name: 'Clicked next', hook: result.current })

    act(() => {
      result.current.onSlidingComplete()
    })

    snapshot({ name: 'Finished sliding next', hook: result.current })

    act(() => {
      result.current.handlePrev()
    })

    snapshot({ name: 'Clicked prev', hook: result.current })

    act(() => {
      result.current.onSlidingComplete()
    })

    snapshot({ name: 'Finished sliding prev', hook: result.current })
  })
})
