import * as React from 'react'
import PropTypes from 'prop-types'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../src/theme'
import { PropsWithChildren } from 'react'

export default function TopLayout(props: PropsWithChildren<{}>) {
    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {props.children}
            </ThemeProvider>
        </React.Fragment>
    )
}

TopLayout.propTypes = {
    children: PropTypes.node,
}
