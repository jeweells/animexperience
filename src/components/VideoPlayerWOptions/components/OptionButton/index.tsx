import React from 'react'
import { Button, ButtonGroup, Icon } from 'rsuite'
import styled from 'styled-components'
import { VideoOption } from '../../../VideoPlayer'
import { usePlayerOption } from './hooks'

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
    ({ option, disabled, onClick }) => {
        const { prefer, option: optionInfo, use } = usePlayerOption(option?.name)
        if (!option) return null
        return (
            <ButtonGroup>
                <StarButton
                    onClick={() => {
                        console.debug('CLICKING PREFER', optionInfo)
                        prefer(!optionInfo?.prefer)
                    }}
                >
                    <Icon icon={optionInfo?.prefer ? 'star' : 'star-o'} />
                </StarButton>
                <ActionButton
                    disabled={disabled}
                    onClick={() => {
                        use()
                        onClick?.()
                    }}
                >
                    {option.name}
                </ActionButton>
            </ButtonGroup>
        )
    },
)

OptionButton.displayName = 'OptionButton'

export default OptionButton
