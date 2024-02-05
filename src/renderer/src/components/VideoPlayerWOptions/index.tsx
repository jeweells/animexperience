import { useMemo, useState, useLayoutEffect, FC, memo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import VideoPlayer, { VideoOption } from '../VideoPlayer'
import { watch } from '@reducers'

export const VideoPlayerWOptions: FC = memo(() => {
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

  return <VideoPlayer option={currentOption} onOptionNotFound={onOptionNotFound}></VideoPlayer>
})

VideoPlayerWOptions.displayName = 'VideoPlayerWOptions'

export default VideoPlayerWOptions
