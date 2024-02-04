import { ForcedAny } from '@shared/types'
import { BaseObjectToken } from './ObjectToken'

export const TraceToken = ({ token }: { token: ForcedAny }) => {
  return <BaseObjectToken token={token.$stack} text={'stack'} />
}
