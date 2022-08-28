import Store from 'electron-store'
import { Store as TStore, StoreMethod } from '../globals/types'
import { ipcMain } from 'electron'
import { formatKeys } from '../src/hooks/useStaticStore'

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

const storeInfo = {
    [TStore.WATCHED]: { version: '1' },
    [TStore.PLAYER_OPTIONS]: { version: '1' },
    [TStore.RECENTLY_WATCHED]: { version: '1' },
    [TStore.WATCH_HISTORY]: { version: '1' },
    [TStore.FOLLOWED]: { version: '1' },
}

const migrators: Record<TStore, (version: any, store: Store) => void> = {
    [TStore.FOLLOWED]: (version, store) => {
        if (!version) {
            const followed = store.get('followed', {}) as Record<string, unknown>
            const newFollowed = Object.entries(followed).reduce((acc, [key, val]) => {
                const _key = formatKeys([key])
                if (!_key) return acc
                acc[_key] = val
                return acc
            }, {} as Record<string, unknown>)
            store.set('followed', newFollowed)
        }
        const currentVersion = storeInfo[TStore.FOLLOWED].version
        if (version !== currentVersion) {
            store.set('version', currentVersion)
        }
    },
    [TStore.PLAYER_OPTIONS]: (version, store) => {
        const currentVersion = storeInfo[TStore.PLAYER_OPTIONS].version
        if (version !== currentVersion) {
            store.set('version', currentVersion)
        }
    },
    [TStore.RECENTLY_WATCHED]: (version, store) => {
        const currentVersion = storeInfo[TStore.RECENTLY_WATCHED].version
        if (version !== currentVersion) {
            store.set('version', currentVersion)
        }
    },
    [TStore.WATCH_HISTORY]: (version, store) => {
        const currentVersion = storeInfo[TStore.WATCH_HISTORY].version
        if (version !== currentVersion) {
            store.set('version', currentVersion)
        }
    },
    [TStore.WATCHED]: (version, store) => {
        const currentVersion = storeInfo[TStore.WATCHED].version
        if (version !== currentVersion) {
            store.set('version', currentVersion)
        }
    },
}

const migrateStores = () => {
    for (const [name, store] of Object.entries(stores)) {
        const version = store.get('version', null)
        migrators[name as TStore]?.(version, store)
    }
}

export const setupStores = () => {
    console.debug('Setting up stores')

    migrateStores()

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
