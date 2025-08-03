import React, { JSX } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

/**
 * @file Renders the main navigation header for the application.
 * @description This component is self-contained and uses hardcoded constant data.
 * It provides a 'cosmic quantum' themed navigation bar with the platform title and links.
 * It is wrapped in an ErrorBoundary to ensure robustness.
 */

// --- CONSTANTS ---

/**
 * @constant HEADER_DATA
 * @description Contains all static data required by the Header component.
 * This includes the platform title and navigation links.
 * Using a constant object ensures data is colocated and the component remains pure.
 */
const HEADER_DATA = {
  title: 'Cosmic Quantum Research Platform',
  homePath: '/',
  navLinks: [
    {
      label: 'Visualizer',
      path: '/visualizer',
    },
    {
      label: 'Circuit Builder',
      path: '/circuit-builder',
    },
  ],
};

// --- ANIMATION VARIANTS ---

/**
 * @constant headerContainerVariants
 * @description Animation variants for the main header container.
 * It orchestrates the staggered animation of its children (title and nav).
 */
const headerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

/**
 * @constant headerChildVariants
 * @description Animation variants for direct children of the header (title, nav).
 * Provides a subtle fade-in and slide-down effect.
 */
const headerChildVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
};

/**
 * @constant navListVariants
 * @description Animation variants for the navigation list (`<ul>`).
 * Staggers the animation of the individual navigation items.
 */
const navListVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

/**
 * @constant navItemVariants
 * @description Animation variants for individual navigation list items (`<li>`).
 * Defines entry animation and interactive feedback on hover/tap.
 */
const navItemVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 120 },
  },
  hover: {
    scale: 1.1,
    textShadow: '0 0 12px #00e5ff',
    originX: 0,
    transition: { type: 'spring', stiffness: 300 },
  },
  tap: {
    scale: 0.95,
  },
};

// --- ERROR BOUNDARY FALLBACK ---

/**
 * Renders a fallback UI when the Header component encounters a critical error.
 * @param {FallbackProps} props - Props provided by react-error-boundary, including the error object.
 * @returns {JSX.Element} A simple, styled error message.
 */
const HeaderFallback = ({ error }: FallbackProps): JSX.Element => (
  <div
    className="border border-[#ff0000] bg-[#1a0000] px-8 py-4 text-center text-[#ffaaaa]"
    role="alert"
  >
    <h2 className="m-0 text-[1.2rem]">Header Error</h2>
    <p>The navigation could not be loaded. Please refresh the page.</p>
    <pre className="text-[0.8rem]">{error.message}</pre>
  </div>
);

// --- CORE COMPONENT ---

/**
 * The core Header component.
 * Renders the navigation bar with a title and links based on constant data.
 * This component is designed to be self-sufficient and does not accept props.
 * @returns {JSX.Element} The rendered header element.
 */
const Header = (): JSX.Element => {
  return (
    <motion.header
      className="sticky top-0 z-[1000] flex items-center justify-between border-b border-[#4a00e0] bg-[#0c001f] px-8 py-4 font-sans text-gray-200 shadow-[0_4px_20px_rgba(74,0,224,0.5)]"
      variants={headerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={headerChildVariants as Variants}>
        <NavLink to={HEADER_DATA.homePath} className="no-underline">
          <motion.h1
            className="m-0 text-2xl font-semibold tracking-wider text-gray-100 [text-shadow:0_0_8px_#8e2de2,0_0_12px_#4a00e0]"
            whileHover={{
              scale: 1.03,
              textShadow: '0 0 10px #ffffff, 0 0 15px #8e2de2',
              transition: { type: 'spring', stiffness: 300 },
            }}
          >
            {HEADER_DATA.title}
          </motion.h1>
        </NavLink>
      </motion.div>

      <motion.nav
        className="flex items-center"
        variants={headerChildVariants as Variants}
      >
        <motion.ul
          className="m-0 flex list-none gap-8 p-0"
          variants={navListVariants as Variants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {HEADER_DATA.navLinks.map((link) => (
              <motion.li
                key={link.path}
                variants={navItemVariants as Variants}
                whileHover="hover"
                whileTap="tap"
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `relative py-2 font-medium text-[1.1rem] text-[#c0c0ff] no-underline transition-colors duration-300 ease-in-out ${
                      isActive
                        ? 'text-white'
                        : 'hover:text-white hover:[text-shadow:0_0_8px_#00e5ff]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00e5ff] to-[#4a00e0] [filter:blur(1px)]"
                          layoutId="active-nav-underline"
                          style={{ borderRadius: '2px' }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </motion.nav>
    </motion.header>
  );
};

// --- EXPORTED COMPONENT WITH ERROR BOUNDARY ---

/**
 * A wrapper component that provides an Error Boundary for the main Header.
 * This ensures that any unexpected error within the Header does not crash
 * the entire application, providing a graceful fallback instead.
 * This is the default export of the module.
 * @returns {JSX.Element} The Header component wrapped in an ErrorBoundary.
 */
const HeaderWithErrorBoundary = (): JSX.Element => (
  <ErrorBoundary
    FallbackComponent={HeaderFallback}
    onReset={() => {
      // Potentially log the error to a service here
      console.error('Header component has recovered from an error.');
    }}
  >
    <Header />
  </ErrorBoundary>
);

export default HeaderWithErrorBoundary;