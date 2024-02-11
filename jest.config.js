// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/src/renderer/tests/config/babelTransform.js',
    '^.+\\.css$': '<rootDir>/src/renderer/tests/config/cssTransform.js',
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)':
      '<rootDir>/src/renderer/tests/config/fileTransform.js'
  },
  moduleNameMapper: {
    '\\.(ttf)$': '<rootDir>/src/renderer/tests/__mocks__/fonts.ts',
    '\\.(css|less|scss|sass|png)$': 'identity-obj-proxy',
    '^@components/(.*)$': '<rootDir>/src/renderer/src/components/$1',
    '^@components$': '<rootDir>/src/renderer/src/components/',
    '^@reducers$': '<rootDir>/src/renderer/redux/reducers/',
    '^@selectors/(.*)$': '<rootDir>/src/renderer/src/selectors/$1',
    '^@selectors$': '<rootDir>/src/renderer/src/selectors/',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^~/(.*)$': '<rootDir>/src/renderer/$1'
  },
  setupFilesAfterEnv: [
    './src/renderer/tests/setupTests.tsx',
    './src/renderer/tests/__mocks__/electron.ts',
    './src/renderer/tests/__mocks__/react-waypoint.tsx',
    './src/renderer/tests/__mocks__/use-resize-observer.ts',
    './src/renderer/tests/__mocks__/src/utils.ts',
    './src/renderer/tests/__mocks__/mui/material/Skeleton.tsx',
    './src/renderer/tests/__mocks__/@electron/remote/index.ts',
    './src/renderer/tests/__mocks__/@dev/events/index.ts',
    './src/renderer/tests/__mocks__/src/components/VideoPlayer/components/Controls/hooks/useControls.ts'
  ],
  snapshotSerializers: ['@emotion/jest/serializer']
}
