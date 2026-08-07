import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const THEME_LIGHT = {
  bg: '#F8FAFC',
  cardBg: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  accent: '#10B981',
  danger: '#EF4444',
};

export const THEME_DARK = {
  bg: '#0F172A',
  cardBg: '#1E293B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  accent: '#10B981',
  danger: '#EF4444',
};

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof THEME_LIGHT;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colors: THEME_LIGHT,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === 'dark');

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const colors = isDark ? THEME_DARK : THEME_LIGHT;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
