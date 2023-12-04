import { ReactNode, createContext, useEffect } from 'react';
import { ThemeProvider, useMediaQuery } from '@mui/material';
import { darkTheme, lightTheme } from 'src/styles/themes';

interface ThemeContextProviderProps {
  children: ReactNode;
}

/**
 * Currently provides no functionality other than an abstraction for the useMediaQuery.
 * Any future theming behaviors should be set here.
 * @note Delete context if no more theming is required.
 */
const ThemeContext = createContext({});

const ThemeContextProvider = ({
  children
}: ThemeContextProviderProps) => {

  /** Gets system display setting */
  const darkMode: boolean = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    document.documentElement.setAttribute('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{}}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContextProvider };
export type { ThemeContextProviderProps };
