import { Typography } from '@mui/material'

export const NumberToken = ({ token }: { token: number }) => {
  return (
    <Typography
      title={String(token)}
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: '1',
        WebkitBoxOrient: 'vertical',
        wordBreak: 'break-all',
        fontWeight: 'bold',
        minWidth: '1ch'
      }}
    >
      {String(token)}
    </Typography>
  )
}
