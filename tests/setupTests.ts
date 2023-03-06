import '@testing-library/jest-dom/extend-expect'
import 'jest-styled-components'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import { render, fireEvent, waitFor, act } from '@testing-library/react'
import { RootState } from '../redux/state'
import { DeepPartial } from 'redux'

const _mockStore = configureStore<DeepPartial<RootState>>([thunk])

global.mockStore = _mockStore
global.render = render
global.fireEvent = fireEvent
global.waitFor = waitFor
global.act = act
