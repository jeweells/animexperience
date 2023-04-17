jest.mock('~/src/utils', () => ({
    __esModule: true,
    ...jest.requireActual('~/src/utils'),
    random: jest.fn().mockReturnValue(0),
}))
