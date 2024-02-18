import { styled } from '@mui/system'
import { BoxProps } from '@mui/material'
import { TrackBar } from './TrackBar'
import { StyledComponent } from '@emotion/styled'

export const Backdrop = styled(TrackBar, { target: 'Backdrop' })`
  background-color: rgba(238, 238, 238);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  opacity: 0.3;
  width: 100%;
` as StyledComponent<BoxProps>
