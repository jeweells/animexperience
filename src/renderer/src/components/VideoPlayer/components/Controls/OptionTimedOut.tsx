import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useControls, usePlayPause } from './hooks'
import Button from '@mui/material/Button'
import { useVideoOptions } from '@components/VideoPlayerWOptions/hooks'
import { Close } from './Close'
import Fade from '@mui/material/Fade'
import { styled } from '@mui/system'
import { useEffect, useState } from 'react'

export const OptionTimedOut = () => {
  const { videoIsTakingLong } = useControls()
  const { sortedOptions, currentOption, setCurrentOption } = useVideoOptions()
  const { isPlaying } = usePlayPause()

  const [testedOptions, setTestedOptions] = useState<string[]>([])

  useEffect(() => {
    if (!isPlaying) return
    setTestedOptions([])
  }, [isPlaying])

  const remainingOptions = sortedOptions.filter(
    (option) => !testedOptions.includes(option.id) && option.id !== currentOption?.id
  )

  const getOptionRemainingText = () => {
    if (remainingOptions.length === 0) return ''
    if (remainingOptions.length === 1) return '(queda 1 opción)'
    return `(quedan ${remainingOptions.length} opciones)`
  }

  const optionTakingTooLong = (
    <>
      <Typography>
        La opción actual está tardando demasiado... {getOptionRemainingText()}
      </Typography>
      <Button
        disabled={!videoIsTakingLong || remainingOptions.length === 0}
        onClick={() => {
          const newOption = remainingOptions[0]
          if (!newOption) return
          const currentOptionId = currentOption?.id
          if (currentOptionId) {
            setTestedOptions((p) => [...p, currentOptionId])
          }
          setCurrentOption(newOption)
        }}
      >
        Intentar otra opción
      </Button>
    </>
  )

  const runOutOfOptions = (
    <>
      <Typography>No hay opciones disponibles para este episodio...</Typography>
      {sortedOptions.length > 0 && (
        <Button
          onClick={() => {
            setTestedOptions([])
            setCurrentOption(sortedOptions[0])
          }}
        >
          Reintentar
        </Button>
      )}
    </>
  )

  return (
    <Fade in={videoIsTakingLong} timeout={{ exit: 0 }}>
      <Absolute>
        <Absolute spacing={2} sx={{ background: 'rgba(0,0,0,0.6)' }}>
          {remainingOptions.length === 0 ? runOutOfOptions : optionTakingTooLong}
        </Absolute>
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <Stack direction={'row'} spacing={2}>
            <Close />
          </Stack>
        </div>
      </Absolute>
    </Fade>
  )
}

const Absolute = styled(Stack)`
  justify-content: center;
  align-items: center;
  position: absolute;
  inset: 0;
`
