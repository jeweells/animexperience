import FollowedAnimeEpisodeEntry, { FollowedAnimeEpisodeEntryProps } from './index'
import { ANIME_ENTRY_SELECTORS, ANIME_EPISODE_ENTRY } from '@selectors'
import { Provider } from 'react-redux'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { FStatus } from '@shared/types'
import TopLayout from '../../../plugins/gatsby-plugin-top-layout/TopLayout'

const statusTypes: FStatus[] = ['idle', 'loading', 'succeeded', 'failed']

describe('FollowedAnimeEpisodeEntry', () => {
  const returnTestId = ANIME_EPISODE_ENTRY.ANIME_INFO
  let initialState: DeepPartial<RootState>
  let props: FollowedAnimeEpisodeEntryProps
  beforeEach(() => {
    props = {
      onClick: jest.fn(),
      onMouseOut: jest.fn(),
      onMouseOver: jest.fn(),
      followed: {
        nextEpisodeToWatch: 70,
        lastEpisodeWatched: 69,
        lastCheckAt: 999,
        nextCheckAt: 7000,
        lastSuccessAt: 999,
        name: 'Here goes the anime name',
        image: 'Here goes the anime image url',
        link: 'Here goes the anime link',
        status: 'succeeded'
      },
      index: 0
    }
    initialState = {
      watched: {
        episodes: {
          69: {
            currentTime: 59,
            at: 101,
            duration: 600
          }
        }
      },
      followedAnimes: {
        followedDict: {
          [props.followed.name]: {
            name: props.followed.name,
            image: props.followed.image,
            link: 'Here goes anime link',
            lastCheckAt: 1,
            lastEpisodeWatched: 2,
            lastSuccessAt: 3,
            nextCheckAt: 4,
            nextEpisodeToWatch: 5
          }
        }
      }
    }
  })

  const getComponent = (override: Partial<FollowedAnimeEpisodeEntryProps> = {}) => {
    return (
      <TopLayout>
        <Provider store={mockStore(initialState)}>
          <FollowedAnimeEpisodeEntry {...props} {...override} />
        </Provider>
      </TopLayout>
    )
  }

  it.each(statusTypes.map((status) => [status]))('renders default when %s', async (status) => {
    const wrapper = render(getComponent())
    if (status === 'succeeded') {
      await waitFor(() => expect(wrapper.getByTestId(returnTestId)).toBeInTheDocument())
      // Since most tests depends on this component, make sure it's there
      expect(wrapper.getByTestId(ANIME_ENTRY_SELECTORS.WRAPPER)).toBeInTheDocument()
    }

    expect(wrapper.baseElement).toMatchSnapshot()
  })
})
