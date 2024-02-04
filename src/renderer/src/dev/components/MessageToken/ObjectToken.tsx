import { ForcedAny } from '@shared/types'
import { Tag } from '../Tag'
import { addToken } from '~/src/dev/hooks/useTokens'

export const ObjectToken = ({ token }: { token: ForcedAny }) => {
  return (
    <Tag
      style={{ cursor: 'pointer' }}
      onClick={(e) => {
        e.stopPropagation()
        addToken(token)
      }}
    >
      {typeof token}
    </Tag>
  )
}
