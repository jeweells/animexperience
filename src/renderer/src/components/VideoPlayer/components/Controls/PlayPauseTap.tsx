import Stack from '@mui/material/Stack'
import Zoom from '@mui/material/Zoom'
import { styled } from '@mui/system'
import { useControls, usePlayPause } from './hooks'
import { useFullscreen } from '~/src/hooks'
import { useCallback, useLayoutEffect, useState } from 'react'
import { InverseFade } from '~/src/atoms/InverseFade'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import { useToggleFullscreen, useTogglePlayPause } from '~/src/hooks/shortcuts'

const Wrapper = styled(Stack)`
  position: absolute;
  justify-content: center;
  align-items: center;
  inset: 0;
  transition: opacity 250ms ease-in-out;
  outline: none;
  background: linear-gradient(0deg, #00000094, transparent);
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

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else void play()
    setKey(isPlaying ? 'playing' : 'paused')
  }, [isPlaying, play, pause])

  useTogglePlayPause(toggle)

  const { toggleFullscreen } = useFullscreen()
  useToggleFullscreen(toggleFullscreen)

  return (
    <Wrapper
      tabIndex={0}
      onClick={(e) => {
        if (e.currentTarget !== e.target) return
        toggle()
      }}
      onDoubleClick={() => {
        toggleFullscreen()
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
