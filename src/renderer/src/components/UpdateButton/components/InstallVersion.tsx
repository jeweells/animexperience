import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import { Badge } from '@mui/material'

export const InstallVersion = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Tooltip title={'Se cerrará la aplicación y se volverá a abrir'} arrow>
      <Badge
        color="error"
        badgeContent=" "
        variant="dot"
        style={{ color: 'red', zIndex: 1000 }}
        slotProps={{ badge: { style: { zIndex: 10000, color: 'red' } } }}
      >
        <Button
          onClick={onClick}
          style={{
            // @ts-ignore This exists in electron
            WebkitAppRegion: 'no-drag',
            WebkitUserSelect: 'all'
          }}
        >
          Instalar actualización
        </Button>
      </Badge>
    </Tooltip>
  )
}
