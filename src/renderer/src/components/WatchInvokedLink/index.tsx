import * as React from 'react'
import { styled } from '@mui/system'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import Button from '@mui/material/Button'
import { watch } from '@reducers/watch'

import { FRowG16, FRowG8 } from '../../atoms/Layout'
import DialogActions from '@mui/material/DialogActions'
import { TitleRow, UnhookedAnimePeek } from '../AnimePeek'
import { CarouselTitle } from '../../atoms/Text'
import { FExpand } from '../../atoms/Misc'
import CloseButton from '../../atoms/CloseButton'
import ShareIcon from '@mui/icons-material/Share'
import AnimePeekPlaceholder from '../../placeholders/AnimePeekPlaceholder'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'

const SomeButton = styled(Button)``

const Actions = styled(DialogActions)`
  padding: 16px;
`

const PlayIcon = styled(PlayArrowRoundedIcon)`
  font-size: 1.4rem;
  overflow: hidden;
`

const TitleBar = styled(TitleRow)`
  padding: 8px 40px;
  background: #3a6f5e;
  position: absolute;
  z-index: 1;
  width: 100%;
`

const Title = styled(CarouselTitle)`
  margin-bottom: 0;
  text-shadow: none;
  font-weight: 600;
  font-size: 1rem;
`
const CloseButtonAlt = styled(CloseButton)`
  background-color: #4f9680;
  &:hover {
    background-color: #58a78e;
  }
`

export const WatchInvokedLink = React.memo(({ onClose }: { onClose: () => void }) => {
  const status = useAppSelector((d) => d.invokedLink.status.watch)
  const { data: info, request } = useAppSelector((d) => d.invokedLink.preAllow.watch) ?? {}
  const dispatch = useAppDispatch()

  const ready = status === 'succeeded'

  const episode = request?.episode ?? '<?>'
  return (
    <>
      <TitleBar>
        <FRowG8>
          <ShareIcon />
          <Title>Enlace compartido</Title>
        </FRowG8>
        <FExpand />
        <CloseButtonAlt onClick={onClose} />
      </TitleBar>
      {ready ? (
        <UnhookedAnimePeek info={info} contentProps={{ style: { paddingTop: 52 + 32 } }} />
      ) : (
        <AnimePeekPlaceholder contentProps={{ style: { paddingTop: 52 + 32 } }} />
      )}
      <Actions>
        <FRowG16>
          <SomeButton
            disabled={!ready}
            onClick={() => {
              if (!(info && request)) return
              dispatch(
                watch.watchEpisode({
                  episode: request.episode,
                  link: info.episodeLink.replace(info.episodeReplace, String(request.episode)),
                  img: info.thumbnail,
                  name: info.title
                })
              )
            }}
          >
            <FRowG16 style={{ alignItems: 'center' }}>
              Ir al episodio {episode}
              <PlayIcon />
            </FRowG16>
          </SomeButton>
        </FRowG16>
      </Actions>
    </>
  )
})

WatchInvokedLink.displayName = 'WatchInvokedLink'

export default WatchInvokedLink
