import React from 'react'
import { Icon } from 'rsuite'
import { IconProps } from 'rsuite/lib/Icon/Icon'
import styled from 'styled-components'
import { FColG8, FRowG8 } from '../../../../atoms/Layout'

export type InfoProps = {
    icon: IconProps['icon']
    title: string
    value: React.ReactNode
}
const Title = styled(FRowG8)`
    gap: 8px;
    align-items: center;
    font-weight: bold;
`
const Value = styled.div`
    margin-left: 20px;
    color: rgba(233, 235, 240, 0.8);
`
export const Info: React.FC<InfoProps> = React.memo(({ title, value, icon }) => {
    return (
        <FColG8>
            <Title as={'h5'}>
                <Icon icon={icon} />
                {title}
            </Title>
            <Value>{value}</Value>
        </FColG8>
    )
})

Info.displayName = 'Info'

export default Info
