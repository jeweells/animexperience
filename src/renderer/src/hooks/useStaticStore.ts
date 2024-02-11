import { useMemo } from 'react'
import { Store, StoreMethod, Optional, ForcedAny } from '@shared/types'

const ipcRenderer = window.electron.ipcRenderer

type KeyPart = Optional<string | number>

export const formatKeys = (keys: KeyPart[]): string => {
  return keys
    .filter((key) => key !== undefined && key !== null)
    .map((x) => String(x).replace(/\./g, ''))
    .join('.')
    .toLowerCase()
}

export const setStaticStore = (name: Store, ...keysAndValue: [...KeyPart[], ForcedAny]) => {
  return ipcRenderer.invoke(
    StoreMethod.setStore,
    name,
    formatKeys(keysAndValue.slice(0, -1)),
    keysAndValue[keysAndValue.length - 1]
  )
}
export const getStaticStore = (name: Store, ...keys: KeyPart[]) => {
  return ipcRenderer.invoke(StoreMethod.getStore, name, formatKeys(keys))
}

export const useStaticStore = (name: Store) => {
  return useMemo(
    () => ({
      get(...keys: KeyPart[]) {
        return getStaticStore(name, ...keys)
      },
      set(...keysAndValue: [...KeyPart[], ForcedAny]) {
        return setStaticStore(name, ...keysAndValue)
      }
    }),
    [name]
  )
}
