import React, { useState, useEffect, useCallback, JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @typedef {string} CSSVariable
 * A string representing a CSS custom property key (e.g., '--primary-color').
 */
type CSSVariable = `--${string}`;

/**
 * @typedef {Object.<CSSVariable, string>} ThemeVariables
 * An object mapping CSS custom property keys to their color or value strings.
 */
type ThemeVariables = {
  [key in CSSVariable]: string;
};

/**
 * @typedef {object} Theme
 * Defines the structure for a single theme, including its display name and CSS variables.
 * @property {string} displayName - The user-friendly name of the theme.
 * @property {ThemeVariables} variables - The CSS custom properties for the theme.
 */
interface Theme {
  displayName: string;
  variables: ThemeVariables;
}

/**
 * @const {Record<string, Theme>} THEMES
 * A constant object holding the definitions for all available themes.
 * The keys are used internally to identify the theme (e.g., 'cyberpunk').
 * These themes define global CSS variables that the entire application can consume.
 * For example, a global stylesheet might have `body { background-color: var(--background-primary); }`.
 */
const THEMES: Record<string, Theme> = {
  cyberpunk: {
    displayName: 'Cyberpunk',
    variables: {
      '--background-primary': '#0a0a0a',
      '--background-secondary': '#1a1a1a',
      '--text-primary': '#e0e0e0',
      '--text-secondary': '#a0a0a0',
      '--accent-primary': '#ff00ff', // Magenta
      '--accent-secondary': '#00ffff', // Cyan
      '--border-color': '#444444',
      '--font-family': "'Orbitron', sans-serif",
    },
  },
  minimalist: {
    displayName: 'Minimalist',
    variables: {
      '--background-primary': '#ffffff',
      '--background-secondary': '#f5f5f5',
      '--text-primary': '#212121',
      '--text-secondary': '#757575',
      '--accent-primary': '#333333',
      '--accent-secondary': '#555555',
      '--border-color': '#e0e0e0',
      '--font-family': "'Inter', sans-serif",
    },
  },
  'retro-futuristic': {
    displayName: 'Retro-Futuristic',
    variables: {
      '--background-primary': '#2a2a2d',
      '--background-secondary': '#3c3c40',
      '--text-primary': '#f4e8d1', // Creamy text
      '--text-secondary': '#b8a692',
      '--accent-primary': '#ff6f61', // Coral/Orange
      '--accent-secondary': '#00a896', // Teal
      '--border-color': '#5a5a60',
      '--font-family': "'Space Mono', monospace",
    },
  },
  'nature-inspired': {
    displayName: 'Nature-Inspired',
    variables: {
      '--background-primary': '#f4f1e9', // Light sand
      '--background-secondary': '#e9e4d8',
      '--text-primary': '#3d402d', // Dark olive
      '--text-secondary': '#6e735d',
      '--accent-primary': '#4a7c59', // Forest green
      '--accent-secondary': '#87a96b', // Asparagus
      '--border-color': '#d1cbbd',
      '--font-family': "'Merriweather', serif",
    },
  },
};

/**
 * @typedef {keyof typeof THEMES} ThemeKey
 * Represents the valid keys for the THEMES object.
 */
type ThemeKey = keyof typeof THEMES;

/**
 * Framer Motion variants for the main container.
 * This orchestrates a staggered animation for its children (the buttons).
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Time delay between each child animating in
      delayChildren: 0.2, // Initial delay before the first child starts
    },
  },
};

/**
 * Framer Motion variants for each theme button.
 * Defines how each button animates in, and its behavior on hover and tap.
 */
const buttonVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14,
    },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

/**
 * A self-contained component for switching the global theme of the application.
 * It manages its own state, persists the user's choice to localStorage,
 * and dynamically applies CSS custom properties to the document's root element.
 * This component does not require any props.
 * @returns {JSX.Element} The rendered theme switcher component.
 */
const ThemeSwitcher = (): JSX.Element => {
  /**
   * State management for the active theme.
   * It lazily initializes the state from localStorage to persist the theme choice across sessions.
   * If no theme is found in localStorage, it defaults to 'cyberpunk'.
   */
  const [activeTheme, setActiveTheme] = useState<ThemeKey>(() => {
    try {
      const savedTheme = localStorage.getItem('portfolio-theme');
      // Ensure the saved theme is a valid, known theme before using it.
      if (savedTheme && Object.keys(THEMES).includes(savedTheme)) {
        return savedTheme as ThemeKey;
      }
    } catch (error) {
      console.error('Failed to access localStorage for theme:', error);
    }
    return 'cyberpunk'; // Default theme
  });

  /**
   * Effect hook to apply theme changes globally.
   * This effect runs whenever the `activeTheme` state changes. It updates the
   * CSS custom properties on the `document.documentElement` (`:root`) and
   * saves the new theme key to localStorage.
   */
  useEffect(() => {
    const theme = THEMES[activeTheme];
    if (theme) {
      const root = document.documentElement;
      // Apply all variables from the selected theme to the root element.
      Object.entries(theme.variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Persist the theme choice.
      try {
        localStorage.setItem('portfolio-theme', activeTheme);
      } catch (error) {
        console.error('Failed to save theme to localStorage:', error);
      }
    }
  }, [activeTheme]);

  /**
   * Memoized callback function to handle theme selection.
   * Using `useCallback` prevents this function from being recreated on every render,
   * which is a minor optimization for the button's `onClick` prop.
   * @param {ThemeKey} themeKey - The key of the theme to activate.
   */
  const handleThemeChange = useCallback((themeKey: ThemeKey) => {
    setActiveTheme(themeKey);
  }, []);

  return (
    <motion.div
      className="flex flex-wrap gap-3 rounded-lg border p-4 transition-colors duration-300 ease-in-out bg-[var(--background-secondary)] border-[var(--border-color)]"
      role="radiogroup"
      aria-label="Theme selection"
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      {(Object.keys(THEMES) as ThemeKey[]).map((themeKey) => {
        const isSelected = activeTheme === themeKey;
        return (
          <motion.button
            key={themeKey}
            role="radio"
            onClick={() => handleThemeChange(themeKey)}
            className={`
              cursor-pointer rounded-md border-2 py-2 px-4 text-sm font-semibold
              outline-none transition-all duration-300 ease-in-out
              font-[var(--font-family)]
              ${
                isSelected
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--background-primary)]'
                  : 'border-[var(--border-color)] bg-transparent text-[var(--text-secondary)]'
              }
            `}
            aria-checked={isSelected}
            aria-label={`Switch to ${THEMES[themeKey].displayName} theme`}
            variants={buttonVariants as Variants}
            whileHover="hover"
            whileTap="tap"
          >
            {THEMES[themeKey].displayName}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default ThemeSwitcher;