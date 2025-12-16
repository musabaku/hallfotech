import React, { createContext, useContext, useState, ReactNode } from 'react';

// Theme colors - Lilac theme with light and dark variants
export const themes = {
  light: {
    // Gradients
    backgroundGradient: ['#E9D5FF', '#FAE8FF', '#FCE7F3'] as [string, string, string],
    cardGradient: ['#9333EA', '#DB2777'] as [string, string],
    streakGradient: ['#F59E0B', '#EF4444'] as [string, string],
    successGradient: ['#22C55E', '#10B981'] as [string, string],
    
    // Backgrounds
    background: '#FAE8FF',
    card: 'rgba(255, 255, 255, 0.9)',
    cardSolid: '#FFFFFF',
    inputBackground: 'rgba(255, 255, 255, 0.9)',
    
    // Text
    textPrimary: '#581C87',
    textSecondary: '#7C3AED',
    textMuted: '#9CA3AF',
    textOnPrimary: '#FFFFFF',
    
    // Accents
    primary: '#9333EA',
    primaryLight: '#A78BFA',
    secondary: '#DB2777',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    
    // Borders
    border: 'rgba(147, 51, 234, 0.2)',
    borderLight: 'rgba(147, 51, 234, 0.1)',
    
    // Special
    overlay: 'rgba(255, 255, 255, 0.9)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    // Gradients - darker lilac
    backgroundGradient: ['#1E1B2E', '#2D2640', '#362A4A'] as [string, string, string],
    cardGradient: ['#7C3AED', '#BE185D'] as [string, string],
    streakGradient: ['#D97706', '#DC2626'] as [string, string],
    successGradient: ['#16A34A', '#059669'] as [string, string],
    
    // Backgrounds
    background: '#1E1B2E',
    card: 'rgba(45, 38, 64, 0.95)',
    cardSolid: '#2D2640',
    inputBackground: 'rgba(55, 48, 74, 0.9)',
    
    // Text
    textPrimary: '#E9D5FF',
    textSecondary: '#C4B5FD',
    textMuted: '#8B8B9E',
    textOnPrimary: '#FFFFFF',
    
    // Accents
    primary: '#A855F7',
    primaryLight: '#C4B5FD',
    secondary: '#EC4899',
    success: '#22C55E',
    warning: '#FBBF24',
    error: '#F87171',
    
    // Borders
    border: 'rgba(168, 85, 247, 0.3)',
    borderLight: 'rgba(168, 85, 247, 0.15)',
    
    // Special
    overlay: 'rgba(30, 27, 46, 0.95)',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
};

export type Theme = typeof themes.light;
export type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  
  const theme = themes[themeMode];
  const isDark = themeMode === 'dark';
  
  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
