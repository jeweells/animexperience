jest.mock('~/src/components/VideoPlayer/components/Controls/hooks/useControls', () => {
  const mediaSession = {
    setActionHandler: jest.fn()
  }

  Object.defineProperty(mediaSession, 'playbackState', {
    set: jest.fn(),
    get: jest.fn()
  })

  const video = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    ownerDocument: {
      defaultVew: {
        navigator: {
          mediaSession
        }
      }
    }
  }

  Object.defineProperty(video, 'currentTime', {
    get: jest.fn(() => 11 * 60 + 32),
    set: jest.fn()
  })

  Object.defineProperty(video, 'duration', {
    get: jest.fn(() => 24 * 60)
  })

  Object.defineProperty(video, 'paused', {
    get: jest.fn(() => false)
  })

  return {
    __esModule: true,
    useControls: jest.fn(() => ({
      video
    }))
  }
})
