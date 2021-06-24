import React from 'react'
import { InputGroup, Input, Icon } from 'rsuite'
import styled from 'styled-components'
import { animeSearch } from '../../../redux/reducers/animeSearch'
import { useAppDispatch } from '../../../redux/store'

export type SearchBarProps = {}

const Wrapper = styled.div`
    width: 250px;
    -webkit-app-region: no-drag;
    -webkit-user-select: all;
`

export const SearchBar: React.FC<SearchBarProps> = React.memo(({}) => {
    const [search, setSearch] = React.useState('')
    const dispatch = useAppDispatch()
    const handleSearch = () => {
        dispatch(animeSearch.search(search))
        dispatch(animeSearch.setSearching(true))
    }
    return (
        <Wrapper
            as={'form'}
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSearch()
            }}
        >
            <InputGroup>
                <Input
                    onChange={(val) => {
                        setSearch(val)
                    }}
                    value={search}
                    placeholder={'Buscar anime...'}
                    style={{ fontWeight: 400 }}
                    spellCheck={false}
                />
                <InputGroup.Button onClick={handleSearch}>
                    <Icon icon='search' />
                </InputGroup.Button>
            </InputGroup>
        </Wrapper>
    )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar
