import { KeyInfo, useKeyUp } from '~/src/hooks'

const buildHooks = <T extends string>(
  options: Record<T, KeyInfo | KeyInfo[]>
): Record<T, (callback: () => void) => void> => {
  return Object.fromEntries(
    Object.entries<KeyInfo | KeyInfo[]>(options).map(([key, keyInfos]) => [
      key,
      (callback: () => void) => {
        for (const keyInfo of Array.isArray(keyInfos) ? keyInfos : [keyInfos]) {
          useKeyUp(callback, keyInfo)
        }
      }
    ])
  ) as Record<T, (callback: () => void) => void>
}

export const {
  useGoNextEpisode,
  useGoPreviousEpisode,
  useSeekForward,
  useSeekBackward,
  useOpenEpisodeList,
  usePopModal,
  useMute,
  useVolumeUp,
  useVolumeDown,
  useTogglePlayPause,
  useToggleFullscreen
} = buildHooks({
  useSeekForward: {
    key: 'ArrowRight'
  },
  useSeekBackward: {
    key: 'ArrowLeft'
  },
  useOpenEpisodeList: { key: 'e' },
  usePopModal: { code: 'Escape' },
  useGoNextEpisode: [
    { key: 'ArrowRight', modifiers: { AltGraph: true } },
    { key: 'ArrowRight', modifiers: { Alt: true } }
  ],
  useGoPreviousEpisode: [
    { key: 'ArrowLeft', modifiers: { AltGraph: true } },
    { key: 'ArrowLeft', modifiers: { Alt: true } }
  ],
  useMute: { key: 'm' },
  useVolumeUp: { key: 'ArrowUp' },
  useVolumeDown: { key: 'ArrowDown' },
  useTogglePlayPause: { code: 'Space' },
  useToggleFullscreen: { key: 'f' }
})
