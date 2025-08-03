import React, { useState, useMemo, type JSX } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

/**
 * An internal, non-exported SVG icon component for the Home tab.
 * This keeps the DockTab component fully self-contained.
 * @param {object} props - Standard SVG props.
 * @returns {JSX.Element} The rendered SVG icon.
 */
const HomeIcon = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

/**
 * @type {object} TAB_DATA
 * @description Hardcoded constant data for the DockTab.
 * This component is designed to be self-sufficient and does not accept props,
 * adhering to the design constraint of using constant data.
 * It's configured to act as a "Home" tab.
 */
const TAB_DATA = {
  /** The navigation path for the tab. */
  path: '/',
  /** The text label displayed on hover. */
  label: 'Home',
  /** The icon component to be rendered. */
  Icon: HomeIcon,
};

/**
 * @description
 * The DockTab component represents a single, self-contained, and interactive tab
 * within a conceptual floating dock. It is designed with hardcoded data to function
 * as a "Home" navigation link, eliminating the need for props.
 *
 * This component leverages `react-router-dom` to determine its active state by
 * comparing its internal path with the current browser location. It uses `framer-motion`
 * to provide fluid animations for hover and active states, enhancing user experience.
 *
 * It is a "leaf" component, meaning it's simple and self-contained. Any potential errors,
 * such as being rendered outside a `react-router-dom`'s `<Router>`, should be handled
 * by a higher-level `ErrorBoundary` component in the application tree.
 *
 * @returns {JSX.Element} The rendered DockTab component.
 */
const DockTab = (): JSX.Element => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const location = useLocation();

  /**
   * Determines if the tab is currently active by comparing its path
   * with the current URL pathname.
   * @type {boolean}
   */
  const isActive = useMemo(() => location.pathname === TAB_DATA.path, [location.pathname]);

  // --- Animation Variants ---

  /** Animation variants for the main tab container. */
  const tabVariants: Variants = {
    initial: {
      scale: 1,
      y: 0,
    },
    hover: {
      scale: 1.1,
      y: -8,
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
    tap: {
      scale: 0.95,
    },
  };

  /** Animation variants for the hover label. */
  const labelVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20, delay: 0.1 },
    },
  };

  /** Animation variants for the active state indicator dot. */
  const dotVariants: Variants = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
  };

  return (
    <Link
      to={TAB_DATA.path}
      className="relative flex flex-col items-center gap-2 no-underline text-inherit"
      aria-label={TAB_DATA.label}
      aria-current={isActive ? 'page' : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`relative flex h-16 w-16 items-center justify-center rounded-3xl border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px] cursor-pointer 
          ${isActive ? 'bg-white/15' : 'bg-white/10'}`}
        variants={tabVariants as Variants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        animate={isActive ? 'hover' : 'initial'} // Keep the tab raised if it's the active page
      >
        <TAB_DATA.Icon className="h-8 w-8 text-white" />
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -bottom-8 whitespace-nowrap rounded-xl bg-black/80 px-3 py-1 text-sm font-medium text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
            variants={labelVariants as Variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {TAB_DATA.label}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActive && !isHovered && (
          <motion.div
            className="absolute -bottom-3 h-[6px] w-[6px] rounded-full bg-white"
            variants={dotVariants as Variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </AnimatePresence>
    </Link>
  );
};

export default DockTab;