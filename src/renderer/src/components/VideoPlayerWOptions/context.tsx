import { createContext } from 'react'
import { VideoOption } from '@components/VideoPlayer'

export type VideoOptionsContextType = {
  sortedOptions: VideoOption[]
  currentOption: VideoOption | null
  setCurrentOption: (option: VideoOption | null) => void
}

// @ts-ignore Shit
export const VideoOptionsContext = createContext<VideoOptionsContextType>()
