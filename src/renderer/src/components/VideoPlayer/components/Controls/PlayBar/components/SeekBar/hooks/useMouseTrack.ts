import { MouseEvent, useEffect, useRef } from 'react'
import { useCallbackRef } from '~/src/hooks/useCallbackRef'

export const useMouseTrack = ({
  onChange,
  useOnTarget
}: {
  onChange: (relOffset: number) => void
  useOnTarget: boolean
}) => {
  const relOffset = useRef(0)
  const ref = useRef<HTMLDivElement>(null)
  const onChangeRef = useCallbackRef(onChange)
  const handleChange = useCallbackRef((e: { clientX: number }) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    relOffset.current = Math.max(0, Math.min(1, (e.clientX - rect.x) / rect.width))
    onChangeRef?.(relOffset.current)
  })

  useEffect(() => {
    if (useOnTarget) return
    document.addEventListener('mousemove', handleChange)
    return () => {
      document.removeEventListener('mousemove', handleChange)
    }
  }, [useOnTarget])
  return {
    relOffset,
    ref,
    onMouseMove: (e: MouseEvent<HTMLDivElement>) => {
      if (!useOnTarget) return
      handleChange(e)
    },
    onMouseLeave: () => {
      relOffset.current = 0
      onChange(0)
    }
  }
}
