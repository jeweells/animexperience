module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@mui/material',
            message: 'Please do import ComponentName from "@mui/material/ComponentName" instead.'
          }
        ],
        patterns: ['^@mui/material$']
      }
    ]
  }
}
