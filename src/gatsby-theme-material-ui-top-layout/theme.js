import { createTheme } from '@material-ui/core/styles'

export const mainColor = 'rgb(105, 190, 213)'

const theme = createTheme({
    typography: {
        fontFamily: ['Quicksand', 'sans-serif'].join(','),
    },
    palette: {
        primary: {
            main: '#292d33',
            contrastText: '#e9ebf0',
        },
        secondary: {
            main: '#3c3f43',
        },
        text: {
            primary: '#e9ebf0',
            secondary: '#e9ebf0',
            disabled: '#ffffff82',
        },
    },
    overrides: {
        MuiButtonBase: {
            root: {
                borderRadius: undefined,
            },
        },
        MuiButton: {
            root: {
                color: '#e9ebf0',
                backgroundColor: '#292d33',
                marginBottom: 0,
                fontWeight: 'normal',
                textAlign: 'center',
                verticalAlign: 'middle',
                outline: '0 !important',
                whiteSpace: 'nowrap',
                border: 'none',
                userSelect: 'none',
                fontSize: 14,
                lineHeight: '1.42857143',
                borderRadius: 6,
                height: 36,
                '&:hover': {
                    backgroundColor: '#3c3f43',
                },
            },

            text: {
                color: '#e9ebf0',
                textTransform: 'none',
                padding: '8px 12px',
            },
        },
        MuiIconButton: {
            root: {
                flexShrink: 0,
                height: 36,
                minWidth: 36,
                color: '#e9ebf0',
                padding: '8px 12px',
                backgroundColor: '#292d33',
                marginBottom: 0,
                fontWeight: 'normal',
                textAlign: 'center',
                verticalAlign: 'middle',
                outline: '0 !important',
                whiteSpace: 'nowrap',
                border: 'none',
                userSelect: 'none',
                fontSize: 14,
                lineHeight: '1.42857143',
                borderRadius: 6,
                '&:hover': {
                    backgroundColor: '#3c3f43',
                },
            },
        },
        MuiCssBaseline: {
            '@global': {
                html: {
                    WebkitFontSmoothing: 'auto',
                },
                body: {
                    color: undefined,
                    margin: undefined,
                    fontSize: undefined,
                    fontFamily: undefined,
                    fontWeight: undefined,
                    backgroundColor: undefined,
                    lineHeight: undefined,
                },
            },
        },
        MuiSkeleton: {
            root: {
                backgroundColor: 'rgba(255, 255, 255, 0.11)',
            },
            pulse: {
                animation: 'MuiSkeleton-keyframes-pulse 3s ease-in 0.5s infinite',
            },
        },
    },
})

export default theme
