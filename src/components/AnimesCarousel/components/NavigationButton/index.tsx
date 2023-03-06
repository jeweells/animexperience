import React from 'react'
import styled from 'styled-components'
import { FCol } from '~/src/atoms/Layout'
import { useSizes } from '../../hooks'
import Button from '@mui/material/Button'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'

const NavContainer = styled(FCol)`
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

const DirectionIcon: Record<NavigationButtonProps['direction'], React.FC> = {
    left: KeyboardArrowLeftRoundedIcon,
    right: KeyboardArrowRightRoundedIcon,
}

const SButton = styled(Button)<Pick<NavigationButtonProps, 'direction'>>`
    height: 100%;
    border-radius: 0;
    background-color: transparent !important;
    opacity: ${(props) => (props.disabled ? 0 : 0.7)} !important;
    background-image: linear-gradient(
        to ${(props) => props.direction},
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.3) 50%,
        rgba(0, 0, 0, 0.4)
    );
    font-size: 3.5rem;
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
    React.forwardRef<HTMLDivElement, NavigationButtonProps>(
        ({ direction, onClick, disabled }, ref) => {
            const { navigationWidth } = useSizes()
            const Icon = DirectionIcon[direction]
            return (
                <NavContainer
                    ref={ref}
                    style={{ [direction]: 0, width: navigationWidth }}
                >
                    <SButton direction={direction} disabled={disabled} onClick={onClick}>
                        <Icon />
                    </SButton>
                </NavContainer>
            )
        },
    ),
)

NavigationButton.displayName = 'NavigationButton'

export default NavigationButton
