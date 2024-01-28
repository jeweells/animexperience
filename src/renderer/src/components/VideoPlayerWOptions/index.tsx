import { useMemo, useState, useLayoutEffect, FC, PropsWithChildren, memo, useCallback } from 'react'
import { styled } from '@mui/system'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { useFadeInStyles } from '../../globalMakeStyles/fadeIn'
import { OptionsRow } from '../../placeholders/VideoPlayerWOptionsPlaceholder'
import VideoPlayer, { VideoOption } from '../VideoPlayer'
import OptionButton from './components/OptionButton'
import Tabs from '@mui/material/Tabs'
import { watch } from '@reducers'

const STabs = styled(Tabs)`
  min-height: 0;
  .MuiTabs-flexContainer {
    gap: 16px;
  }
`

export const VideoPlayerWOptions: FC<PropsWithChildren> = memo(({ children }) => {
  const { fadeIn } = useFadeInStyles()
  const dispatch = useAppDispatch()
  const availableOptions = useAppSelector((d) => d.watch.availableVideos)
  const usedOptions = useAppSelector((d) => d.playerOptions.options)
  const [currentOption, setCurrentOption] = useState<VideoOption | null>(null)
  const sortedOptions = useMemo(() => {
    if (Array.isArray(usedOptions) && Array.isArray(availableOptions)) {
      return availableOptions
        .map((a) => {
          return {
            ...a,
            score: usedOptions.find((u) => u.name === a.name)?.score ?? 0
          }
        })
        .sort((a, b) => {
          return b.score - a.score
        })
    }
    return []
  }, [availableOptions, usedOptions])

  useLayoutEffect(() => {
    if (sortedOptions.length === 0 || sortedOptions.find((opt) => opt.name === currentOption?.name))
      return
    setCurrentOption(sortedOptions[0])
  }, [sortedOptions, currentOption])

  const onOptionNotFound = useCallback(() => {
    if (!currentOption) return
    dispatch(watch.dropVideoOption(currentOption))
  }, [currentOption, sortedOptions])

  return (
    <VideoPlayer option={currentOption} onOptionNotFound={onOptionNotFound}>
      <OptionsRow className={fadeIn}>
        <STabs
          variant={'scrollable'}
          style={{ flex: 1 }}
          TabIndicatorProps={{
            style: {
              display: 'none'
            }
          }}
        >
          {sortedOptions?.map((x, idx) => (
            <OptionButton
              disabled={currentOption?.name === x?.name}
              key={idx}
              option={x}
              onClick={() => {
                setCurrentOption(x)
              }}
            />
          ))}
        </STabs>
        {children}
      </OptionsRow>
    </VideoPlayer>
  )
})

VideoPlayerWOptions.displayName = 'VideoPlayerWOptions'

export default VideoPlayerWOptions
