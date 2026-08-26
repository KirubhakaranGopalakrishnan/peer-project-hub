import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'theme'; // 'light' | 'dark' | 'system'

const getSystemPref = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyTheme = (resolved) => {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem(STORAGE_KEY) || 'system');
  const [resolved, setResolved] = useState(() => (mode === 'system' ? getSystemPref() : mode));

  // Apply whenever mode changes, and recompute the resolved theme.
  useEffect(() => {
    const next = mode === 'system' ? getSystemPref() : mode;
    setResolved(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  // If following system, react live to OS theme changes without a reload.
  useEffect(() => {
    if (mode !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const next = getSystemPref();
      setResolved(next);
      applyTheme(next);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
