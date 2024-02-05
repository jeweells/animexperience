import { Icon } from '../../Icon'
import { useVolume } from '../../hooks'
import { useDeferredValue, useEffect } from 'react'
import { Slider, Stack } from '@mui/material'

export const Volume = () => {
  const { volume, setVolume } = useVolume()
  const oldVolume = useDeferredValue(volume)

  const toggleMute = () => {
    setVolume(volume === 0 ? (oldVolume === volume ? 1 : oldVolume) : 0)
  }

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'm') toggleMute()
    }
    document.addEventListener('keyup', handle)
    return () => {
      document.removeEventListener('keyup', handle)
    }
  }, [volume, oldVolume])

  return (
    <>
      <Icon
        name={volume === 0 ? 'volumeMute' : volume < 0.6 ? 'volumeDown' : 'volumeUp'}
        title={'Silenciar (m)'}
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
