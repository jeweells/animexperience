import { ThemeProvider } from '@mui/material/styles'
import ManageFollowButton, { ManageFollowButtonProps } from './index'
import { Provider } from 'react-redux'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import { MockStoreEnhanced } from 'redux-mock-store'
import { MANAGE_FOLLOW_BUTTON } from '@selectors'
import theme from '../../theme'

describe('ManageFollowButton', () => {
  let initialState: DeepPartial<RootState>
  let props: ManageFollowButtonProps
  let store: MockStoreEnhanced

  beforeEach(() => {
    props = {
      anime: {
        date: '01/01/2022',
        episode: 5,
        img: 'anime image link 1',
        link: 'anime link 1',
        name: 'anime name 1'
      }
    }
    initialState = {
      followedAnimes: {
        followedDict: {
          'anime name 1': {
            name: 'anime name 1',
            image: 'Here goes the anime image url',
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

  const getComponent = (override: Partial<ManageFollowButtonProps> = {}) => {
    store = mockStore(initialState)
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ManageFollowButton {...props} {...override} />
        </ThemeProvider>
      </Provider>
    )
  }

  it('renders default when followed', async () => {
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('renders default when not followed', async () => {
    // TODO this button is not designed to show a not followed version
    // but the idea is to show a notification to undo the change
    initialState.followedAnimes!.followedDict = {}
    const wrapper = render(getComponent())
    expect(wrapper.baseElement).toMatchSnapshot()
  })

  it('unfollows when clicked and followed', async () => {
    const wrapper = render(getComponent())
    fireEvent.click(wrapper.getByTestId(MANAGE_FOLLOW_BUTTON.BUTTON))
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        payload: { name: props.anime!.name },
        type: 'followedAnimes/unfollow'
      })
    )
  })
})
