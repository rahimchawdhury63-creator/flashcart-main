// ============================================================
// FlashCart — Theme Context Provider
// Manages theme state (currently light mode only).
// Structured for future dark mode addition.
// Developer: Rizwan Rahim Chowdhury
// ============================================================

import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
} from 'react';

const ThemeContext = createContext(null);

/**
 * ThemeProvider
 * Provides theme state. Currently light mode only.
 * Dark mode can be added later by uncommenting the toggle.
 */
export const ThemeProvider = ({ children }) => {

  // Theme state — 'light' only for now
  const [theme] = useState('light');

  // Apply theme class to document root
  useEffect(() => {
    // Add theme class to html element
    document.documentElement.setAttribute('data-theme', theme);

    // Set background color for the theme
    document.documentElement.style.colorScheme = theme;

  }, [theme]);

  const contextValue = useMemo(() => ({
    theme,
    isLight: theme === 'light',
    isDark: theme === 'dark',
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
export default ThemeProvider;
