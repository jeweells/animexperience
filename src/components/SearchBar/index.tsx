import { InputBase } from '@mui/material'
import React, { FormEvent } from 'react'
import styled from 'styled-components'
import { animeSearch } from '@reducers'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Tooltip from '@mui/material/Tooltip'
import { useAppDispatch } from '~/redux/utils'

const SInput = styled(InputBase)`
    margin-left: 0;
    input {
        transition: background-color 250ms ease-in-out;
        background-color: rgba(10, 10, 10, 1);
        padding-left: 12px;
        height: 100%;
        &:focus {
        }
    }
`

const Wrapper = styled.form`
    display: flex;
    flex-direction: row;
    width: 250px;
    -webkit-app-region: no-drag;
    -webkit-user-select: all;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid;
    transition: border 300ms ease-in-out;
`
export type SearchBarProps = {} & React.ComponentProps<typeof Wrapper>

export const SearchBar: React.FC<SearchBarProps> = React.memo(({ ...props }) => {
    const [search, setSearch] = React.useState('')
    const [focused, setFocused] = React.useState(false)
    const dispatch = useAppDispatch()
    const handleSearch = () => {
        dispatch(animeSearch.search(search))
        dispatch(animeSearch.setSearching(true))
    }
    return (
        <Wrapper
            {...props}
            style={{
                borderColor: `rgba(255, 255, 255, ${focused ? 0.4 : 0.1})`,
                ...props.style,
            }}
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                e.stopPropagation()
                handleSearch()
            }}
        >
            <SInput
                sx={{
                    ml: 1,
                    flex: 1,
                    fontWeight: 400,
                    fontSize: '0.85rem',
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                spellCheck={false}
                onChange={(e) => {
                    setSearch(e.target.value)
                }}
                value={search}
                placeholder={'¿Buscando un anime?'}
            />
            <Tooltip title={'Buscar anime'} arrow>
                <IconButton
                    type='submit'
                    sx={{ p: '10px', borderRadius: 0 }}
                    aria-label='search'
                >
                    <SearchIcon />
                </IconButton>
            </Tooltip>
        </Wrapper>
    )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar
