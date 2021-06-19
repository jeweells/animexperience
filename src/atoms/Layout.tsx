import styled from 'styled-components'

export const FRow = styled.div`
    display: flex;
    flex-direction: row;
`
export const FRowG8 = styled(FRow)`
    gap: 8px;
`
export const FRowG16 = styled(FRow)`
    gap: 16px;
`
export const FRowG32 = styled(FRow)`
    gap: 32px;
`

export const FCol = styled.div`
    display: flex;
    flex-direction: column;
`
export const FColG16 = styled(FCol)`
    gap: 16px;
`

export const FColG8 = styled(FCol)`
    gap: 8px;
`

export const FColG32 = styled(FCol)`
    gap: 32px;
`
