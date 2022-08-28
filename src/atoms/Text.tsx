import styled from 'styled-components'

export const CarouselTitle = styled.h2`
    font-weight: 700;
    color: #e7e7e7;
    font-size: 1.2rem;
    line-height: 1;
    text-shadow: 0 0 2px black, 0 0 6px black;
    margin-bottom: 4px;
`

export const AnimePeekTitle = styled(CarouselTitle)``

export const AnimePeekType = styled.h5`
    font-weight: 700;
    color: #bbbbbb;
    font-size: 0.7rem;
`

export const AnimeTitle = styled.h3`
    font-weight: 700;
    color: white;
    font-size: 1rem;
    line-height: 1;
    text-shadow: 0 0 2px black, 0 0 6px black;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
`

export const AnimeDescription = styled.h6`
    font-weight: 300;
    color: white;
    font-size: 0.9rem;
    text-shadow: 0 0 2px black, 0 0 4px black;
`
