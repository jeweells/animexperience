import * as React from 'react'
import { watch } from '@reducers'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import font from '../../fonts/Quicksand/Quicksand-Light.ttf'
import Fade from '@mui/material/Fade'
import { NEXT_EPISODE_BUTTON } from '@selectors'

// We need to form an absolute url since this element will be injected inside an iframe
// and inside iframes, relatives url won't match ours
export const quicksandCss = () => `
    @font-face {
        font-family: 'Quicksand';
        src: url('${new URL(font, window.currentURL).href}') format('truetype');
        font-weight: 300;
        font-style: normal;
    }
`

export const buttonCss = `

    button.raex-button-injected {
        font-family: 'Quicksand';
        color: #292d33;
        background: #e9ebf0;
        display: inline-block;
        margin-bottom: 0;
        font-weight: normal;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        outline: 0 !important;
        white-space: nowrap;
        border: none;
        user-select: none;
        padding: 8px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        border-radius: 6px;
        position: relative;
        transition: color 0.2s linear, background-color 0.3s linear;
        margin: 0;
        overflow: hidden;
        text-decoration: none;
    }
    button.raex-button-injected:hover, button.raex-button-injected:focus {
        color: #3c3f43;
        background-color: #e9ebf0;

    }
`

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
  return (
    <Fade in={showNextButton} timeout={400}>
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 2147483647
        }}
      >
        <style>
          {quicksandCss()}
          {buttonCss}
        </style>
        <button
          data-testid={NEXT_EPISODE_BUTTON.BUTTON}
          className={'raex-button-injected'}
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
              backgroundColor: 'rgba(0,0,0,0.1)',
              width: timeout !== -1 && showNextButton ? '100%' : '0',
              transition: timeout === -1 ? 'none' : `all ${timeout}s`
            }}
          />
        </button>
      </div>
    </Fade>
  )
})

NextEpisodeButton.displayName = 'NextEpisodeButton'

export default NextEpisodeButton
