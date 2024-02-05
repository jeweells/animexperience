import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 500,
      md: 800,
      lg: 1000,
      xl: 1200
    }
  },
  typography: {
    fontFamily: ['OpenSans', 'Quicksand', 'sans-serif'].join(',')
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#292d33',
      contrastText: '#e9ebf0'
    },
    secondary: {
      main: '#3c3f43'
    },
    text: {
      primary: '#e9ebf0',
      secondary: '#e9ebf0',
      disabled: '#ffffff82'
    }
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 'inherit'
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          borderRadius: undefined,
          textTransform: 'unset'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
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
          textTransform: 'unset',
          borderRadius: 6,
          height: 36,
          '&:hover': {
            outline: 'none',
            border: 'none',
            backgroundColor: '#3c3f43'
          }
        },
        text: {
          color: '#e9ebf0',
          textTransform: 'none',
          padding: '8px 12px'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          flexShrink: 0,
          height: 36,
          minWidth: 36,
          color: '#e9ebf0',
          padding: '8px 6px',
          backgroundColor: '#292d33',
          marginBottom: 0,
          fontWeight: 'normal',
          textAlign: 'center',
          verticalAlign: 'middle',
          outline: '0 !important',
          whiteSpace: 'nowrap',
          border: 'none',
          userSelect: 'none',
          fontSize: '1.2rem',
          lineHeight: '1.42857143',
          borderRadius: 6,
          '&:hover': {
            backgroundColor: '#3c3f43'
          },
          '&.Mui-disabled': {
            color: 'rgb(255 255 255 / 25%)'
          }
        },
        sizeLarge: {
          fontSize: '2rem'
        }
      }
    },
    MuiSkeleton: {
      defaultProps: {
        animation: 'pulse'
      },
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.11)'
        },
        pulse: {
          animationDuration: '1.5s 0.5s'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: `
                * {
                    backface-visibility: hidden;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                html {
                    -webkit-font-smoothing: auto;
                }
                h6 {
                    margin: 0;
                }
                body {
                    background-color: #0F131A;
                }
                ::-webkit-scrollbar {
                    width: 10px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: #25282e;
                },
                ::-webkit-scrollbar-thumb:hover {
                    background: #393a44;
                }
            `
    }
  }
})

export default theme
