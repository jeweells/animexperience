import Typography from '@mui/material/Typography'

export const TextToken = ({ token }: { token: string }) => {
  return (
    <Typography
      title={token}
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: '1',
        WebkitBoxOrient: 'vertical',
        wordBreak: 'break-all',
        minWidth: '1ch'
      }}
    >
      {token}
    </Typography>
  )
}
