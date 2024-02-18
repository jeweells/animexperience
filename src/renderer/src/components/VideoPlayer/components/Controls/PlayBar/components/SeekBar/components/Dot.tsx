import { styled } from '@mui/system'
import { Box, BoxProps } from '@mui/material'
import { TRANSITION_DURATION_MS } from '../constants'
import { StyledComponent } from '@emotion/styled'

export const Dot = styled(Box, { target: 'Dot' })`
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: var(--bg);
  transform: translate(-50%, -50%);
  position: absolute;
  left: 0;
  top: 50%;
  transition:
    width ${TRANSITION_DURATION_MS}ms ease-in-out,
    border-radius ${TRANSITION_DURATION_MS}ms ease-in-out,
    height ${TRANSITION_DURATION_MS}ms ease-in-out;
` as StyledComponent<BoxProps>
