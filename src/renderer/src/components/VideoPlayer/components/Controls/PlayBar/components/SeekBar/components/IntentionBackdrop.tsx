import type { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/system'
import { TrackBar } from './TrackBar'
import { StyledComponent } from '@emotion/styled'

export const IntentionBackdrop = styled(TrackBar, { target: 'IntentionBackdrop' })`
  background-color: rgb(248, 248, 248);
  opacity: 0.7;
  width: 0;
` as StyledComponent<BoxProps>
