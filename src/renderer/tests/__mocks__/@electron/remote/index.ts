jest.mock('@electron/remote', () => {
  const getURL = jest.fn().mockReturnValue('http://127.0.0.1:3000/mocked_url/')
  return {
    __esModule: true,
    getCurrentWindow: () => ({
      webContents: {
        getURL
      }
    })
  }
})
