import { Box, Stack } from '@mui/material'
import Collapse from '@mui/material/Collapse'
import { useShowControls } from '../hooks'
import {
  Duration,
  EpisodesList,
  FullscreenButton,
  NextEpisode,
  PlayButton,
  SeekBar,
  VideoOptions,
  Volume
} from './components'

export const PlayBar = () => {
  const { show, transitionMs } = useShowControls()

  return (
    <Box position={'absolute'} bottom={0} right={0} left={0}>
      <Collapse in={show} timeout={transitionMs}>
        <Stack px={3} bgcolor={'transparent'}>
          <SeekBar />
          <Stack
            direction={'row'}
            spacing={1}
            height={48}
            alignItems={'center'}
            overflow={'visible'}
            style={{
              filter: 'drop-shadow(0 0 1px rgba(0, 0, 0, 0.8))'
            }}
          >
            <PlayButton />
            <NextEpisode />
            <Volume />
            <Duration />
            <Box flex={1} />
            <VideoOptions />
            <EpisodesList />
            <FullscreenButton />
          </Stack>
        </Stack>
      </Collapse>
    </Box>
  )
}
