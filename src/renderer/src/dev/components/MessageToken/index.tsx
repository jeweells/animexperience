import { ForcedAny } from '@shared/types'
import { TextToken } from './TextToken'
import { ObjectToken } from './ObjectToken'
import { NumberToken } from './NumberToken'
import { TraceToken } from './TraceToken'

export const MessageToken = ({ token }: { token: ForcedAny }) => {
  if (typeof token === 'string') return <TextToken token={token} />
  if (typeof token === 'number') return <NumberToken token={token} />
  if ('$stack' in token) return <TraceToken token={token} />
  return <ObjectToken token={token} />
}
