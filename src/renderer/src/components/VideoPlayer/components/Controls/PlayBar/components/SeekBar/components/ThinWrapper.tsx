import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/system'
import { FC } from 'react'

export const ThinWrapper = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
` as FC<BoxProps>
