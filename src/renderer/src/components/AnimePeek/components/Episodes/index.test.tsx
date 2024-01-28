import { Provider } from 'react-redux'
import Episodes, { EpisodesProps } from './index'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { EPISODES } from '@selectors'
import { MockStoreEnhanced } from 'redux-mock-store'
import theme from '../../../../theme'
import { ThemeProvider } from '@mui/material'

describe('Episodes', () => {
  let initialState: DeepPartial<RootState>
  let props: EpisodesProps
  let store: MockStoreEnhanced

  const getComponent = (override: Partial<EpisodesProps> = {}) => {
    store = mockStore(initialState)
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Episodes {...props} {...override} />
        </ThemeProvider>
      </Provider>
    )
  }

  beforeEach(() => {
    initialState = {
      watched: {
        episodes: {
          69: {
            currentTime: 59,
            at: 101,
            duration: 600
          }
        }
      }
    }

    props = {
      groupSize: 10,
      info: {
        description: 'here goes description',
        link: 'here goes link',
        emitted: {
          from: 69,
          to: 129
        },
        related: [
          { name: 'Related name', link: 'related link', type: 'Ova' },
          { name: 'Related name', link: 'related link', type: 'Serie' },
          { name: 'Related name', link: 'related link', type: 'Película' },
          { name: 'Related name', link: 'related link', type: 'Especial' }
        ],
        episodeLink: 'here goes episode link (here goes episode replace)',
        type: 'Serie',
        image: 'here goes image',
        episodeReplace: 'here goes episode replace',
        episodesRange: {
          max: 10,
          min: 1
        },
        otherTitles: ['title1', 'title2'],
        status: 'En emisión',
        tags: ['tag1', 'tag2'],
        thumbnail: 'here goes thumbnail',
        title: 'here goes title'
      }
    }
  })

  it.each([[1], [5], [20], [30]])('renders default with different groupSize=%s', (groupSize) => {
    const wrapper = render(getComponent({ groupSize }))
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('changes the order when clicking the sort button', () => {
    const wrapper = render(getComponent())
    fireEvent.click(wrapper.getByTestId(EPISODES.SORT_BUTTON))
    expect(wrapper.asFragment()).toMatchSnapshot()
  })
})
