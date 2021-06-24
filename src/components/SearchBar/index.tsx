import React from 'react'
import { InputGroup, Input, Icon } from 'rsuite'
import styled from 'styled-components'

export type SearchBarProps = {}

const Wrapper = styled.div`
    width: 250px;
    -webkit-app-region: no-drag;
    -webkit-user-select: all;
`

export const SearchBar: React.FC<SearchBarProps> = React.memo(({}) => {
    return (
        <Wrapper>
            <InputGroup>
                <Input style={{ fontWeight: 200 }} spellCheck={false} />
                <InputGroup.Button>
                    <Icon icon='search' />
                </InputGroup.Button>
            </InputGroup>
        </Wrapper>
    )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar
