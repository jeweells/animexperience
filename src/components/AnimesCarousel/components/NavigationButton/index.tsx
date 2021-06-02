import React from 'react'
import { Button, Icon } from 'rsuite'
import styled from 'styled-components'
import { useSizes } from '../../hooks'

const NavContainer = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 10;
`

export type NavigationButtonProps = {
    direction: 'right' | 'left'
    onClick?(): void
    disabled?: boolean
}

const SButton = styled(Button)<Pick<NavigationButtonProps, 'direction'>>`
    height: 100%;
    background-color: transparent !important;
    opacity: ${(props) => (props.disabled ? 0 : 0.7)} !important;
    background-image: linear-gradient(
        to ${(props) => props.direction},
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.3) 50%,
        rgba(0, 0, 0, 0.4)
    );
    transition: all 300ms ease-in-out;
    padding: 0 24px;
    &:hover {
        opacity: ${(props) => (props.disabled ? 0 : 1)} !important;
        background-image: linear-gradient(
            to ${(props) => props.direction},
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.8)
        );
    }
`

export const NavigationButton = React.memo(
    React.forwardRef<HTMLDivElement, NavigationButtonProps>(({ direction, onClick, disabled }, ref) => {
        const { navigationWidth } = useSizes()

        return (
            <NavContainer ref={ref} style={{ [direction]: 0, width: navigationWidth }}>
                <SButton direction={direction} disabled={disabled} onClick={onClick}>
                    <Icon icon={`angle-${direction}` as any} size={'5x'} />
                </SButton>
            </NavContainer>
        )
    }),
)

NavigationButton.displayName = 'NavigationButton'

export default NavigationButton
