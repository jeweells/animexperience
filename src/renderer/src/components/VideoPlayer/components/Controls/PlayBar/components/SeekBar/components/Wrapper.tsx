import { styled } from '@mui/system'
import { Box } from '@mui/material'
import { TrackBar } from './TrackBar'
import { Backdrop } from './Backdrop'
import { IntentionBackdrop } from './IntentionBackdrop'
import { BufferBackdrop } from './BufferBackdrop'
import { Dot } from './Dot'
import { TimeOverlay } from './TimeOverlay'

const hover = ({ forceHover }: { forceHover: boolean }) => (forceHover ? '' : ':hover')

export const Wrapper = styled(Box)<{ forceHover: boolean }>`
  --bg: #ffffff;
  cursor: pointer;
  height: 8px;
  box-sizing: content-box;
  padding-top: 16px;
  user-select: none;

  ${hover} ${TrackBar}, ${hover} ${Backdrop}, ${hover} ${IntentionBackdrop}, ${hover} ${BufferBackdrop} {
    transform: scaleY(1);
  }

  ${Dot} {
    border-radius: 0;
  }

  ${hover} ${Dot} {
    border-radius: 50%;
    width: 20px;
    height: 20px;
  }
  ${hover} ${TimeOverlay} {
    display: block;
  }
`
