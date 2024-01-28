import { styled } from '@mui/system'

export const AnimeInfo = styled('div', { target: 'AnimeInfo' })`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: ${(props) => props.theme.palette.primary.main};
  padding: 16px;
  flex-shrink: 0;
`
