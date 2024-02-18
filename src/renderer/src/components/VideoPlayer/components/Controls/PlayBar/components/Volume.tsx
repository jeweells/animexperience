import { Icon } from '../../Icon'
import { useVolume } from '../../hooks'
import { useDeferredValue } from 'react'
import { Slider, Stack } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { useMute, useVolumeDown, useVolumeUp } from '~/src/hooks/shortcuts'

export const Volume = () => {
  const { volume, setVolume } = useVolume()
  const oldVolume = useDeferredValue(volume)

  const toggleMute = () => {
    setVolume(volume === 0 ? (oldVolume === volume ? 1 : oldVolume) : 0)
  }

  useMute(toggleMute)
  useVolumeUp(() => setVolume(Math.min(1, volume + 0.1)))
  useVolumeDown(() => setVolume(Math.max(0, volume - 0.1)))

  return (
    <>
      <Icon
        name={volume === 0 ? 'volumeMute' : volume < 0.6 ? 'volumeDown' : 'volumeUp'}
        title={'Silenciar ( m )'}
        style={{
          fontSize: '1.7rem'
        }}
        onClick={toggleMute}
      />
      <Stack width={70} justifyContent={'center'} pr={2}>
        <Tooltip disableInteractive={true} title={'Volumen'}>
          <Slider
            size={'small'}
            style={{ color: '#fff' }}
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={(_, value) => {
              setVolume(Array.isArray(value) ? value[0] : value)
            }}
          />
        </Tooltip>
      </Stack>
    </>
  )
}
