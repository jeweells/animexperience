import { useEffect } from 'react'

type Modifiers = Record<'Alt' | 'AltGraph' | 'Control' | 'Meta' | 'Shift', boolean>

export type KeyInfo = Partial<{
  key: string
  code: string
  strict: boolean
  modifiers: Partial<Modifiers>
}>

export const useKeyUp = (
  callback: () => void,
  { key, code, strict = true, modifiers = {} }: KeyInfo
) => {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key !== key && e.code !== code) return
      const _modifiers = strict
        ? {
            ...({
              Alt: false,
              AltGraph: false,
              Meta: false,
              Control: false,
              Shift: false
            } satisfies Modifiers),
            ...modifiers
          }
        : modifiers

      for (const [key, val] of Object.entries(_modifiers) as Array<[keyof Modifiers, boolean]>) {
        if (e.getModifierState(key) !== val) {
          return
        }
      }
      callback()
    }
    document.addEventListener('keyup', handle)
    return () => {
      document.removeEventListener('keyup', handle)
    }
  }, [key, code, strict, callback])
}
