import React from 'react'
import { Button, ButtonGroup, Icon } from 'rsuite'
import styled from 'styled-components'
import { VideoOption } from '../../../VideoPlayer'

export type OptionButtonProps = {
    onClick?(): void
    option?: VideoOption
    disabled?: boolean
}

const StarButton = styled(Button)`
    background: hsl(216deg 13% 28%);
`

const ActionButton = styled(Button)`
    background: #343a43;
    &:disabled {
        background: #343a43;
    }
`

export const OptionButton: React.FC<OptionButtonProps> = React.memo(
    ({ onClick, option, disabled }) => {
        if (!option) return null
        return (
            <ButtonGroup>
                <StarButton>
                    <Icon icon={'star-o'} />
                </StarButton>
                <ActionButton disabled={disabled} onClick={onClick}>
                    {option.name}
                </ActionButton>
            </ButtonGroup>
        )
    },
)

OptionButton.displayName = 'OptionButton'

export default OptionButton
