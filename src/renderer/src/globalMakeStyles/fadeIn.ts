import { makeStyles } from '@mui/styles'

export const useFadeInStyles = makeStyles({
  '@keyframes kFadeIn': {
    '0%': {
      opacity: 0
    },
    '100%': {
      opacity: 1
    }
  },
  fadeIn: {
    animation: '$kFadeIn .5s'
  }
})
