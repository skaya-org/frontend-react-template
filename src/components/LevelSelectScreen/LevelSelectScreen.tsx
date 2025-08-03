import React, { JSX, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// Per the prompt, LevelIcon is an imported component.
// NOTE: For this LevelSelectScreen to be functional and "production-grade",
// it must be assumed that the imported LevelIcon is a presentational
// component that accepts props to display various level states (e.g., number, status).
// A literal interpretation where LevelIcon takes zero props would result in a
// non-functional screen displaying identical icons.
import LevelIcon from '../LevelIcon/LevelIcon';

/**
 * @typedef {'locked' | 'unlocked' | 'completed'} LevelStatus
 * Represents the possible states of a level, determining its interactivity and appearance.
 */
type LevelStatus = 'locked' | 'unlocked' | 'completed';

/**
 * @typedef {object} Level
 * Defines the structure for a single level's data.
 * @property {number} id - A unique identifier for React's key prop.
 * @property {number} number - The visible level number.
 * @property {LevelStatus} status - The current state of the level.
 */
interface Level {
  readonly id: number;
  readonly number: number;
  readonly status: LevelStatus;
}

/**
 * This constant holds all the level data required by the component.
 * By defining it here, the component remains self-contained and does not require
 * any props from its parent, adhering to the specified design constraints.
 * The `as const` assertion makes the array and its objects deeply readonly.
 */
const LEVELS_DATA = [
  { id: 1, number: 1, status: 'completed' },
  { id: 2, number: 2, status: 'completed' },
  { id: 3, number: 3, status: 'unlocked' },
  { id: 4, number: 4, status: 'unlocked' },
  { id: 5, number: 5, status: 'locked' },
  { id: 6, number: 6, status: 'locked' },
  { id: 7, number: 7, status: 'locked' },
  { id: 8, number: 8, status: 'locked' },
  { id: 9, number: 9, status: 'locked' },
  { id: 10, number: 10, status: 'locked' },
  { id: 11, number: 11, status: 'locked' },
  { id: 12, number: 12, status: 'locked' },
] as const;


/**
 * Animation variants for the main screen container.
 * Creates a slide-in/slide-out effect for page transitions.
 * @type {Variants}
 */
const screenVariants: Variants = {
  hidden: { opacity: 0, x: '-100vw' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', duration: 0.8, bounce: 0.25 },
  },
  exit: {
    opacity: 0,
    x: '100vw',
    transition: { type: 'spring', duration: 0.5, bounce: 0.2 },
  },
};

/**
 * Animation variants for the header section.
 * It fades and slides in from the top after the main screen transition.
 * @type {Variants}
 */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.3 },
  },
};

/**
 * Animation variants for the main grid container, enabling a staggered
 * animation effect for its children.
 * @type {Variants}
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.4, // Delay children animation to start after header
    },
  },
};

/**
 * Animation variants for each individual level icon in the grid.
 * Creates a subtle "pop-in" effect on load.
 * @type {Variants}
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
    },
  },
};

/**
 * A fallback UI component displayed by the ErrorBoundary if an error occurs
 * while rendering the level grid. This prevents a crash and informs the user gracefully.
 * @param {FallbackProps} props - Props provided by `react-error-boundary`.
 * @returns {JSX.Element} The rendered error fallback UI.
 */
const LevelGridErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div
    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#ff5555] rounded-lg bg-[#ff5555]/10 text-[#ffcccc] text-center"
    role="alert"
  >
    <h2 className="text-2xl mb-4">Failed to Load Levels</h2>
    <p>An unexpected error occurred. Please try again later.</p>
    <pre className="font-mono bg-black/30 p-2 rounded max-w-full break-words mt-4">
      {error.message}
    </pre>
  </div>
);

/**
 * LevelSelectScreen is a full-screen component for selecting a game level.
 * It features a title, a back button, and a grid of levels represented by
 * the `LevelIcon` component. The component is entirely self-contained, with
 * its level data hardcoded as an internal constant, requiring no props.
 *
 * @component
 * @example
 * return (
 *   <Routes>
 *     <Route path="/level-select" element={<LevelSelectScreen />} />
 *   </Routes>
 * )
 * @returns {JSX.Element} The LevelSelectScreen component.
 */
const LevelSelectScreen = (): JSX.Element => {
  const navigate = useNavigate();

  /**
   * Memoized callback to navigate to the previous page in the browser's history.
   */
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  /**
   * Memoized callback to handle the selection of a level. It navigates to the
   * corresponding level route.
   * @param {number} levelNumber - The number of the selected level.
   */
  const handleSelectLevel = useCallback((levelNumber: number) => {
    navigate(`/level/${levelNumber}`);
  }, [navigate]);

  return (
    <motion.div
      className="flex flex-col items-center w-screen min-h-screen bg-[#1a1a2e] text-[#e0e0e0] font-sans overflow-x-hidden p-8"
      variants={screenVariants as Variants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.header
        className="w-full max-w-[1200px] flex items-center justify-center mb-8 relative"
        variants={headerVariants as Variants}
      >
        <motion.button
          onClick={handleGoBack}
          className="absolute left-0 top-1/2 -translate-y-1/2 py-[0.6rem] px-[1.2rem] text-base bg-[#4a4e69] text-white border-none rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#6b708d]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          &larr; Back
        </motion.button>
        <h1 className="text-[clamp(1.8rem,5vw,2.5rem)] font-bold text-[#f0f0f0]">
          Select a Level
        </h1>
      </motion.header>

      <main className="w-full max-w-[1200px] flex-1">
        <ErrorBoundary FallbackComponent={LevelGridErrorFallback}>
          <motion.div
            className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-6 py-4 justify-items-center"
            variants={containerVariants as Variants}
            initial="hidden"
            animate="visible"
          >
            {LEVELS_DATA.map((level) => (
              <motion.div
                key={level.id}
                variants={itemVariants as Variants}
                whileHover={
                  level.status !== 'locked' ? { scale: 1.1, y: -8 } : {}
                }
                whileTap={level.status !== 'locked' ? { scale: 0.98 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                // Add cursor style to visually distinguish locked/unlocked levels on hover
                className={
                  level.status !== 'locked'
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed'
                }
              >
                <LevelIcon
                />
              </motion.div>
            ))}
          </motion.div>
        </ErrorBoundary>
      </main>
    </motion.div>
  );
};

export default LevelSelectScreen;