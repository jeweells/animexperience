import styled from 'styled-components'

export const VSpace = styled.div<{ size: number }>`
    min-height: ${(props) => props.size}px;
    max-height: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    flex-shrink: 0;
`
