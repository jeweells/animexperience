import { RawDevMessage } from '@shared/types'
import { Moment } from 'moment'

export interface DevMessage extends RawDevMessage {
  id: string
  at: Moment
}
