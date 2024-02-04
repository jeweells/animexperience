import { error, info } from '@dev'
import { LinkedFn } from '../fnlinker'
import { ForcedAny } from '@shared/types'

const sleep = async (ms: number, onInit?: (cancel: () => void) => void) =>
  new Promise((resolve) => {
    const t = setTimeout(() => resolve({ canceled: false }), ms)
    onInit?.(() => {
      clearTimeout(t)
      resolve({ canceled: true })
    })
  })

const ticks = [5, 10, 15, 20, 30]
export const retry = (linkedFn: LinkedFn): LinkedFn => {
  if (!linkedFn.fn) return linkedFn
  const fnRef = linkedFn.fn
  linkedFn.fn = async (...args: ForcedAny[]): Promise<ForcedAny> => {
    for (let times = 1, targetTick = 0; ; times++) {
      try {
        return await fnRef?.(...args)
      } catch (err) {
        error('[FAILED]', linkedFn.debugName, err)
      }
      targetTick = Math.min(targetTick + 1, ticks.length - 1)
      info(`Retrying [${linkedFn.debugName}][Try number ${times}] in ${ticks[targetTick]} seconds`)
      await sleep(ticks[targetTick] * 1000)
    }
  }
  return linkedFn
}
