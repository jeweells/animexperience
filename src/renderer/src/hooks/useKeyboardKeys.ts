import { useEffect, useRef } from 'react'

type KeyInfo = Partial<{
  key: string
  code: string
  ctrKey: boolean
  altKey: boolean
  shiftKey: boolean
}>

export const useKeyUp = (callback: () => void, { key, code, ...modifiers }: KeyInfo) => {
  const cbRef = useRef(callback)
  cbRef.current = callback
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key !== key && e.code !== code) return
      for (const [key, val] of Object.entries(modifiers)) {
        if (e[key] !== val) return
      }
      cbRef.current?.()
    }
    document.addEventListener('keyup', handle)
    return () => {
      document.removeEventListener('keyup', handle)
    }
  }, [key, code])
}
