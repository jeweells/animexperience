import { PropsWithChildren, memo, FC } from 'react'
import { styled } from '@mui/system'
import { FColG16, FRowG8 } from '~/src/atoms/Layout'

export type InfoProps = PropsWithChildren<{
  icon?: React.ReactNode
  title: string
}>
const Title = styled(FRowG8)`
  gap: 8px;
  align-items: center;
  font-weight: 500;
  font-size: 1.1rem;
`
const Value = styled('div')`
  color: rgba(233, 235, 240, 0.8);
  font-size: 0.9rem;
`
export const Info: FC<InfoProps> = memo(({ title, icon = null, children }) => {
  return (
    <FColG16>
      <Title as={'h5'}>
        {icon}
        {title}
      </Title>
      <Value>{children}</Value>
    </FColG16>
  )
})

Info.displayName = 'Info'

export default Info
