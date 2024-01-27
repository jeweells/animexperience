import { AnimeDetailsEntry, AnimeDetailsEntryProps } from './index'
import { ANIME_DETAILS_ENTRY, ANIME_ENTRY_SELECTORS } from '@selectors'

describe('AnimeDetailsEntry', () => {
  const returnTestId = ANIME_DETAILS_ENTRY.ANIME_INFO
  const props = {
    onClick: jest.fn(),
    onMouseOut: jest.fn(),
    onMouseOver: jest.fn(),
    anime: {
      name: 'Here goes the anime name',
      image: 'Here goes the anime image url'
    },
    isPopover: false,
    index: 0,
    visible: false,
    sliding: false
  }
  beforeEach(() => {
    props.onClick.mockClear()
    props.onMouseOut.mockClear()
    props.onMouseOver.mockClear()
  })

  const getComponent = (override: Partial<AnimeDetailsEntryProps> = {}) => (
    <AnimeDetailsEntry {...props} {...override} />
  )

  it('renders default', async () => {
    const wrapper = render(getComponent())
    await waitFor(() => expect(wrapper.getByTestId(returnTestId)).toBeInTheDocument())
    // Since most tests depends on this component, make sure it's there
    expect(wrapper.getByTestId(ANIME_ENTRY_SELECTORS.WRAPPER)).toBeInTheDocument()
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('renders without anime', async () => {
    const wrapper = render(getComponent({ anime: null }))
    expect(wrapper.asFragment()).toMatchSnapshot()
  })

  it('should pass anime on click', async () => {
    const wrapper = render(getComponent())
    await waitFor(() => expect(wrapper.getByTestId(returnTestId)).toBeInTheDocument())
    fireEvent.click(wrapper.getByTestId(ANIME_ENTRY_SELECTORS.HOVERABLE_AREA))
    expect(props.onClick).toHaveBeenCalledWith(props.anime)
  })
})
