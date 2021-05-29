import Store from "electron-store";
import { Store as TStore, StoreMethod } from "../globals/types";
import { ipcMain } from "electron";

export const stores = {
    [TStore.WATCHED]: new Store({
        name: TStore.WATCHED,
        defaults: {},
    })
};

export const setupStores = () => {
    ipcMain.handle(StoreMethod.getStore, (event, store: TStore, key: string) => {
        return stores[store].get(key);
    });
    ipcMain.handle(StoreMethod.setStore, (event, store: TStore, key: string, value: any) => {
        stores[store].set(key, value);
    });
};
