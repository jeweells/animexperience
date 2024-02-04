import { ForcedAny } from '@shared/types'
import { Tag } from '../Tag'
import { addToken } from '~/src/dev/hooks/useTokens'

export const BaseObjectToken = ({ token, text }: { token: ForcedAny; text: string }) => {
  return (
    <Tag
      style={{ cursor: 'pointer' }}
      onClick={(e) => {
        e.stopPropagation()
        console.debug(token)
        addToken(token)
      }}
    >
      {text}
    </Tag>
  )
}

export const ObjectToken = ({ token }: { token: ForcedAny }) => {
  return <BaseObjectToken token={token} text={typeof token} />
}
