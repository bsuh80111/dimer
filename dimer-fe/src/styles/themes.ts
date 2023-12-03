import { TypographyOptions } from '@mui/material/styles/createTypography';
import { createTheme } from '@mui/material/styles';

/** Create theme objects for MUI Material Components */

const typography: TypographyOptions = {
  fontFamily: 'Helvetica,Arial,sans-serif'
};

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#954A00',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#755845',
      contrastText: '#ffffff'
    },
    background: {
      default: '#fffbff'
    },
    error: {
      main: '#ba1a1a',
      contrastText: '#ffffff'
    },
    text: {
      primary: '#201a17',
      secondary: '#52443b'
    }
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#fffbff',
          color: '#201a17'
        }
      }
    }
  },
  typography
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffb785',
      contrastText: '#502500'
    },
    secondary: {
      main: '#e4bfa8',
      contrastText: '#422b1b'
    },
    background: {
      default: '#201a17'
    },
    error: {
      main: '#ffb4ab',
      contrastText: '#690005'
    },
    text: {
      primary: '#ece0da',
      secondary: '#d7c3b7'
    }
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#201a17',
          color: '#ece0da'
        }
      }
    }
  },
  typography
});

export { lightTheme, darkTheme };
