import '@testing-library/jest-dom'
import { thunk } from 'redux-thunk'
import configureStore from 'redux-mock-store'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import invokeNames from '../../main/invokeNames'
import { ThemeProvider } from '@mui/material'
import theme from '../src/theme'

const _mockStore = configureStore<DeepPartial<RootState>>([thunk])

globalThis.mockStore = _mockStore
// @ts-ignore
globalThis.render = (ui, options) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>, options)
globalThis.fireEvent = fireEvent
globalThis.waitFor = waitFor
globalThis.invokeNames = invokeNames
globalThis.electron = {
  // @ts-ignore
  ipcRenderer: {
    invoke: jest.fn().mockResolvedValue('')
  }
}
// @ts-ignore
globalThis.window = globalThis
globalThis.currentURL = 'http://127.0.0.1:3000/mocked_url/'
