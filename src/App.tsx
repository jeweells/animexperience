import '@babel/polyfill'
import { ThemeProvider } from '@material-ui/core/styles'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { watch } from '../redux/reducers/watch'
import store, { useAppDispatch } from '../redux/store'
import { VSpace } from './atoms/Spacing'
import ContinueWatching from './components/ContinueWatching'
import RecentAnimes from './components/RecentAnimes'
import RecentlyWatchedRecommendations from './components/RecentlyWatchedRecommendations'
import Topbar from './components/Topbar'
import { VideoPlayerModal } from './components/VideoPlayerModal'
import './index.less'
import { GlobalStyle } from './styles/GlobalStyle'
import { muiTheme } from './themes/mui'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const App = () => {
    const dispatch = useAppDispatch()
    return (
        <React.Fragment>
            <GlobalStyle />
            <Topbar>
                <ContinueWatching />
                <VSpace size={32} />
                <RecentAnimes />
                <VSpace size={32} />
                <RecentlyWatchedRecommendations />
                <VSpace size={32} />
                <VideoPlayerModal
                    onExited={() => {
                        dispatch(watch.reset())
                    }}
                />
            </Topbar>
        </React.Fragment>
    )
}

render(
    <Provider store={store}>
        <ThemeProvider theme={muiTheme}>
            <App />
        </ThemeProvider>
    </Provider>,
    mainElement,
)
