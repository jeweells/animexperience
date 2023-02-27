/* eslint-disable no-var */
import { MockStoreCreator } from 'redux-mock-store'

declare global {
    var mockStore: MockStoreCreator<unknown, {}>
}
