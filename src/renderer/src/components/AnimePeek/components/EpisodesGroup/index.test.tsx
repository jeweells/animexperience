import { Provider } from 'react-redux'
import EpisodesGroup, { EpisodesGroupProps } from './index'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { MockStoreEnhanced } from 'redux-mock-store'
import TopLayout from '../../../../../plugins/gatsby-plugin-top-layout/TopLayout'

describe('EpisodesGroup', () => {
  let initialState: DeepPartial<RootState>
  let props: EpisodesGroupProps
  let store: MockStoreEnhanced

  const getComponent = (override: Partial<EpisodesGroupProps> = {}) => {
    store = mockStore(initialState)
    return (
      <TopLayout>
        <Provider store={store}>
          <EpisodesGroup {...props} {...override} />
        </Provider>
      </TopLayout>
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
      size: 4,
      min: 1,
      max: 10,
      sort: 1,
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

  it.each([[15], [4]])('renders default with different group size=%s', (groupSize) => {
    const wrapper = render(getComponent({ size: groupSize }))
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it.each([[15], [4]])(
    'renders default with different group size=%s sorted from newer to older',
    (groupSize) => {
      const wrapper = render(getComponent({ size: groupSize, sort: -1 }))
      expect(wrapper.asFragment()).toMatchSnapshot()
    }
  )
})
