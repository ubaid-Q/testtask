import { createTheme, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import '../styles/globals.css'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary:{
      main:"#ff0100"
    }
  },
});



function MyApp({ Component, pageProps }) {
  return <ThemeProvider theme={darkTheme}>
    <SnackbarProvider maxSnack={3}>
      <Component {...pageProps} />
    </SnackbarProvider>
  </ThemeProvider>
}

export default MyApp
