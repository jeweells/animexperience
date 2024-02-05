import { Icon } from '../../Icon'
import { useVolume } from '../../hooks'
import { useDeferredValue } from 'react'
import { Slider, Stack } from '@mui/material'
import { useKeyUp } from '~/src/hooks/useKeyboardKeys'

export const Volume = () => {
  const { volume, setVolume } = useVolume()
  const oldVolume = useDeferredValue(volume)

  const toggleMute = () => {
    setVolume(volume === 0 ? (oldVolume === volume ? 1 : oldVolume) : 0)
  }

  useKeyUp(toggleMute, { key: 'm' })
  useKeyUp(() => setVolume(Math.min(1, volume + 0.1)), { key: 'ArrowUp' })
  useKeyUp(() => setVolume(Math.max(0, volume - 0.1)), { key: 'ArrowDown' })

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
      </Stack>
    </>
  )
}
