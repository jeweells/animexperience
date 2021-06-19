import React from 'react'
import { Icon } from 'rsuite'
import { IconProps } from 'rsuite/lib/Icon/Icon'
import styled from 'styled-components'
import { FColG16, FRowG8 } from '../../../../atoms/Layout'

export type InfoProps = {
    icon: IconProps['icon']
    title: string
}
const Title = styled(FRowG8)`
    gap: 8px;
    align-items: center;
    font-weight: 500;
`
const Value = styled.div`
    color: rgba(233, 235, 240, 0.8);
`
export const Info: React.FC<InfoProps> = React.memo(({ title, icon, children }) => {
    return (
        <FColG16>
            <Title as={'h5'}>
                <Icon icon={icon} />
                {title}
            </Title>
            <Value>{children}</Value>
        </FColG16>
    )
})

Info.displayName = 'Info'

export default Info
