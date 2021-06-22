import React from 'react'
import { Button, ButtonGroup } from 'rsuite'
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
    type: RelatedAnime['type']
}>`
    background-color: ${({ type }) =>
        (({
            Ova: '#612f2f',
            Película: 'rgb(55 92 95)',
            Especial: 'rgb(160 99 70)',
            Serie: '#427cb3',
        } as Record<RelatedAnime['type'], string>)[type])};
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
                <TypeButton type={related.type}>{related.type}</TypeButton>
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
