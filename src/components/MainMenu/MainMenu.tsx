import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {object} MenuItem
 * @description Defines the structure for a navigation menu item.
 * @property {string} label - The text displayed on the button.
 * @property {string} path - The route to navigate to when the button is clicked.
 */
type MenuItem = {
  label: string;
  path: string;
};

// --- CONSTANT DATA ---

/**
 * @const {MenuItem[]} MENU_ITEMS
 * @description A constant array holding the navigation links for the main menu.
 * This self-contained data prevents the need for props.
 */
const MENU_ITEMS: readonly MenuItem[] = [
  { label: 'Play Game', path: '/play' },
  { label: 'Level Select', path: '/levels' },
  { label: 'Workshop', path: '/workshop' },
  { label: 'Sandbox', path: '/sandbox' },
  { label: 'Store', path: '/store' },
];

// --- MOTION VARIANTS ---

/**
 * @const {Variants} containerVariants
 * @description Animation variants for the main page container.
 * It orchestrates the animations of its children (title and nav).
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

/**
 * @const {Variants} titleVariants
 * @description Animation variants for the main game title. It fades and drops in.
 */
const titleVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 12, stiffness: 100 },
  },
};

/**
 * @const {Variants} navContainerVariants
 * @description Animation variants for the navigation container.
 * It staggers the animation of the individual menu buttons.
 */
const navContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/**
 * @const {Variants} buttonVariants
 * @description Animation variants for individual menu buttons.
 * Includes entrance, hover, and tap animations.
 */
const buttonVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 80 },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
    },
  },
  tap: {
    scale: 0.95,
  },
};

// --- ERROR FALLBACK COMPONENT ---

/**
 * A fallback component to display when a critical error occurs in the MainMenu.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} A user-friendly error message UI.
 */
const MenuErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div
    className="flex flex-col items-center justify-center h-screen bg-gray-900 text-red-500 font-mono p-8"
    role="alert"
  >
    <h1 className="text-3xl mb-4">Menu Error</h1>
    <p>Something went wrong while loading the main menu.</p>
    <pre className="text-base bg-gray-800 p-4 rounded-lg max-w-4/5 whitespace-pre-wrap mt-4">
      {error.message}
    </pre>
  </div>
);


// --- MAIN COMPONENT ---

/**
 * The main landing screen of the game.
 * It displays the game title and navigation buttons for different game modes.
 * This component is self-contained, managing its own state and data,
 * and requires no props from its parent. It includes its own error boundary.
 *
 * @returns {JSX.Element} The rendered MainMenu component.
 */
const MainMenu = (): JSX.Element => {
  const neonBaseShadow = `
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #00ffff,
    0 0 30px #00ffff,
    0 0 40px #00ffff,
    0 0 55px #00ffff,
    0 0 75px #00ffff
  `;

  const neonPulsingShadow = `
    0 0 7px #fff,
    0 0 12px #fff,
    0 0 25px #00ffff,
    0 0 35px #00ffff,
    0 0 45px #00ffff,
    0 0 60px #00ffff,
    0 0 80px #00ffff
  `;

  return (
    <ErrorBoundary FallbackComponent={MenuErrorFallback}>
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen w-full bg-[radial-gradient(ellipse_at_center,_#1b2735_0%,_#090a0f_100%)] text-white font-['Orbitron',_sans-serif] overflow-hidden p-8"
        variants={containerVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          <motion.h1
            variants={titleVariants as Variants}
            className="text-[clamp(3rem,15vw,8rem)] font-black text-white tracking-[0.1em] mb-8 uppercase"
            style={{ textShadow: neonBaseShadow }}
            animate={{
              textShadow: [
                neonBaseShadow,
                neonPulsingShadow,
                neonBaseShadow,
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          >
            Circuit Critters
          </motion.h1>
        </AnimatePresence>
        
        <motion.nav
            className="flex flex-col items-center gap-6"
            variants={navContainerVariants as Variants}
        >
          {MENU_ITEMS.map((item) => (
            <motion.div
              key={item.path}
              variants={buttonVariants as Variants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to={item.path}
                className="block text-[clamp(1.2rem,5vw,1.8rem)] font-bold text-gray-200 bg-slate-900/60 border-2 border-[#6bffff] rounded-lg px-[2.5em] py-[0.75em] no-underline text-center min-w-[300px] cursor-pointer transition-all duration-300 ease-in-out
                           shadow-[0_0_5px_#6bffff,0_0_10px_#6bffff,inset_0_0_5px_#6bffff] [text-shadow:0_0_2px_#fff,0_0_5px_#6bffff]
                           hover:text-white hover:border-[#ff00ff]
                           hover:shadow-[0_0_10px_#ff00ff,0_0_20px_#ff00ff,inset_0_0_10px_#ff00ff] hover:[text-shadow:0_0_5px_#fff,0_0_10px_#ff00ff]"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </motion.nav>
      </motion.div>
    </ErrorBoundary>
  );
};

export default MainMenu;