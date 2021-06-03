import { ipcRenderer } from 'electron'
import { useMemo } from 'react'
import { Store, StoreMethod } from '../../globals/types'

export const formatKeys = (keys: any[]): string => {
    return keys
        .map((x) => String(x).replace(/\./g, ''))
        .join('.')
        .toLowerCase()
}

export const setStaticStore = (name: Store, ...keysAndValue: any[]) => {
    return ipcRenderer.invoke(
        StoreMethod.setStore,
        name,
        formatKeys(keysAndValue.slice(0, -1) as string[]),
        keysAndValue[keysAndValue.length - 1],
    )
}
export const getStaticStore = (name: Store, ...keys: any[]) => {
    return ipcRenderer.invoke(StoreMethod.getStore, name, formatKeys(keys))
}

export const useStaticStore = (name: Store) => {
    return useMemo(
        () => ({
            get(...keys: any[]) {
                return getStaticStore(name, ...keys)
            },
            set(...keysAndValue: any[]) {
                return setStaticStore(name, ...keysAndValue)
            },
        }),
        [name],
    )
}
