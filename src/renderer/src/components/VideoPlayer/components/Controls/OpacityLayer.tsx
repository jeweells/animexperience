import { PropsWithChildren } from 'react'
import Fade from '@mui/material/Fade'
import { useShowControls } from './hooks'

export const OpacityLayer = ({ children }: PropsWithChildren) => {
  const { show, transitionMs } = useShowControls()
  return (
    <Fade in={show} timeout={transitionMs}>
      <div>{children}</div>
    </Fade>
  )
}
