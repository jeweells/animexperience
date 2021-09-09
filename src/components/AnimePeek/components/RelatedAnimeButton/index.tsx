import { ButtonGroup } from '@material-ui/core'
import { Button } from 'gatsby-theme-material-ui'
import React from 'react'
import styled from 'styled-components'
import { RelatedAnime } from '../../../../../globals/types'
import { peek } from '../../../../../redux/reducers/peek'
import { useAppDispatch } from '../../../../../redux/store'

export type RelatedAnimeButtonProps = {
    related: RelatedAnime
}

const SGroup = styled(ButtonGroup)`
    display: flex;
    width: 100%;
`

const TypeButton = styled(Button)<{
    btype: RelatedAnime['type']
}>`
    background-color: ${({ btype }) =>
        ((
            {
                Ova: '#612f2f',
                Película: 'rgb(55 92 95)',
                Especial: 'rgb(160 99 70)',
                Serie: '#427cb3',
            } as Record<RelatedAnime['type'], string>
        )[btype])};
    flex-shrink: 0;
`

const NameButton = styled(Button)`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex: 1;
    text-align: left;
`

export const RelatedAnimeButton: React.FC<RelatedAnimeButtonProps> = React.memo(
    ({ related }) => {
        const dispatch = useAppDispatch()
        return (
            <SGroup>
                <TypeButton btype={related.type}>{related.type}</TypeButton>
                <NameButton
                    onClick={() => {
                        dispatch(peek.peek(related.name))
                    }}
                >
                    {related.name}
                </NameButton>
            </SGroup>
        )
    },
)

RelatedAnimeButton.displayName = 'RelatedAnimeButton'

export default RelatedAnimeButton
