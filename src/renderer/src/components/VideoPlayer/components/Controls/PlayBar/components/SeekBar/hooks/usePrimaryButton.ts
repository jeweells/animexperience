import { MouseEvent, useEffect, useState } from 'react'
import { useCallbackRef } from '~/src/hooks/useCallbackRef'

export const usePrimaryButton = ({
  onMouseUp
}: {
  onMouseUp?: (e: DocumentEventMap['mouseup']) => void
}) => {
  const [pressed, setPressed] = useState(false)
  const PRIMARY_BUTTON = 0
  const mouseUp = useCallbackRef(onMouseUp)

  useEffect(() => {
    const handle = (e: DocumentEventMap['mouseup']) => {
      if (e.button !== PRIMARY_BUTTON) return
      mouseUp(e)
      setPressed(false)
    }
    document.addEventListener('mouseup', handle)
    return () => {
      document.removeEventListener('mouseup', handle)
    }
  }, [])

  return {
    pressed,
    onMouseDown: (e: MouseEvent) => {
      if (e.button !== PRIMARY_BUTTON) return
      setPressed(true)
    }
  }
}
