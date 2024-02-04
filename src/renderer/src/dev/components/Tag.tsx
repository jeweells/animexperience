import { styled } from '@mui/system'

export const Tag = styled('div')`
  flex-shrink: 0;
  font-size: 11px;
  padding: ${({ theme }) => theme.spacing(0.7)};
  border-radius: ${({ theme }) => theme.spacing(1)};
  background-color: rgb(from var(--msg-color) r g b / 10%);
  color: rgb(from var(--msg-color) r g b / 80%);
  line-height: 1;
  transition: background-color 300ms ease-in-out;
  :hover {
    background-color: rgb(from var(--msg-color) r g b / 30%);
  }
`
