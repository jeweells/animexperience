import React from 'react'
import FullModal, { FullModalProps } from './index'
import { Provider } from 'react-redux'
import { RootState } from '~/redux/state'
import { DeepPartial } from 'redux'
import TopLayout from '../../../plugins/gatsby-plugin-top-layout/TopLayout'
import { TopView } from '~/src/types'
import { MockStoreEnhanced } from 'redux-mock-store'

describe('FullModal', () => {
    let initialState: DeepPartial<RootState>
    let props: FullModalProps
    let store: MockStoreEnhanced

    beforeEach(() => {
        props = {
            show: 'sample-id',
            view: TopView.SEARCH,
            contrast: false,
        }
        initialState = {
            topView: {
                views: [TopView.SEARCH],
            },
        }
    })

    const getComponent = (override: Partial<FullModalProps> = {}) => {
        store = mockStore(initialState)
        return (
            <TopLayout>
                <Provider store={store}>
                    <FullModal {...props} {...override} />
                </Provider>
            </TopLayout>
        )
    }

    it('renders default', async () => {
        const wrapper = render(getComponent())
        expect(wrapper.baseElement).toMatchSnapshot()
    })

    it('renders default with contrast', async () => {
        const wrapper = render(getComponent({ contrast: true }))
        expect(wrapper.baseElement).toMatchSnapshot()
    })

    it('renders when another view is active', async () => {
        initialState.topView!.views = [TopView.PEEK]
        const wrapper = render(getComponent())
        expect(wrapper.baseElement).toMatchSnapshot()
    })

    it('renders when not showing', async () => {
        const wrapper = render(getComponent({ show: undefined }))
        expect(wrapper.baseElement).toMatchSnapshot()
    })

    it('showing pushes view when mounted', async () => {
        render(getComponent())
        expect(store.getActions()).toContainEqual(
            expect.objectContaining({
                payload: props.view,
                type: 'topView/push',
            }),
        )
    })

    it('not showing pops view when mounted', async () => {
        render(getComponent({ show: undefined }))
        expect(store.getActions()).toContainEqual(
            expect.objectContaining({
                payload: props.view,
                type: 'topView/pop',
            }),
        )
    })
})
