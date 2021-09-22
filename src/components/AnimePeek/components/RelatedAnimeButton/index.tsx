import { lighten, Typography } from '@mui/material'
import ButtonBase from '@mui/material/ButtonBase'
import React from 'react'
import styled from 'styled-components'
import { RelatedAnime } from '../../../../../globals/types'
import { peek } from '../../../../../redux/reducers/peek'
import { useAppDispatch } from '../../../../../redux/store'
import { FRow } from '../../../../atoms/Layout'

export type RelatedAnimeButtonProps = {
    related: RelatedAnime
}

const types = Object.keys({
    Ova: null,
    Película: null,
    Especial: null,
    Serie: null,
} as Record<RelatedAnime['type'], any>)

const TypeButton = styled(FRow)`
    padding: 0 12px;
    font-size: 0.85rem;
    align-items: center;
    flex: 0;
    justify-content: center;
    min-width: ${Math.max(...types.map((x) => x.length)) + 1}ch;
`

const getTypeBgColor = (btype: RelatedAnime['type']) =>
    ({
        Ova: '#612f2f',
        Película: 'rgb(55 92 95)',
        Especial: 'rgb(160 99 70)',
        Serie: '#427cb3',
    }[btype])

const NBWrapper = styled(FRow)`
    align-items: center;
    flex: 1;
    overflow: hidden;
    padding: 0 12px;
`

const NameButton = styled(Typography)`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: left;
    font-size: 0.85rem;
`

const SGroup = styled(ButtonBase)<{
    btype: RelatedAnime['type']
}>`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    height: 36px;

    ${TypeButton} {
        transition: background-color 0.3s ease-in-out;
        background-color: ${({ btype }) => getTypeBgColor(btype)};
    }
    ${NBWrapper} {
        transition: background-color 0.3s ease-in-out;
        background-color: #292d33;
    }
    &:hover {
        ${TypeButton} {
            background-color: ${({ btype }) => lighten(getTypeBgColor(btype), 0.2)};
        }
        ${NBWrapper} {
            background-color: #3c3f43;
        }
    }
`

export const RelatedAnimeButton: React.FC<RelatedAnimeButtonProps> = React.memo(
    ({ related }) => {
        const dispatch = useAppDispatch()
        return (
            <SGroup
                title={related.name}
                btype={related.type}
                onClick={() => {
                    dispatch(peek.peek(related.name))
                }}
            >
                <TypeButton>{related.type}</TypeButton>
                <NBWrapper>
                    <NameButton>{related.name}</NameButton>
                </NBWrapper>
            </SGroup>
        )
    },
)

RelatedAnimeButton.displayName = 'RelatedAnimeButton'

export default RelatedAnimeButton
