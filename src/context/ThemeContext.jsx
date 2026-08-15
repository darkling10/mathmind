import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  'dark-default': {
    name: 'Midnight Neon',
    mode: 'dark',
    bg: '#030712',
    cardBg: 'rgba(15, 23, 42, 0.75)',
    text: '#f3f4f6',
    plotlyBg: 'rgba(10, 15, 28, 0.85)',
    plotlyGrid: 'rgba(255, 255, 255, 0.08)',
    plotlyText: '#94a3b8'
  },
  'light-clean': {
    name: 'Daybreak Light',
    mode: 'light',
    bg: '#f8fafc',
    cardBg: 'rgba(255, 255, 255, 0.85)',
    text: '#0f172a',
    plotlyBg: 'rgba(241, 245, 249, 0.9)',
    plotlyGrid: 'rgba(0, 0, 0, 0.1)',
    plotlyText: '#334155'
  },
  'dark-synthwave': {
    name: 'Cyberpunk Synthwave',
    mode: 'dark',
    bg: '#0f051d',
    cardBg: 'rgba(24, 10, 45, 0.8)',
    text: '#f5f3ff',
    plotlyBg: 'rgba(20, 8, 38, 0.9)',
    plotlyGrid: 'rgba(236, 72, 153, 0.15)',
    plotlyText: '#c084fc'
  },
  'dark-emerald': {
    name: 'Emerald Matrix',
    mode: 'dark',
    bg: '#021812',
    cardBg: 'rgba(6, 38, 30, 0.8)',
    text: '#ecfdf5',
    plotlyBg: 'rgba(4, 30, 24, 0.9)',
    plotlyGrid: 'rgba(16, 185, 129, 0.15)',
    plotlyText: '#6ee7b7'
  },
  'light-ocean': {
    name: 'Oceanic Breeze',
    mode: 'light',
    bg: '#f0f9ff',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    text: '#0c4a6e',
    plotlyBg: 'rgba(224, 242, 254, 0.85)',
    plotlyGrid: 'rgba(14, 165, 233, 0.15)',
    plotlyText: '#0369a1'
  }
};

const safeGetItem = (key, fallback) => {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
};
const safeSetItem = (key, value) => {
  try { localStorage.setItem(key, value); } catch {}
};

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return safeGetItem('mathmind_theme', 'dark-default');
  });

  const currentTheme = THEMES[themeId] || THEMES['dark-default'];

  useEffect(() => {
    safeSetItem('mathmind_theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    document.documentElement.setAttribute('data-mode', currentTheme.mode);
  }, [themeId, currentTheme]);

  const contextValue = useMemo(() => ({ themeId, setThemeId, currentTheme, THEMES }), [themeId, currentTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
