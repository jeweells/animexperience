import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { memo } from 'react'
import { DevMessage } from '~/src/dev/types'
import { styled } from '@mui/material/styles'
import { MessageIcon } from './MessageIcon'
import { Tag } from './Tag'
import { MessageToken } from './MessageToken'

const PaperBase = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  flexShrink: 0,
  backgroundColor: 'var(--msg-bg-color)',
  color: 'var(--msg-color)'
}))

const DebugPaper = styled(PaperBase)`
  --msg-bg-color: #e1e1e1;
  --msg-color: #656565;
`

const InfoPaper = styled(PaperBase)`
  --msg-bg-color: #d6ffff;
  --msg-color: #444;
`

const ErrorPaper = styled(PaperBase)`
  --msg-bg-color: #9f2b2b;
  --msg-color: #fff;
`

const WarnPaper = styled(PaperBase)`
  --msg-bg-color: #c27f27;
  --msg-color: #fff;
`

const itemMap: Record<DevMessage['type'], typeof PaperBase> = {
  debug: DebugPaper,
  info: InfoPaper,
  error: ErrorPaper,
  warn: WarnPaper
}

const IconBox = styled(Tag)`
  font-size: 16px;
  padding: 4px;
`

type Props = { message: DevMessage; onFocus?: (focus: boolean) => void; isFocused?: boolean }

export const MessageItem = memo(({ isFocused, message, onFocus }: Props) => {
  const Bg = itemMap[message.type]

  return (
    <Bg
      onClick={() => {
        onFocus?.(!isFocused)
      }}
      style={{
        border: isFocused ? '1px solid red' : undefined
      }}
    >
      <Stack
        spacing={2}
        direction={'row'}
        alignItems={'center'}
        height={'100%'}
        px={1.4}
        overflow={'hidden'}
      >
        <IconBox>
          <MessageIcon icon={message.type} />
        </IconBox>
        <Stack direction={'row'} flex={1} spacing={1}>
          {message.message.map((msg, index) => {
            return <MessageToken key={index} token={msg} />
          })}
        </Stack>

        <Tag>{message.at.format('HH:mm:ss')}</Tag>
      </Stack>
    </Bg>
  )
})

MessageItem.displayName = 'MessageItem'
