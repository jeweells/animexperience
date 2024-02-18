import { useRef } from 'react'
import { ForcedAny } from '@shared/types'

export const useCallbackRef = <T extends (...args: ForcedAny[]) => ForcedAny>(
  callback: T | undefined | null
): T => {
  const ref = useRef<T | undefined | null>()
  ref.current = callback
  return useRef(((...args) => {
    return ref.current?.(...args)
  }) as T).current
}
