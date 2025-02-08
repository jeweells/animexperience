import type { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/system'
import { Text } from '../../Text'
import { StyledComponent } from '@emotion/styled'

export const TimeOverlay = styled(Text, { target: 'TimeOverlay' })`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-50%, -100%) translateY(-16px);
  display: none;
` as StyledComponent<BoxProps>
