import * as React from 'react'
import { watch } from '@reducers'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import Fade from '@mui/material/Fade'
import { NEXT_EPISODE_BUTTON } from '@selectors'
import { useEffect } from 'react'
import Button from '@mui/material/Button'
import { usePlayPause, useShowControls } from '@components/VideoPlayer/components/Controls/hooks'

export const NextEpisodeButton: React.FC = React.memo(() => {
  const timeout = useAppSelector((d) => d.watch.nextEpisodeTimeout)
  const max = useAppSelector((d) => d.watch.info?.episodesRange?.max) ?? 0
  const episode = useAppSelector((d) => d.watch.watching?.episode) ?? 0
  const dispatch = useAppDispatch()
  const showNextButton = useAppSelector((d) => d.watch.showNextEpisodeButton) && episode < max
  const handleNext = () => {
    dispatch(watch.setNextEpisodeButton(false))
    dispatch(watch.nextEpisode())
  }

  const { isPlaying } = usePlayPause()
  const { show, transitionMs } = useShowControls()

  useEffect(() => {
    if (isPlaying) return
    if (showNextButton) dispatch(watch.setNextEpisodeTimeout(-1))
  }, [isPlaying])

  useEffect(() => {
    const handleMouseMove = () => {
      if (showNextButton) dispatch(watch.setNextEpisodeTimeout(-1))
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [showNextButton])

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
                width: timeout !== -1 && showNextButton ? '100%' : '0',
                transition: timeout === -1 ? 'none' : `all ${timeout}s`
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
