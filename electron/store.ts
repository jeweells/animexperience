import Store from 'electron-store'
import { Store as TStore, StoreMethod } from '../globals/types'
import { ipcMain } from 'electron'

// Create the same store for each store in the TStore enum
export const stores: Record<TStore, Store> = Object.values(TStore).reduce(
    (acc: any, x) => {
        acc[x] = new Store({
            name: x,
            defaults: {},
        })
        return acc
    },
    {},
)

export const setupStores = () => {
    console.debug('Setting up stores')
    ipcMain.handle(StoreMethod.getStore, (event, store: TStore, key: string) => {
        return stores[store].get(key)
    })
    ipcMain.handle(
        StoreMethod.setStore,
        (event, store: TStore, key: string, value: any) => {
            stores[store].set(key, value)
        },
    )
}
