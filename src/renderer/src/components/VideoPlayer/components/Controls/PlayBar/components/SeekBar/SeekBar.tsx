import { memo, useLayoutEffect, useRef, useState } from 'react'
import { useBuffer, useSeek } from '../../../hooks'
import { formatTime } from '~/src/utils'
import {
  Backdrop,
  BufferBackdrop,
  Dot,
  IntentionBackdrop,
  ThinWrapper,
  TimeOverlay,
  TrackBar,
  Wrapper
} from './components'
import { useMouseTrack, usePrimaryButton } from './hooks'
import { useSeekBackward, useSeekForward } from '~/src/hooks/shortcuts'

export const SeekBar = () => {
  const intentionRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const trackBarRef = useRef<HTMLDivElement>(null)
  const { time, seek, seekForward, seekBackward } = useSeek()

  const { onMouseDown, pressed: primaryButtonPressed } = usePrimaryButton({
    onMouseUp: () => {
      pendingSeek.current?.()
      pendingSeek.current = null
    }
  })

  const seekOnTarget = () => {
    const offset = relOffset.current
    seek(offset * time.duration)
    setTimePer(offset * 100)
  }

  const {
    ref: wrapperRef,
    onMouseMove,
    onMouseLeave,
    relOffset
  } = useMouseTrack({
    useOnTarget: !primaryButtonPressed,
    onChange: (relOffset) => {
      const trackElm = intentionRef.current
      const timeElm = timeRef.current
      const dotElm = dotRef.current
      const trackbarElm = trackBarRef.current
      if (!trackElm) return
      if (!timeElm) return
      if (!dotElm) return
      if (!trackbarElm) return
      const val = `${relOffset * 100}%`
      if (primaryButtonPressed) {
        // This will simulate the "drag" state
        dotElm.style.left = val
        trackbarElm.style.width = val
        pendingSeek.current = seekOnTarget
      }
      trackElm.style.width = val
      timeElm.style.left = val
      if (isFinite(time.duration)) timeElm.innerText = formatTime(time.duration * relOffset)
      else timeElm.innerText = ''
    }
  })

  const [timePer, setTimePer] = useState(0)

  useLayoutEffect(() => {
    setTimePer(time.duration === 0 ? 0 : (time.currentTime / time.duration) * 100)
  }, [time])

  useSeekForward(seekForward)
  useSeekBackward(seekBackward)

  const pendingSeek = useRef<null | (() => void)>(null)

  return (
    <Wrapper
      forceHover={primaryButtonPressed}
      ref={wrapperRef}
      onMouseMove={onMouseMove}
      onClick={seekOnTarget}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
    >
      <ThinWrapper>
        <Backdrop />
        <BufferBars />
        <IntentionBackdrop ref={intentionRef} />
        <TrackBar ref={trackBarRef} style={{ width: `${timePer}%` }} />
        <Dot ref={dotRef} style={{ left: `${timePer}%` }} />
        <TimeOverlay ref={timeRef} />
      </ThinWrapper>
    </Wrapper>
  )
}

const BufferBars = memo(() => {
  const { buffered } = useBuffer()
  return (
    <>
      {buffered.map(({ start, end }, index) => {
        return (
          <BufferBackdrop
            key={index}
            style={{ left: `${start * 100}%`, width: `${(end - start) * 100}%` }}
          />
        )
      })}
    </>
  )
})

BufferBars.displayName = 'BufferBars'
