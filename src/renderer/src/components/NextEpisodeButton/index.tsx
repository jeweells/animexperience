import * as React from 'react'
import { watch } from '@reducers/watch'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import Fade from '@mui/material/Fade'
import { NEXT_EPISODE_BUTTON } from '@selectors'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import {
  usePlayPause,
  useSeek,
  useShowControls
} from '@components/VideoPlayer/components/Controls/hooks'
import { canGoToNextEpisode } from '@components/VideoPlayer/hooks'
import { SECONDS_NEXT_BUTTON_DISPLAY } from '@components/VideoPlayer/constants'

export const NextEpisodeButton: React.FC = React.memo(() => {
  const [{ seconds, clear }, _setTimeout] = useState<{ seconds: number; clear?: () => void }>({
    seconds: -1
  })
  const max = useAppSelector((d) => d.watch.info?.episodesRange?.max) ?? 0
  const episode = useAppSelector((d) => d.watch.watching?.episode) ?? 0
  const dispatch = useAppDispatch()
  const handleNext = () => {
    dispatch(watch.nextEpisode())
  }

  const { isPlaying } = usePlayPause()
  const { show, transitionMs } = useShowControls()
  const { time } = useSeek()
  const showNextButton = episode < max && time.duration > 0 && canGoToNextEpisode(time)

  useEffect(() => {
    if (!showNextButton) return
    const t = setTimeout(handleNext, SECONDS_NEXT_BUTTON_DISPLAY * 1000)
    _setTimeout({
      seconds: SECONDS_NEXT_BUTTON_DISPLAY,
      clear: () => {
        clearTimeout(t)
        _setTimeout({ seconds: -1 })
      }
    })
    return () => {
      clearTimeout(t)
    }
  }, [showNextButton])

  useEffect(() => {
    const handleMouseMove = () => {
      clear?.()
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [clear])

  useEffect(() => {
    if (isPlaying) return
    clear?.()
  }, [isPlaying, clear])

  return (
    <Fade in={showNextButton} timeout={400}>
      <div>
        <div
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            transform: show ? 'translateY(-56px)' : 'translateY(0)',
            transition: `all ${transitionMs}ms ease`
          }}
        >
          <Button
            style={{ filter: 'invert(100%)', overflow: 'hidden' }}
            data-testid={NEXT_EPISODE_BUTTON.BUTTON}
            onClick={() => {
              handleNext()
            }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>Siguiente episodio</span>
            <div
              style={{
                position: 'absolute',
                zIndex: 1,
                top: 0,
                left: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.9)',
                width: seconds !== -1 && showNextButton ? '100%' : '0',
                transition: seconds === -1 ? 'none' : `all ${seconds}s`
              }}
            />
          </Button>
        </div>
      </div>
    </Fade>
  )
})

NextEpisodeButton.displayName = 'NextEpisodeButton'

export default NextEpisodeButton
