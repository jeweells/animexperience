import { RawDevMessage } from '@shared/types'
import { Moment } from 'moment'

export type DevMessage = RawDevMessage & {
  id: string
  at: Moment
}
