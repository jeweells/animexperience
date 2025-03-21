import moment from 'moment/moment'
import { ONE_HOUR_IN_SECONDS } from '~/src/constants'

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
  name: keyof typeof window.invokeNames,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  return window.electron.ipcRenderer.invoke(window.invokeNames[name].name, ...args)
}

export const random = () => Math.random()

export const polling = <T>(initialData: T, callback: (data: T, stop: () => T) => T, ms: number) => {
  let dataRef = initialData

  const t = setInterval(() => {
    dataRef = callback(dataRef, stop)
  }, ms)
  const stop = () => {
    clearInterval(t)
    return dataRef
  }
  return () => {
    stop()
  }
}

export const formatTime = (seconds: number) => {
  return moment.utc(seconds * 1000).format(seconds >= ONE_HOUR_IN_SECONDS ? 'HH:mm:ss' : 'mm:ss')
}
