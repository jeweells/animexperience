import { useMessages } from '../hooks/useMessages'
import { ScrollView, ScrollViewController } from './ScrollView'
import { DevMessage } from '../types'
import { OptimizedMessageItem } from './OptimizedMessageItem'
import { useEffect, useRef } from 'react'

type Props = { type?: DevMessage['type'] | 'all' }

export const MessagesByType = ({ type = 'all' }: Props) => {
  const scrollViewRef = useRef<ScrollViewController>(null)

  const count = useMessages((state) =>
    type === 'all' ? state.messages.length : state.indexMapByType[type].length
  )

  useEffect(() => {
    if (type !== 'all') return
    return useMessages.subscribe((state, prevState) => {
      const focusedMessage = state.focusedMessage
      if (focusedMessage === prevState.focusedMessage) return
      if (!focusedMessage) return
      const targetIndex = state.messages.findIndex((msg) => msg.id === focusedMessage)
      scrollViewRef.current?.scrollToIndex(targetIndex)
    })
  }, [type])

  return (
    <ScrollView
      bgcolor={'#3a3939'}
      height={375}
      itemSize={50}
      ref={scrollViewRef}
      count={count}
      render={(index) => <OptimizedMessageItem index={index} type={type} />}
    />
  )
}
