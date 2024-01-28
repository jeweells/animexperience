import { ForcedAny } from '../types'

export const formatKeys = (keys: ForcedAny[]): string => {
  return keys
    .map((x) => String(x).replace(/\./g, ''))
    .join('.')
    .toLowerCase()
}
