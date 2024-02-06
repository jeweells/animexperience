import Button from '@mui/material/Button'
import { CircularProgress } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
export const Downloading = ({ progress }: { progress: number }) => {
  return (
    <Tooltip title={'Actualizando...'} arrow>
      <Button
        startIcon={<CircularProgress size={'1rem'} color={'inherit'} />}
        style={{
          // @ts-ignore This exists in electron
          WebkitAppRegion: 'no-drag',
          WebkitUserSelect: 'all'
        }}
      >
        {Math.floor(progress).toFixed(1)}%
      </Button>
    </Tooltip>
  )
}
