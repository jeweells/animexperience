import { useMemo, useState, useLayoutEffect, FC, memo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import VideoPlayer, { VideoOption } from '../VideoPlayer'
import { watch } from '@reducers'
import { VideoOptionsContext } from '@components/VideoPlayerWOptions/context'

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
