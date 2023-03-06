/* eslint-disable no-var */
import { MockStoreCreator } from 'redux-mock-store'
import * as testingLibrary from '@testing-library/react'
import { RootState } from '../redux/state'
import { DeepPartial } from 'redux'

declare global {
    var mockStore: MockStoreCreator<DeepPartial<RootState>, {}>
    var render: typeof testingLibrary.render
    var fireEvent: typeof testingLibrary.fireEvent
    var waitFor: typeof testingLibrary.waitFor
}
