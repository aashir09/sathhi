import React, { useState } from 'react';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import { themeCreator } from './base';
// import { StylesProvider } from '@mui/styles';

export const ThemeContext = React.createContext(
  (themeName?: string): void => {}
);


export default function ThemeProviderWrapper (props?: any) {
  const curThemeName = localStorage.getItem('appTheme') || 'PureLightTheme';
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    // <StylesProvider injectFirst>
    <StyledEngineProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </ThemeContext.Provider>
      </StyledEngineProvider>
    // </StylesProvider>
  );
};

