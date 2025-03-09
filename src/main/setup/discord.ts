import { error } from '@dev'
import { eventNames } from '@shared/constants'
import { StartWatchingInfo } from '@shared/types'
import { Client } from 'discord-rpc'
import { ipcMain } from 'electron'
import { DISCORD_CLIENT_ID } from '../constants'

export const setupDiscord = async () => {
  const client = new Client({ transport: 'ipc' })
  await client.login({ clientId: DISCORD_CLIENT_ID })

  ipcMain.handle(eventNames.startWatching, (_e, info: StartWatchingInfo) => {
    void client
      .setActivity({
        startTimestamp: info.startAt,
        largeImageKey: 'logo',
        details: info.name,
        state: `Episodio ${info.episode}`
      })
      .catch(error)
  })

  ipcMain.handle(eventNames.stopWatching, () => {
    void client.clearActivity().catch(error)
  })
}
