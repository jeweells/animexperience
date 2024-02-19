import { MouseEvent, useCallback, useEffect, useRef } from 'react'

export const useMouseTrack = ({
  onChange,
  useOnTarget
}: {
  onChange: (relOffset: number) => void
  useOnTarget: boolean
}) => {
  const relOffset = useRef(0)
  const ref = useRef<HTMLDivElement>(null)
  const handleChange = useCallback(
    (e: { clientX: number }) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      relOffset.current = Math.max(0, Math.min(1, (e.clientX - rect.x) / rect.width))
      onChange(relOffset.current)
    },
    [onChange]
  )

  useEffect(() => {
    if (useOnTarget) return
    document.addEventListener('mousemove', handleChange)
    return () => {
      document.removeEventListener('mousemove', handleChange)
    }
  }, [useOnTarget, handleChange])
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
