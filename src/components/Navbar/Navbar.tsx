import React, { JSX } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

// --- CONSTANT DATA ---

/**
 * @typedef NavLinkItem
 * @description Represents the structure for a navigation link item.
 * @property {string} label - The visible text for the navigation link.
 * @property {string} path - The route path for the link.
 */
type NavLinkItem = {
  label: string;
  path: string;
};

/**
 * Logo text displayed in the navigation bar.
 * @constant {string}
 */
const LOGO_TEXT: string = 'Aetheria';

/**
 * An array of navigation link objects.
 * This constant data drives the navigation items in the component,
 * ensuring the component is self-contained and does not require props.
 * `Object.freeze` is used to make the array and its elements immutable.
 * @constant {ReadonlyArray<NavLinkItem>}
 */
const NAV_LINKS: ReadonlyArray<NavLinkItem> = Object.freeze([
  { label: 'Dashboard', path: '/' },
  { label: 'Marketplace', path: '/marketplace' },
  { label: 'Staking', path: '/staking' },
  { label: 'Docs', path: '/docs' },
]);

// --- ANIMATION VARIANTS ---

/**
 * Variants for the main navigation container.
 * Controls the entry animation and staggers its children.
 */
const navContainerVariants: Variants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.15,
    },
  },
};

/**
 * Variants for the direct children of the navbar (Logo, Links container, Button).
 * Creates a subtle slide-in and fade-in effect for each.
 */
const navChildVariants: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * Variants for the individual list items (links).
 * Controls their staggered appearance and hover interaction.
 */
const linkItemVariants: Variants = {
  hidden: {
    y: -15,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
  hover: {
    scale: 1.1,
    transition: { type: 'spring', stiffness: 300 },
  },
};

/**
 * Variants for the list (ul) to orchestrate the staggering of its children (li).
 */
const linkListVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
  hidden: {},
};


/**
 * Navbar Component
 *
 * @description A futuristic, top-level navigation bar for the application.
 * It features a semi-transparent dark background, a logo, centered navigation links,
 * and a "Connect Wallet" button. Active links and interactive elements have a distinct
 * neon glow effect. The component is self-contained, using hardcoded constant data
 * for its content, thus requiring no props.
 *
 * This component is designed to be placed in a root layout component. For proper
 * error handling, it should be wrapped in a React Error Boundary at a higher level
 * in the component tree, as it is a static presentational component and unlikely
 * to throw runtime errors itself.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
const Navbar = (): JSX.Element => {
  const location = useLocation();

  /**
   * Handles the click event for the "Connect Wallet" button.
   * In a real application, this would trigger a wallet connection flow.
   */
  const handleConnectWallet = (): void => {
    // In a real-world scenario, this would integrate with a web3 library
    // like ethers.js, wagmi, or web3-react.
    console.log('Attempting to connect wallet...');
    alert('Connect Wallet functionality not implemented.');
  };

  /**
   * Generates the className string for a NavLink based on its active state.
   * @param {boolean} isActive - Whether the link's route is currently active.
   * @returns {string} The Tailwind CSS classes for the link.
   */
  const getNavLinkClasses = ({ isActive }: { isActive: boolean }): string => {
    const baseClasses = "relative py-2 text-base font-medium transition-colors duration-300 ease-in-out";
    const activeClasses = "text-white [text-shadow:0_0_8px_rgba(0,255,255,0.8),_0_0_16px_rgba(0,255,255,0.5)]";
    const inactiveClasses = "text-slate-400 hover:text-white";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 z-50 flex items-center justify-between w-full px-8 py-4 bg-slate-900/75 backdrop-blur-lg border-b border-white/10"
      variants={navContainerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.div variants={navChildVariants as Variants}>
        <NavLink to="/" className="text-2xl font-bold text-white tracking-wider">
          <motion.div
            className="transition-colors duration-300 hover:text-cyan-400"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            {LOGO_TEXT}
          </motion.div>
        </NavLink>
      </motion.div>

      {/* Navigation Links */}
      <motion.ul
        className="flex list-none gap-8"
        variants={linkListVariants as Variants}
      >
        {NAV_LINKS.map((link) => (
          <motion.li
            key={link.path}
            variants={linkItemVariants as Variants}
            whileHover="hover"
          >
            <NavLink to={link.path} className={getNavLinkClasses}>
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="active-underline"
                  className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500"
                  style={{ boxShadow: '0 0 6px #00eaff' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </NavLink>
          </motion.li>
        ))}
      </motion.ul>

      {/* Connect Wallet Button */}
      <motion.div variants={navChildVariants as Variants}>
        <motion.button
          className="px-6 py-3 text-sm font-bold text-cyan-400 bg-transparent border-2 border-cyan-400 rounded-lg cursor-pointer transition-all duration-300 ease-in-out shadow-[0_0_5px_rgba(0,234,255,0.5),_inset_0_0_5px_rgba(0,234,255,0.3)] hover:bg-cyan-400/10 hover:text-white hover:shadow-[0_0_10px_rgba(0,234,255,0.8),_inset_0_0_10px_rgba(0,234,255,0.5)]"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          onClick={handleConnectWallet}
        >
          Connect Wallet
        </motion.button>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;