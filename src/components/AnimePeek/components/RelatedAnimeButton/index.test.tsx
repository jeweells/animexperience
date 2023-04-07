import { Provider } from 'react-redux'
import RelatedAnimeButton, { RelatedAnimeButtonProps, types } from './index'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import React from 'react'
import { MockStoreEnhanced } from 'redux-mock-store'
import TopLayout from '../../../../../plugins/gatsby-plugin-top-layout/TopLayout'
import { RelatedAnime } from '~/globals/types'
import { RELATED_ANIME_BUTTON } from '@selectors'

describe('RelatedAnimeButton', () => {
    let initialState: DeepPartial<RootState>
    let props: RelatedAnimeButtonProps
    let store: MockStoreEnhanced

    const getComponent = (override: Partial<RelatedAnimeButtonProps> = {}) => {
        store = mockStore(initialState)
        return (
            <TopLayout>
                <Provider store={store}>
                    <RelatedAnimeButton {...props} {...override} />
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
                        duration: 600,
                    },
                },
            },
        }

        props = {
            related: {
                name: 'Related Anime Name',
                link: 'here goes related anime link',
                type: 'Ova',
            },
        }
    })

    it.each(types.map((type) => [type]))('renders default type=%s', (type) => {
        const wrapper = render(
            getComponent({
                related: { ...props.related, type: type as RelatedAnime['type'] },
            }),
        )
        expect(wrapper.asFragment()).toMatchSnapshot()
    })

    it('clicks the button', () => {
        const wrapper = render(getComponent())
        fireEvent.click(wrapper.getByTestId(RELATED_ANIME_BUTTON.BUTTON))
        expect(store.getActions()).toContainEqual(
            expect.objectContaining({
                meta: expect.objectContaining({
                    arg: props.related.name,
                }),
                type: 'peek/peek/pending',
            }),
        )
    })
})
