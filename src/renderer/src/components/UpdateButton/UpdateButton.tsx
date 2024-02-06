import { NewVersion, Downloading, InstallVersion } from './components'
import { useEffect, useState } from 'react'
import { eventNames } from '@shared/constants'

const ipc = window.electron.ipcRenderer

export const UpdateButton = () => {
  const [updateAvailable, setUpdateAvailable] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    return ipc.on(eventNames.update.found, (_, { version }) => {
      setUpdateAvailable(version)
    })
  }, [])

  useEffect(() => {
    return ipc.on(eventNames.update.progress, (_, { percent }) => {
      setProgress(percent)
    })
  }, [])

  useEffect(() => {
    return ipc.on(eventNames.update.finished, () => {
      setCanInstall(true)
    })
  }, [])

  if (canInstall)
    return (
      <InstallVersion
        onClick={() => {
          void ipc.invoke(eventNames.update.install)
        }}
      />
    )
  if (progress !== null) return <Downloading progress={progress} />
  if (updateAvailable)
    return (
      <NewVersion
        version={updateAvailable}
        onClick={() => {
          void ipc.invoke(eventNames.update.download)
          setProgress(0)
        }}
      />
    )
  return null
}
