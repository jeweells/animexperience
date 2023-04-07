import SortIcon, { SortIconProps } from './index'
import React from 'react'
import TopLayout from '../../../../../plugins/gatsby-plugin-top-layout/TopLayout'

const orders: Array<SortIconProps['order']> = ['asc', 'desc']

describe('SortIcon', () => {
    let props: SortIconProps

    const getComponent = (override: Partial<SortIconProps> = {}) => {
        return (
            <TopLayout>
                <SortIcon {...props} {...override} />
            </TopLayout>
        )
    }

    beforeEach(() => {
        props = {
            order: 'asc',
            size: 30,
        }
    })

    it.each(orders.map((order) => [order]))(
        'renders default with order=%s',
        async (order) => {
            const wrapper = render(
                getComponent({ order: order as SortIconProps['order'] }),
            )
            expect(wrapper.asFragment()).toMatchSnapshot()
        },
    )
})
