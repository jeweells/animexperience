import { styled } from '@mui/system'

export const VSpace = styled('div')<{ size: number }>`
  min-height: ${(props) => props.size}px;
  max-height: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  flex-shrink: 0;
`
