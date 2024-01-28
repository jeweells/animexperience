import { styled } from '@mui/system'

export const ManageButtons = styled('div', { target: 'ManageButtons' })`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 8px;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.5) 20%,
    rgba(0, 0, 0, 0) 90%
  );
  -webkit-backface-visibility: initial;
`
