import React from 'react'
import styled from 'styled-components'
import { VideoOption } from '../../../VideoPlayer'
import { usePlayerOption } from './hooks'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'

export type OptionButtonProps = {
    onClick?(): void
    option?: VideoOption
    disabled?: boolean
}

const StarButton = styled(Button)`
    min-width: 0;
    flex-shrink: 0;
    background: hsl(216deg 13% 28%);
    padding: 5px 12px;
    border: none;
`

const ActionButton = styled(Button)`
    border: none;
    background: #343a43;
    flex: 1;
    &:disabled {
        background: #343a43;
    }
    &.Mui-disabled {
        color: #ffffff91;
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
                    {optionInfo?.prefer ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
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
