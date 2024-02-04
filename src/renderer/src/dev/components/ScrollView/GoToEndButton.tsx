import { Badge, Box, Fab, Zoom } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

type Props = {
  startIndex: number
  onClick: () => void
}

export const GoToEndButton = ({ startIndex, onClick }: Props) => {
  return (
    <Zoom in={startIndex > 1}>
      <Box sx={{ position: 'absolute', right: 16, bottom: 16 }}>
        <Badge
          badgeContent={startIndex}
          showZero={true}
          max={999}
          color="error"
          overlap={'circular'}
          slotProps={{ badge: { style: { zIndex: 1052, pointerEvents: 'none' } } }}
        >
          <Fab color={'primary'} size={'small'} onClick={onClick}>
            <ArrowDownwardIcon />
          </Fab>
        </Badge>
      </Box>
    </Zoom>
  )
}
