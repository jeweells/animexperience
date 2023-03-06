import '@testing-library/jest-dom/extend-expect'
import 'jest-styled-components'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { RootState } from '../redux/state'
import { DeepPartial } from 'redux'

const _mockStore = configureStore<DeepPartial<RootState>>([thunk])

globalThis.mockStore = _mockStore
globalThis.render = render
globalThis.fireEvent = fireEvent
globalThis.waitFor = waitFor
