import { ipcRenderer } from 'electron'
import invokeNames from '../electron/invokeNames'

export const range = (length: number): number[] => {
    return Array(length)
        .fill(0)
        .map((_, x) => x)
}

export const pixel = (n: string | number): string => {
    if (typeof n === 'number') {
        return n + 'px'
    }
    return n
}

export const rendererInvoke = (
    name: keyof typeof invokeNames,
    ...args: any[]
): Promise<any> => {
    return ipcRenderer.invoke(invokeNames[name].name, ...args)
}
