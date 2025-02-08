import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/system'
import { FC } from 'react'

export const Text = styled(Box)`
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.9);
  color: #fff;
` as FC<BoxProps>
