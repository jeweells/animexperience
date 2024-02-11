jest.mock('@dev/events', () => {
  return {
    __esModule: true,
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
})
