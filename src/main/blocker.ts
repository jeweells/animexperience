import { ElectronBlocker, adsAndTrackingLists } from '@cliqz/adblocker-electron'
import fetch from 'node-fetch'
import { session } from 'electron' // required 'fetch'
export const setupBlocker = async () => {
  console.debug('Setting up ad blocker')
  const blocker = await ElectronBlocker.fromLists(fetch, adsAndTrackingLists, {
    loadCosmeticFilters: false,
    loadNetworkFilters: true
  })
  blocker.enableBlockingInSession(session.defaultSession)
  console.debug('Ad blocker set successfully')
  return blocker
}
