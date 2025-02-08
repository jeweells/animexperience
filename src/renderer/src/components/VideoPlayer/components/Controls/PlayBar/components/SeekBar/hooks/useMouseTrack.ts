import { useCallback, useEffect, useRef } from 'react'

export const useMouseTrack = ({
  onChange,
  isTargetPressed
}: {
  onChange: (relOffset: number) => void
  isTargetPressed: boolean
}) => {
  const relOffset = useRef(0)
  const ref = useRef<HTMLDivElement>(null)
  const clientXRef = useRef(0)
  const relOffsetBackup = useRef<number | null>(null)

  const updatePosition = useCallback(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    relOffset.current = Math.max(0, Math.min(1, (clientXRef.current - rect.x) / rect.width))
    onChange(relOffset.current)
  }, [onChange])

  useEffect(() => {
    if (!isTargetPressed) return
    updatePosition()
  }, [updatePosition, isTargetPressed])

  useEffect(() => {
    const ctrl = new AbortController()
    document.addEventListener(
      'mousemove',
      (e) => {
        // Always capture mouse X position
        clientXRef.current = e.clientX
        if (!ref.current) return
        if (!isTargetPressed) return
        updatePosition()
      },
      { signal: ctrl.signal }
    )
    return () => {
      ctrl.abort()
    }
  }, [updatePosition, isTargetPressed])

  return {
    relOffset,
    ref,
    onMouseMove: () => {
      if (isTargetPressed) return
      if (relOffsetBackup.current === null) {
        relOffsetBackup.current = relOffset.current
      }
      updatePosition()
    },
    onMouseLeave: () => {
      if (isTargetPressed) return
      relOffset.current = 0
      onChange(0)
    }
  }
}
