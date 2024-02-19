import { MouseEvent, useEffect, useState } from 'react'

export const usePrimaryButton = ({
  onMouseUp
}: {
  onMouseUp?: (e: DocumentEventMap['mouseup']) => void
}) => {
  const [pressed, setPressed] = useState(false)
  const PRIMARY_BUTTON = 0

  useEffect(() => {
    const handle = (e: DocumentEventMap['mouseup']) => {
      if (e.button !== PRIMARY_BUTTON) return
      onMouseUp?.(e)
      setPressed(false)
    }
    document.addEventListener('mouseup', handle)
    return () => {
      document.removeEventListener('mouseup', handle)
    }
  }, [onMouseUp])

  return {
    pressed,
    onMouseDown: (e: MouseEvent) => {
      if (e.button !== PRIMARY_BUTTON) return
      setPressed(true)
    }
  }
}
