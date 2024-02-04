import { ForcedAny } from '@shared/types'
import { TextToken } from './TextToken'
import { ObjectToken } from './ObjectToken'

export const MessageToken = ({ token }: { token: ForcedAny }) => {
  if (typeof token === 'string') return <TextToken token={token} />
  return <ObjectToken token={token} />
}
