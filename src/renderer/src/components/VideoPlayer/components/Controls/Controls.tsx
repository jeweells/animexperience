import { PlayBar } from './PlayBar'
import { Context } from './context'
import { ControlsContext } from './types'
import { useMemo } from 'react'
import { OpacityLayer } from './OpacityLayer'
import { Loading } from './Loading'
import { PlayPauseTap } from './PlayPauseTap'
import NextEpisodeButton from '@components/NextEpisodeButton'
import { Stack } from '@mui/material'
import { Close } from './Close'

export const Controls = ({ video }: Pick<ControlsContext, 'video'>) => {
  return (
    <Context.Provider
      value={useMemo(() => {
        return {
          video
        }
      }, [video])}
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
      <NextEpisodeButton />
    </Context.Provider>
  )
}
