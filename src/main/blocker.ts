import { ElectronBlocker, adsAndTrackingLists } from '@cliqz/adblocker-electron'
import fetch from 'node-fetch'
import { session } from 'electron'
import { debug } from '@dev' // required 'fetch'
export const setupBlocker = async () => {
  debug('Setting up ad blocker')
  const blocker = await ElectronBlocker.fromLists(fetch, adsAndTrackingLists, {
    loadCosmeticFilters: false,
    loadNetworkFilters: true
  })
  blocker.enableBlockingInSession(session.defaultSession)
  debug('Ad blocker set successfully')
  return blocker
}
