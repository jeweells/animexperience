import { Text } from './Text'
import { useVideoOptions } from '@components/VideoPlayerWOptions/hooks'
import Button, { ButtonBaseProps } from '@mui/material/ButtonBase'

export const CurrentVideoOption = (props: ButtonBaseProps) => {
  const { currentOption } = useVideoOptions()

  return (
    <Button {...props} sx={{ px: 1.7, py: 1.5, ...props.sx }}>
      <Text>{currentOption?.name}</Text>
    </Button>
  )
}
