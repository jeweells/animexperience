import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import { useLoading } from './hooks'
import { styled } from '@mui/system'

const Wrapper = styled(Stack)`
  pointer-events: none;
  position: absolute;
  justify-content: center;
  align-items: center;
  inset: 0;
  transition: opacity 250ms ease-in-out;
`

export const Loading = () => {
  const { loading } = useLoading()
  return (
    <Wrapper style={{ opacity: loading ? 1 : 0 }}>
      <CircularProgress
        size={'clamp(100px, 5vw, 200px)'}
        style={{
          color: 'rgba(255,255,255,0.7)'
        }}
      />
    </Wrapper>
  )
}
