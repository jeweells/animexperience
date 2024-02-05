import { Box } from '@mui/material'
import { styled } from '@mui/system'
import { useRef, MouseEvent, useState, useLayoutEffect, memo } from 'react'
import { useBuffer, useSeek } from '@components/VideoPlayer/components/Controls/hooks'
import { Text } from './Text'
import { formatTime } from '~/src/utils'
import { useKeyUp } from '~/src/hooks/useKeyboardKeys'
import { FAST_SEEK_BACKWARDS_IN_SECONDS, FAST_SEEK_FORWARD_IN_SECONDS } from '~/src/constants'

const ms = 200

const TrackBar = styled(Box, { target: 'TrackBar' })`
  transform: scaleY(0.6);
  transition: transform ${ms}ms ease-in-out;
  height: 8px;
  width: 0;
  background-color: var(--bg);
  position: absolute;
  left: 0;
  bottom: 0;
`

const Dot = styled(Box, { target: 'Dot' })`
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: var(--bg);
  transform: translate(-50%, -50%);
  position: absolute;
  left: 0;
  top: 50%;
  transition:
    width ${ms}ms ease-in-out,
    border-radius ${ms}ms ease-in-out,
    height ${ms}ms ease-in-out;
`

const Backdrop = styled(TrackBar, { target: 'Backdrop' })`
  background-color: rgba(238, 238, 238);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  opacity: 0.3;
  width: 100%;
`

const IntentionBackdrop = styled(TrackBar, { target: 'IntentionBackdrop' })`
  background-color: rgb(248, 248, 248);
  opacity: 0.7;
  width: 0;
`

const BufferBackdrop = styled(TrackBar, { target: 'BufferBackdrop' })`
  background-color: rgb(248, 248, 248);
  opacity: 0.4;
  width: 0;
`

const TimeOverlay = styled(Text, { target: 'TimeOverlay' })`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-50%, -100%) translateY(-16px);
  display: none;
`

const Wrapper = styled(Box)`
  --bg: #ffffff;
  cursor: pointer;
  height: 8px;
  box-sizing: content-box;
  padding-top: 16px;

  :hover ${TrackBar}, :hover ${Backdrop}, :hover ${IntentionBackdrop}, :hover ${BufferBackdrop} {
    transform: scaleY(1);
  }

  :hover ${Dot} {
    border-radius: 50%;
    width: 20px;
    height: 20px;
  }

  ${Dot} {
    border-radius: 0;
  }

  :hover ${TimeOverlay} {
    display: block;
  }
`

const ThinWrapper = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
`

export const SeekBar = () => {
  const intentionRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLDivElement>(null)
  const { time, seek, fastSeek } = useSeek()
  const { onMouseMove, onMouseLeave, relOffset } = useMouseTrack({
    onChange: (relOffset) => {
      const trackElm = intentionRef.current
      const timeElm = timeRef.current
      if (!trackElm) return
      if (!timeElm) return
      const val = `${relOffset * 100}%`
      trackElm.style.width = val
      timeElm.style.left = val
      if (isFinite(time.duration)) timeElm.innerText = formatTime(time.duration * relOffset)
      else timeElm.innerText = ''
    }
  })

  const [timePer, setTimePer] = useState(0)

  useLayoutEffect(() => {
    setTimePer((time.currentTime / time.duration) * 100)
  }, [time])

  useKeyUp(
    () => {
      const nextCurrentTime = time.currentTime + FAST_SEEK_FORWARD_IN_SECONDS
      if (nextCurrentTime > time.duration) return
      fastSeek(nextCurrentTime)
    },
    {
      altKey: false,
      key: 'ArrowRight'
    }
  )

  useKeyUp(
    () => {
      fastSeek(Math.max(0, time.currentTime - FAST_SEEK_BACKWARDS_IN_SECONDS))
    },
    {
      altKey: false,
      key: 'ArrowLeft'
    }
  )

  return (
    <Wrapper
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => {
        const offset = relOffset.current
        seek(offset * time.duration)
        setTimePer(offset * 100)
      }}
    >
      <ThinWrapper>
        <Backdrop />
        <BufferBars />
        <IntentionBackdrop ref={intentionRef} />
        <TrackBar style={{ width: `${timePer}%` }} />
        <Dot style={{ left: `${timePer}%` }} />
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

const useMouseTrack = ({ onChange }: { onChange: (relOffset: number) => void }) => {
  const relOffset = useRef(0)
  return {
    relOffset,
    onMouseMove: (e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      relOffset.current = Math.max(0, Math.min(1, (e.screenX - rect.x) / rect.width))
      onChange(relOffset.current)
    },
    onMouseLeave: () => {
      relOffset.current = 0
      onChange(0)
    }
  }
}
