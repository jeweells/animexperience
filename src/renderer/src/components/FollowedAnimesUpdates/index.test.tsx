import FollowedAnimesUpdates, { FollowedAnimesUpdatesProps } from './index'
import { ANIME_ENTRY_SELECTORS, ANIME_EPISODE_ENTRY } from '@selectors'
import { Provider } from 'react-redux'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import TopLayout from '../../../plugins/gatsby-plugin-top-layout/TopLayout'
import { range } from '~/src/utils'
import useResizeObserver from 'use-resize-observer'
import { FollowedAnime } from '@shared/types'
import { FollowedAnimeWStatus } from '~/redux/reducers/followedAnimes'

describe('FollowedAnimesUpdates', () => {
  const returnTestId = ANIME_EPISODE_ENTRY.ANIME_INFO
  let initialState: DeepPartial<RootState>
  let props: FollowedAnimesUpdatesProps
  const useResizeObserverMock = useResizeObserver as jest.Mock

  beforeEach(() => {
    props = {}
    const followed: DeepPartial<FollowedAnimeWStatus>[] = range(3).map((n) => ({
      name: 'Here goes the anime name ' + n,
      image: 'Here goes the anime image url ' + n,
      link: 'Here goes anime link ' + n,
      lastCheckAt: 1,
      lastEpisodeWatched: 2,
      lastSuccessAt: 3,
      nextCheckAt: 4,
      nextEpisodeToWatch: 5,
      status: 'succeeded'
    }))
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
        status: {
          followed: 'succeeded'
        },
        followed,
        followedDict: (followed as FollowedAnime[]).reduce(
          (acc, curr) => {
            acc[curr.name] = curr
            return acc
          },
          {} as Record<string, FollowedAnime>
        )
      }
    }
    useResizeObserverMock.mockReturnValue({ ref: jest.fn(), width: 100, height: 100 })
  })

  const getComponent = (override: Partial<FollowedAnimesUpdatesProps> = {}) => {
    return (
      <TopLayout>
        <Provider store={mockStore(initialState)}>
          <FollowedAnimesUpdates {...props} {...override} />
        </Provider>
      </TopLayout>
    )
  }

  it('renders default', async () => {
    const wrapper = render(getComponent())
    await waitFor(() =>
      wrapper.getAllByTestId(returnTestId).forEach((elm) => expect(elm).toBeInTheDocument())
    )
    // Since most tests depends on this component, make sure it's there
    wrapper
      .getAllByTestId(ANIME_ENTRY_SELECTORS.WRAPPER)
      .forEach((elm) => expect(elm).toBeInTheDocument())

    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('renders when some animes are loading', async () => {
    initialState.followedAnimes!.followed![1]!.status = 'loading'
    const wrapper = render(getComponent())
    await waitFor(() =>
      wrapper.getAllByTestId(returnTestId).forEach((elm) => expect(elm).toBeInTheDocument())
    )
    // Since most tests depends on this component, make sure it's there
    wrapper
      .getAllByTestId(ANIME_ENTRY_SELECTORS.WRAPPER)
      .forEach((elm) => expect(elm).toBeInTheDocument())

    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('renders when all animes are loading', async () => {
    initialState.followedAnimes!.followed!.forEach((anime) => (anime!.status = 'loading'))
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('renders when loading', async () => {
    initialState.followedAnimes!.status!.followed = 'loading'
    const wrapper = render(getComponent())
    await waitFor(() =>
      wrapper.getAllByTestId(returnTestId).forEach((elm) => expect(elm).toBeInTheDocument())
    )
    // Since most tests depends on this component, make sure it's there
    wrapper
      .getAllByTestId(ANIME_ENTRY_SELECTORS.WRAPPER)
      .forEach((elm) => expect(elm).toBeInTheDocument())

    expect(wrapper.baseElement).toMatchSnapshot()
  })
})
