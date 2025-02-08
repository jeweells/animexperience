import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useControls } from './hooks'
import Button from '@mui/material/Button'
import { useVideoOptions } from '@components/VideoPlayerWOptions/hooks'
import { Close } from './Close'
import Fade from '@mui/material/Fade'
import { styled } from '@mui/system'

export const OptionTimedOut = () => {
  const { videoIsTakingLong } = useControls()
  const { sortedOptions, currentOption, setCurrentOption } = useVideoOptions()

  const optionTakingTooLong = (
    <>
      <Typography>La opción actual está tardando demasiado...</Typography>
      <Button
        disabled={!videoIsTakingLong || sortedOptions.length === 1}
        onClick={() => {
          const newOption = sortedOptions.find((opt) => opt.id !== currentOption?.id)
          if (!newOption) return
          setCurrentOption(newOption)
        }}
      >
        Elegir otra opción
      </Button>
    </>
  )

  const runOutOfOptions = (
    <>
      <Typography>No hay opciones disponibles para este episodio...</Typography>
    </>
  )

  return (
    <Fade in={videoIsTakingLong}>
      <Absolute>
        <Absolute spacing={2} sx={{ background: 'rgba(0,0,0,0.6)' }}>
          {sortedOptions.length === 0 ? runOutOfOptions : optionTakingTooLong}
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
