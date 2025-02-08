import Stack from '@mui/material/Stack'
import { PlayBar } from './PlayBar'
import { Context } from './context'
import { ControlsContext } from './types'
import { useMemo } from 'react'
import { OpacityLayer } from './OpacityLayer'
import { Loading } from './Loading'
import { PlayPauseTap } from './PlayPauseTap'
import NextEpisodeButton from '@components/NextEpisodeButton'
import { Close } from './Close'
import { OptionTimedOut } from './OptionTimedOut'

export const Controls = ({
  video,
  videoIsTakingLong
}: Pick<ControlsContext, 'video' | 'videoIsTakingLong'>) => {
  return (
    <Context.Provider
      value={useMemo(() => {
        return {
          video,
          videoIsTakingLong
        }
      }, [video, videoIsTakingLong])}
    >
      <OpacityLayer>
        <PlayPauseTap />
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <Stack direction={'row'} spacing={2}>
            <Close />
          </Stack>
        </div>
        <PlayBar />
      </OpacityLayer>
      <Loading />
      <OptionTimedOut />
      <NextEpisodeButton />
    </Context.Provider>
  )
}
