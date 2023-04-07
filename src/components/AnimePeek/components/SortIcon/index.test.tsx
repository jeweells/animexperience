import Info, { InfoProps } from './index'
import React from 'react'
import TopLayout from '../../../../../plugins/gatsby-plugin-top-layout/TopLayout'

describe('Info', () => {
    let props: InfoProps

    const getComponent = (override: Partial<InfoProps> = {}) => {
        return (
            <TopLayout>
                <Info {...props} {...override} />
            </TopLayout>
        )
    }

    beforeEach(() => {
        props = {
            title: 'Sample title',
            icon: <div>Sample icon inside div</div>,
            children: <div>Sample children inside div</div>,
        }
    })

    it('renders default', async () => {
        const wrapper = render(getComponent())
        expect(wrapper.asFragment()).toMatchSnapshot()
    })
})
