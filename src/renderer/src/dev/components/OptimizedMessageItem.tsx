import { MessageItem } from './MessageItem'
import { memo } from 'react'
import { focusMessage, removeFocusedMessage, useMessages } from '../hooks/useMessages'
import { DevMessage } from '~/src/dev/types'

export const OptimizedMessageItem = memo(
  ({ index, type }: { index: number; type: DevMessage['type'] | 'all' }) => {
    const message = useMessages(
      (state) => state.messages[type === 'all' ? index : state.indexMapByType[type][index]]
    )
    const isFocused = useMessages((state) => state.focusedMessage === message.id)

    return (
      <MessageItem
        message={message}
        isFocused={isFocused}
        onFocus={(isFocused) => {
          if (isFocused) focusMessage(message.id)
          else removeFocusedMessage()
        }}
      />
    )
  }
)

OptimizedMessageItem.displayName = 'OptimizedMessageItem'
