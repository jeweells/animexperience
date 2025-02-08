import { useMemo, useState, useLayoutEffect, FC, memo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import VideoPlayer, { VideoOption } from '../VideoPlayer'
import { watch } from '@reducers/watch'
import { VideoOptionsContext } from '@components/VideoPlayerWOptions/context'
import { PRIORITY_VIDEO_OPTION_KEY } from '~/src/constants'

export const VideoPlayerWOptions: FC = memo(() => {
  const dispatch = useAppDispatch()
  const availableOptions = useAppSelector((d) => d.watch.availableVideos)
  const usedOptions = useAppSelector((d) => d.playerOptions.options)
  const [currentOption, setCurrentOption] = useState<VideoOption | null>(null)
  const sortedOptions = useMemo(() => {
    if (!(Array.isArray(usedOptions) && Array.isArray(availableOptions))) return []
    const temporalPriorityOption = sessionStorage.getItem(PRIORITY_VIDEO_OPTION_KEY)
    const _options = availableOptions
      .map((a) => {
        return {
          ...a,
          score: usedOptions.find((u) => u.name === a.name)?.score ?? 0
        }
      })
      .sort((a, b) => {
        return b.score - a.score
      })
    if (!temporalPriorityOption) return _options
    const priorityOptionIndex = _options.findIndex((opt) => opt.name === temporalPriorityOption)
    if (priorityOptionIndex < 0) return _options
    _options.unshift(..._options.splice(priorityOptionIndex, 1))
    return _options
  }, [availableOptions, usedOptions])

  useLayoutEffect(() => {
    if (sortedOptions.some((opt) => opt.id === currentOption?.id)) return
    setCurrentOption(sortedOptions[0] ?? null)
  }, [sortedOptions, currentOption])

  const onOptionNotFound = useCallback(() => {
    if (!currentOption) return
    dispatch(watch.dropVideoOption(currentOption))
  }, [currentOption, sortedOptions])

  return (
    <VideoOptionsContext.Provider
      value={useMemo(
        () => ({
          sortedOptions,
          currentOption,
          setCurrentOption
        }),
        [sortedOptions, currentOption, setCurrentOption]
      )}
    >
      <VideoPlayer option={currentOption} onOptionNotFound={onOptionNotFound}></VideoPlayer>
    </VideoOptionsContext.Provider>
  )
})

VideoPlayerWOptions.displayName = 'VideoPlayerWOptions'

export default VideoPlayerWOptions
