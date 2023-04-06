jest.mock('electron', () => ({
    __esModule: true,
    ipcRenderer: {
        invoke: jest.fn(),
    },
}))
