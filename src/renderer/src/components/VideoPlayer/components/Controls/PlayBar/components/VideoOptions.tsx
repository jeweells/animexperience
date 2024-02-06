import { useControls } from '../../hooks'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import { useState } from 'react'
import { useVideoOptions } from '@components/VideoPlayerWOptions/hooks'
import OptionButton from '@components/VideoPlayerWOptions/components/OptionButton'
import { CurrentVideoOption } from './CurrentVideoOption'

export const VideoOptions = () => {
  const { sortedOptions, currentOption, setCurrentOption } = useVideoOptions()
  const [openTooltip, setOpenTooltip] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { video } = useControls()
  const open = Boolean(anchorEl)
  if (!video) return null
  return (
    <Tooltip title={'Cambiar opción'} open={openTooltip}>
      <div>
        <CurrentVideoOption
          onMouseMove={() => {
            if (anchorEl) return
            setOpenTooltip(true)
          }}
          onMouseLeave={() => {
            setOpenTooltip(false)
          }}
          onClickCapture={(e) => {
            setOpenTooltip(false)
            setAnchorEl(e.currentTarget)
          }}
        />
        <Menu
          transitionDuration={0}
          open={open}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          onClose={() => {
            setAnchorEl(null)
          }}
          disableRestoreFocus={true}
          MenuListProps={{ dense: true }}
          anchorEl={anchorEl}
        >
          {sortedOptions.toReversed().map((opt) => {
            return (
              <OptionButton
                disabled={opt.id === currentOption?.id}
                key={opt.id}
                option={opt}
                onClick={() => {
                  setCurrentOption(opt)
                  setAnchorEl(null)
                }}
              />
            )
          })}
        </Menu>
      </div>
    </Tooltip>
  )
}
