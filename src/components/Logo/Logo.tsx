import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

// --- CONSTANTS --- //

/**
 * @constant HOME_PATH
 * The navigation path for the application's home page.
 * The logo will always link to this path.
 */
const HOME_PATH: string = '/';

/**
 * @constant COMPANY_NAME
 * The name of the company. Used for accessibility purposes.
 */
const COMPANY_NAME: string = 'Stellar Solutions';

// --- ANIMATION VARIANTS --- //

/**
 * Defines the animation variants for the main logo container.
 * It orchestrates the animations of its children (`path` and `text`).
 */
const logoContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.2, // Stagger the animation of the path and text
    },
  },
  hover: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  },
  tap: {
    scale: 0.95,
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  },
};

/**
 * Defines the animation for the SVG path, creating a "drawing" effect.
 */
const pathVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

/**
 * Defines the animation for the SVG text, making it fade and slide in.
 */
const textVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};


// --- SVG ICON COMPONENT --- //

/**
 * Renders the company's SVG logo icon.
 * This is a private component used only within Logo.tsx to keep the main component clean.
 * The SVG is designed to be scalable and uses `currentColor` for its fill,
 * allowing its color to be determined by the parent's CSS `color` property.
 *
 * It's now composed of `motion` elements to enable detailed animations.
 *
 * @returns {JSX.Element} The rendered and animatable SVG icon.
 */
const LogoIcon = (): JSX.Element => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 50"
    // Default size is defined here, can be overridden by parent context.
    // Text color is inherited, allowing for easy theme changes (e.g., dark mode).
    className="h-auto w-[150px] max-w-full text-slate-800 dark:text-slate-200"
    aria-hidden="true" // Decorative, as the parent link has an aria-label
    // Animation states are inherited from the parent motion.div
  >
    <title>{`${COMPANY_NAME} Logo`}</title>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        {/* Using Tailwind's blue-500 and indigo-400 colors for the gradient */}
        <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'rgb(129, 140, 248)', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <motion.path
      fill="url(#logoGradient)"
      d="M10,5 Q15,0 20,5 L30,25 L20,45 Q15,50 10,45 L0,25 Z"
      variants={pathVariants as Variants}
    />
    <motion.text
      x="40"
      y="35"
      // Font classes can be applied to the SVG for inheritance if needed,
      // but attributes are standard for SVG text.
      fontFamily="sans-serif"
      fontSize="30"
      fontWeight="bold"
      fill="currentColor"
      variants={textVariants as Variants}
    >
      Stellar
    </motion.text>
  </motion.svg>
);


// --- MAIN COMPONENT --- //

/**
 * A self-contained component that displays the company logo.
 *
 * This component is designed to be used without any props. It encapsulates all necessary
 * information, including the image asset and the link to the homepage, making it highly
 * reusable in different parts of the application like the navigation bar or footer.
 * It leverages `react-router-dom` for client-side navigation and `framer-motion` for
 * a sophisticated initial animation and subtle hover interactions.
 *
 * @example
 * ```tsx
 * // In a Navbar component
 * import Logo from './Logo';
 *
 * const Navbar = () => (
 *   <nav>
 *     <Logo />
 *     // ... other nav links
 *   </nav>
 * );
 * ```
 *
 * @returns {JSX.Element} The rendered logo component, which links to the homepage.
 */
const Logo = (): JSX.Element => {
  return (
    <motion.div
      variants={logoContainerVariants as Variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="inline-block" // Ensures motion.div doesn't take full width
    >
      <Link
        to={HOME_PATH}
        aria-label={`Go to ${COMPANY_NAME} Homepage`}
        // Sets up the link as a flex container and adds accessible focus styles.
        className="inline-flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
      >
        <LogoIcon />
      </Link>
    </motion.div>
  );
};

export default Logo;