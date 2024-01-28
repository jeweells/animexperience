import { AppDispatch } from '~/redux/utils'
import store from '~/redux/store'

export const dispatch: AppDispatch = (action) => store.dispatch(action)
