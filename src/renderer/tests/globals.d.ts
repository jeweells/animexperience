/* eslint-disable no-var */
import { MockStoreCreator } from 'redux-mock-store'
import * as testingLibrary from '@testing-library/react'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import invokeNames from '../../main/invokeNames'
import { electronAPI } from '@electron-toolkit/preload'

type InvokeNames = typeof invokeNames

declare global {
  var mockStore: MockStoreCreator<DeepPartial<RootState>, {}>
  var render: typeof testingLibrary.render
  var fireEvent: typeof testingLibrary.fireEvent
  var waitFor: typeof testingLibrary.waitFor
  var invokeNames: InvokeNames

  var electron: typeof electronAPI

  var window: Window & typeof globalThis

  var currentURL: string
}
