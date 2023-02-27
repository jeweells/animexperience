import '@testing-library/jest-dom/extend-expect'
import 'jest-styled-components'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'

const _mockStore = configureStore([thunk])

global.mockStore = _mockStore
