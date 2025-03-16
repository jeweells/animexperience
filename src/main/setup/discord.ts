import { eventNames } from '@shared/constants'
import { StartWatchingInfo } from '@shared/types'
import { Client, type Presence } from 'discord-rpc'
import { ipcMain } from 'electron'
import { DISCORD_CLIENT_ID, DISCORD_RECONNECT_INTERVAL_MS } from '../constants'
import { retry } from '../utils'

export const setupDiscord = async () => {
  const discordRPC = DiscordRPC.getInstance()

  ipcMain.handle(eventNames.startWatching, (_e, info: StartWatchingInfo) => {
    discordRPC.setCurrentActivity({
      startTimestamp: info.startAt,
      largeImageKey: 'logo',
      details: info.name,
      state: `Episodio ${info.episode}`
    })
    discordRPC.notifyActivity()
  })

  ipcMain.handle(eventNames.stopWatching, () => {
    discordRPC.setCurrentActivity(null)
    discordRPC.notifyActivity()
  })
}

class DiscordRPC {
  client!: Client
  currentActivity: Presence | null = null

  _loginPromise: Promise<Client | null> | null = null

  static _instance: DiscordRPC | null = null

  static getInstance() {
    if (DiscordRPC._instance === null) {
      DiscordRPC._instance = new DiscordRPC()
      DiscordRPC._instance._login()
    }
    return DiscordRPC._instance
  }

  _createClient = () => {
    const client = new Client({ transport: 'ipc' })
    client.on('connection', () => {
      void this.notifyActivity()
    })
    client.on('disconnected', () => {
      void this._login()
    })
    return client
  }

  async _login() {
    if (this._loginPromise !== null) return this._loginPromise

    const { promise } = retry(() => {
      // It looks like the client has their own retries... but limited and we want to make it retry infinitely
      this.client = this._createClient()
      return this.client.login({ clientId: DISCORD_CLIENT_ID })
    }, DISCORD_RECONNECT_INTERVAL_MS)

    this._loginPromise = promise

    return promise.then((data) => {
      this._loginPromise = null
      // For some reason the "connection" event doesn't always trigger
      void this.notifyActivity()
      return data
    })
  }

  setCurrentActivity(currentActivity: Presence | null) {
    this.currentActivity = currentActivity
  }

  async notifyActivity() {
    if (this.currentActivity === null) {
      return this.client.clearActivity().catch(console.error)
    }
    return this.client.setActivity(this.currentActivity).catch(console.error)
  }
}
