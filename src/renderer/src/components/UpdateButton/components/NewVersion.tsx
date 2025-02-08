import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { useEffect, useState } from 'react'
import UpdateIcon from '@mui/icons-material/Update'

export const NewVersion = ({ version, onClick }: { version: string; onClick?: () => void }) => {
  const msgs = ['¡Ac', 'tua', 'lí', 'za', 'me!']

  const [index, setIndex] = useState(0)
  const msg = msgs[index]
  useEffect(() => {
    const t = setTimeout(
      () => {
        setIndex((p) => (p + 1) % msgs.length)
      },
      index + 1 === msgs.length ? 1500 : 500
    )
    return () => {
      clearTimeout(t)
    }
  }, [index])

  return (
    <Tooltip
      title={msg}
      arrow
      onOpen={() => {
        setIndex(0)
      }}
    >
      <Badge
        color="error"
        badgeContent=" "
        variant="dot"
        style={{ color: 'red', zIndex: 1000 }}
        slotProps={{ badge: { style: { zIndex: 10000, color: 'red' } } }}
      >
        <Button
          onClick={onClick}
          startIcon={<UpdateIcon />}
          style={{
            // @ts-ignore This exists in electron
            WebkitAppRegion: 'no-drag',
            WebkitUserSelect: 'all'
          }}
        >
          ¡Nueva versión disponible {version}!
        </Button>
      </Badge>
    </Tooltip>
  )
}
