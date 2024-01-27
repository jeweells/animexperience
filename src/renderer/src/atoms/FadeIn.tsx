import { styled, keyframes } from '@mui/system'

const fadeInRL = keyframes`
  from {
    opacity: 0;
      transform: translateX(5%);
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
`

export const FadeInRL = styled('div')<{ duration: number }>`
  animation: ${fadeInRL} ${(props) => props.duration}ms;
`
