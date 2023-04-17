import NavigationButton, { NavigationButtonProps } from './index'
import React from 'react'
import TopLayout from '../../../../../plugins/gatsby-plugin-top-layout/TopLayout'
import { NAVIGATION_BUTTON } from '@selectors'

describe.each([['right'], ['left']])('NavigationButton (%s)', (direction) => {
    let props: NavigationButtonProps
    const onClick = jest.fn()

    const getComponent = (override: Partial<NavigationButtonProps> = {}) => {
        return (
            <TopLayout>
                <NavigationButton {...props} {...override} />
            </TopLayout>
        )
    }

    beforeEach(() => {
        props = {
            direction: direction as NavigationButtonProps['direction'],
            onClick,
        }
        onClick.mockReset()
    })

    it('renders default', () => {
        const wrapper = render(getComponent())
        fireEvent.click(wrapper.getByTestId(NAVIGATION_BUTTON.BUTTON))
        expect(onClick).toHaveBeenCalledTimes(1)
        expect(wrapper.baseElement).toMatchSnapshot()
    })

    it('renders default when disabled', () => {
        const wrapper = render(getComponent({ disabled: true }))
        fireEvent.click(wrapper.getByTestId(NAVIGATION_BUTTON.BUTTON))
        expect(onClick).toHaveBeenCalledTimes(0)
        expect(wrapper.baseElement).toMatchSnapshot()
    })
})
