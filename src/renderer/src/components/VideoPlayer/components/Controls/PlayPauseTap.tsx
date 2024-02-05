import { Stack, Zoom } from '@mui/material'
import { styled } from '@mui/system'
import { useControls, usePlayPause } from './hooks'
import { useEffect, useLayoutEffect, useState } from 'react'
import { InverseFade } from '~/src/atoms/InverseFade'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

const Wrapper = styled(Stack)`
  position: absolute;
  justify-content: center;
  align-items: center;
  inset: 0;
  transition: opacity 250ms ease-in-out;
  outline: none;
`

const IconWrapper = styled('div')`
  padding: 16px;
  border-radius: 50%;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  background-color: ${({ theme }) => theme.palette.primary.main};
  font-size: clamp(100px, 5vw, 200px);
`

export const PlayPauseTap = () => {
  const { video } = useControls()
  const { play, pause, isPlaying } = usePlayPause()
  const [key, setKey] = useState<'playing' | 'paused' | null>(null)

  useLayoutEffect(() => {
    if (video) return
    setKey(null)
  }, [video])

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.code === 'Space') toggle()
      if (e.key === 'f') {
        if (document.fullscreenElement) {
          void document.exitFullscreen()
        } else {
          void document.body.requestFullscreen()
        }
      }
    }
    document.addEventListener('keyup', handle)
    return () => {
      document.removeEventListener('keyup', handle)
    }
  }, [isPlaying])

  const toggle = () => {
    if (isPlaying) pause()
    else void play()
    setKey(isPlaying ? 'playing' : 'paused')
  }

  return (
    <Wrapper
      tabIndex={0}
      onClick={(e) => {
        if (e.currentTarget !== e.target) return
        toggle()
      }}
    >
      {key && (
        <div key={key} style={{ pointerEvents: 'none' }}>
          <InverseFade in={true} timeout={300} appear={true}>
            <Zoom in={true} appear={true} timeout={300}>
              <IconWrapper>
                {key === 'paused' ? (
                  <PlayArrowIcon style={{ display: 'block' }} />
                ) : (
                  <PauseIcon style={{ display: 'block' }} />
                )}
              </IconWrapper>
            </Zoom>
          </InverseFade>
        </div>
      )}
    </Wrapper>
  )
}
