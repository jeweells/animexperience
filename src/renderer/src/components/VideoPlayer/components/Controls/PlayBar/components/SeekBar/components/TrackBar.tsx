import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/system'
import { TRANSITION_DURATION_MS } from '../constants'
import { StyledComponent } from '@emotion/styled'

export const TrackBar = styled(Box, { target: 'TrackBar' })`
  transform: scaleY(0.6);
  transition: transform ${TRANSITION_DURATION_MS}ms ease-in-out;
  height: 8px;
  width: 0;
  background-color: var(--bg);
  position: absolute;
  left: 0;
  bottom: 0;
` as StyledComponent<BoxProps>
