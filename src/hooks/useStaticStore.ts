import { ipcRenderer } from 'electron'
import { useMemo } from 'react'
import { Store, StoreMethod } from '../../globals/types'

const formatKeys = (keys: any[]): string => {
    return keys
        .map((x) => String(x).replace(/\./g, ''))
        .join('.')
        .toLowerCase()
}

export const useStaticStore = (name: Store) => {
    return useMemo(
        () => ({
            get(...keys: any[]) {
                return ipcRenderer.invoke(StoreMethod.getStore, name, formatKeys(keys))
            },
            set(...keysAndValue: [any, any, ...any[]]) {
                return ipcRenderer.invoke(
                    StoreMethod.setStore,
                    name,
                    formatKeys(keysAndValue.slice(0, -1) as string[]),
                    keysAndValue[keysAndValue.length - 1],
                )
            },
        }),
        [name],
    )
}
