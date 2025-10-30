// ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState('Default');

  const themeGradients = {
    'Default': ['#ffffff', '#a375d1'],
    'Sunset': ['#ffffff', '#FF6B6B'],
    'Ocean': ['#ffffff', '#4ECDC4'],
    'Forest': ['#ffffff', '#70c299'],
    'Lavender': ['#ffffff', '#9966cc']
  };

  const themeOptions = [
    { name: 'Default', color: '#a375d1' },
    { name: 'Sunset', color: '#FF6B6B' },
    { name: 'Ocean', color: '#4ECDC4' },
    { name: 'Forest', color: '#70c299' },
    { name: 'Lavender', color: '#9966cc' }
  ];

  const changeTheme = (themeName) => {
    setSelectedTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{
      selectedTheme,
      changeTheme,
      themeGradients,
      themeOptions
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};