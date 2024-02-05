import { PropsWithChildren, useEffect } from 'react'
import Fade from '@mui/material/Fade'
import { useShowControls } from './hooks'

export const OpacityLayer = ({ children }: PropsWithChildren) => {
  const { show, transitionMs } = useShowControls()
  useEffect(() => {
    document.body.style.cursor = show ? 'unset' : 'none !important'
    return () => {
      document.body.style.cursor = 'unset'
    }
  }, [show])
  return (
    <Fade in={show} timeout={transitionMs}>
      <div>{children}</div>
    </Fade>
  )
}
