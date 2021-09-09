import { GlobalStyle } from './src/styles/GlobalStyle'
import React from 'react'

export const wrapRootElement = ({ element }) => {
    return (
        <React.Fragment>
            <GlobalStyle />
            {element}
        </React.Fragment>
    )
}
