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
