import { styled } from '@mui/system'
import IconButton from '@mui/material/IconButton'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeDownIcon from '@mui/icons-material/VolumeDown'
import VolumeMuteIcon from '@mui/icons-material/VolumeMute'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import CloseIcon from '@mui/icons-material/Close'
import { ComponentProps, forwardRef, ReactNode } from 'react'
import Tooltip from '@mui/material/Tooltip'

const TransparentIconButton = styled(IconButton)`
  color: white;
  &,
  &:hover {
    background: transparent;
  }
`
const icons = {
  play: PlayArrowIcon,
  pause: PauseIcon,
  fullscreen: FullscreenIcon,
  exitFullscreen: FullscreenExitIcon,
  skipNext: SkipNextIcon,
  volumeUp: VolumeUpIcon,
  volumeDown: VolumeDownIcon,
  volumeMute: VolumeMuteIcon,
  listNumbered: FormatListNumberedIcon,
  close: CloseIcon
}

export type IconName = keyof typeof icons

type Props = { name: IconName; title: ReactNode } & Omit<
  ComponentProps<typeof TransparentIconButton>,
  'name' | 'title'
>

export const Icon = forwardRef<HTMLButtonElement, Props>(
  ({ name, title, ...props }: Props, ref) => {
    const Component = icons[name]
    return (
      <Tooltip title={title}>
        <TransparentIconButton size={'large'} ref={ref} {...props}>
          <Component />
        </TransparentIconButton>
      </Tooltip>
    )
  }
)

Icon.displayName = 'Icon'
