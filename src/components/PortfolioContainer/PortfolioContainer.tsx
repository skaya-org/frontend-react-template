import React, { useState, useEffect, useCallback, JSX } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
  useOutlet,
} from 'react-router-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Import child components as per requirements
import Portfolio3DRoom from '../Portfolio3DRoom/Portfolio3DRoom';
import ProjectPuzzle from '../ProjectPuzzle/ProjectPuzzle';
import ArcadeGame from '../ArcadeGame/ArcadeGame';
import SkillFilter from '../SkillFilter/SkillFilter';
import SmartphoneSimulator from '../SmartphoneSimulator/SmartphoneSimulator';
import { Terminal } from '../Terminal/Terminal';

// --- Constants and Configuration ---

/**
 * @typedef RouteConfig
 * @property {string} path - The URL path for the route.
 * @property {React.ComponentType} component - The React component to render for the route.
 * @property {boolean} [isIndex] - Whether this is the default index route.
 */
type RouteConfig = {
  path: string;
  component: React.ComponentType;
  isIndex?: boolean;
};

/**
 * Defines the application's routes. This constant data approach ensures
 * that the main component does not require props for its routing configuration.
 * It's a clean and maintainable way to manage the portfolio's sections.
 * @const {RouteConfig[]}
 */


/**
 * The specific key sequence for the Konami code to reveal the Terminal Easter egg.
 * @const {string[]}
 */
const KONAMI_CODE_SEQUENCE: readonly string[] = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

// --- Animation Variants ---

/**
 * Variants for the page transitions. Creates a subtle slide and fade effect
 * as the user navigates between the main portfolio sections.
 */
const pageTransitionVariants: Variants = {
  initial: { opacity: 0, x: '-10vw', scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', duration: 0.7, bounce: 0.2 } },
  exit: { opacity: 0, x: '10vw', scale: 0.95, transition: { type: 'spring', duration: 0.4, bounce: 0 } },
};

/**
 * Variants for the Terminal overlay. Formalizes the existing slide-up animation.
 */
const terminalVariants: Variants = {
  initial: { y: '100vh', opacity: 0.8 },
  animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 20 } },
  exit: { y: '100vh', opacity: 0, transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 } },
};

/**
 * Variants for static UI elements like the ThemeSwitcher and SkillFilter,
 * allowing them to fade in gracefully on initial load.
 */
const uiElementVariants: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5, ease: 'easeOut' } },
};

/**
 * Variants for the ErrorFallback component, to make it appear less jarringly.
 */
const errorFallbackVariants: Variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

// --- Custom Hooks ---

/**
 * A custom hook to detect a specific sequence of key presses (e.g., the Konami code).
 * It's a clean, reusable way to handle keyboard-based Easter eggs.
 * @param {() => void} onUnlock - The callback function to execute when the code is successfully entered.
 */
const useKeySequence = (sequence: readonly string[], onUnlock: () => void): void => {
  const [keySequence, setKeySequence] = useState<string[]>([]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      setKeySequence((currentSequence) => {
        const newSequence = [...currentSequence, e.key].slice(-sequence.length);

        if (JSON.stringify(newSequence) === JSON.stringify(sequence)) {
          onUnlock();
          return []; // Reset after successful entry to allow re-triggering
        }
        return newSequence;
      });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [sequence, onUnlock]);
};

// --- Error Handling Components ---

/**
 * A fallback component to display when a critical error occurs in a child component.
 * It provides a way for the user to recover from the error gracefully, preventing a full app crash.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps): JSX.Element => (
  <motion.div
    role="alert"
    className="flex flex-col items-center justify-center h-screen p-8 bg-zinc-900 text-red-500 font-mono"
    variants={errorFallbackVariants as Variants}
    initial="initial"
    animate="animate"
  >
    <h2 className="text-3xl mb-4">
      An Error Occurred
    </h2>
    <p className="mb-6">A component has failed to render.</p>
    <pre
      className="bg-zinc-800 p-4 rounded-lg mb-8 max-w-[80%] overflow-x-auto border border-zinc-600"
    >
      {error.message}
    </pre>
    <button
      onClick={resetErrorBoundary}
      className="py-3 px-6 text-base cursor-pointer bg-red-500 text-zinc-900 rounded font-bold hover:bg-red-400 transition-colors"
    >
      Try Again
    </button>
  </motion.div>
);

// --- Layout Components ---

/**
 * MainLayout is a structural component that defines the persistent UI elements
 * like the ThemeSwitcher and SkillFilter, and provides a container for the routed content.
 * It now uses AnimatePresence to handle transitions between pages.
 * @returns {JSX.Element} The main application layout.
 */
const MainLayout = (): JSX.Element => {
    const location = useLocation();
    const outlet = useOutlet();

    return (
        <main className="">
            {/* AnimatePresence orchestrates the exit and enter animations of the routed pages. */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={location.pathname}
                  variants={pageTransitionVariants as Variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full h-full" // Ensure the animating div occupies the full space
                >
                  {outlet}
                </motion.div>
            </AnimatePresence>

            {/* The SkillFilter is positioned to be alongside or within the main view as an interactive overlay */}
            <motion.div
                className=" top-5 left-5 z-10"
                variants={uiElementVariants as Variants}
                initial="initial"
                animate="animate"
            >
                <SkillFilter />
            </motion.div>

            {/* The ThemeSwitcher is fixed to the corner for constant access */}
       
        </main>
    );
};


// --- Main Portfolio Container ---

/**
 * `PortfolioContainer` is the central orchestrator for the entire portfolio application.
 * It sets up routing, manages the visibility of high-level components and overlays,
 * and integrates features like an Easter egg and global theme switching.
 * This component is self-contained and does not accept any props, adhering to the
 * principle of using constant data for configuration. It serves as the root of the
 * interactive experience.
 *
 * @returns {JSX.Element} The fully rendered interactive portfolio application.
 */
const PortfolioContainer = (): JSX.Element => {
  const [isTerminalVisible, setIsTerminalVisible] = useState<boolean>(false);

  /**
   * Toggles the visibility of the Terminal component.
   * This function is memoized with useCallback to ensure it has a stable
   * identity for the useKeySequence hook, preventing unnecessary re-renders.
   */
  const toggleTerminal = useCallback((): void => {
    setIsTerminalVisible((prev) => !prev);
  }, []);

  // Activate the Konami code listener to trigger the terminal.
  useKeySequence(KONAMI_CODE_SEQUENCE, toggleTerminal);

  // Logs errors to the console. In a real-world scenario, this would
  // report to an external logging service.
  const logError = (error: Error, info: { componentStack: string }): void => {
    console.error("ErrorBoundary caught an error:", error, info);
  };

  return (
    <div className=" bg-zinc-950">
        
<MainLayout/>
<Portfolio3DRoom />
<ProjectPuzzle />
<ArcadeGame />
<SmartphoneSimulator />

      <AnimatePresence>
          <motion.div
            key="terminal-overlay"
            className=" inset-0 w-full h-full z-[100]"
            variants={terminalVariants as Variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* The terminal itself can be closed from within, so we pass the toggle function */}
            <Terminal />
          </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PortfolioContainer;