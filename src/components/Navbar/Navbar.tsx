import React, { JSX } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import Logo from '../Logo/Logo';

/**
 * @typedef NavLinkItem
 * @property {string} id - A unique identifier for the link.
 * @property {string} label - The text to be displayed for the link.
 * @property {string} path - The route path for the link.
 */
type NavLinkItem = {
  id: string;
  label: string;
  path: string;
};

/**
 * Constant data for the navigation links.
 * This ensures the component is self-contained and does not require props for its primary content.
 * @type {NavLinkItem[]}
 */
const NAV_LINKS: Readonly<NavLinkItem[]> = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'about', label: 'About Us', path: '/about' },
  { id: 'services', label: 'Services', path: '/services' },
  { id: 'portfolio', label: 'Portfolio', path: '/portfolio' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

/**
 * Framer Motion variants for component animations.
 * - `header`: Controls the entrance of the entire navigation bar.
 * - `navContainer`: Orchestrates the staggered animation of its children (the nav items).
 * - `navItem`: Defines the animation for each individual navigation link, including entrance, hover, and tap states.
 */
const motionVariants = {
  header: {
    initial: { y: -100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },
  navContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3, // Delay to start after the header has animated in.
      },
    },
  },
  navItem: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { ease: 'easeOut' } },
    hover: { y: -2 },
    tap: { scale: 0.95 },
  },
};

/**
 * A responsive and elegant navigation bar for the application header.
 *
 * This component is self-contained, defining its own navigation links.
 * It features the company logo and a list of links for site navigation, built
 * using `react-router-dom` for client-side routing.
 *
 * It includes a suite of animations via `framer-motion`:
 * 1. The header slides down and fades in on load.
 * 2. Navigation items stagger into view with a subtle upward motion.
 * 3. An animated underline smoothly slides to indicate the active navigation link.
 * 4. Individual links have hover and tap feedback animations.
 *
 * @component
 * @returns {JSX.Element} The rendered Navbar component.
 */
const Navbar = (): JSX.Element => {
  /**
   * Renders a single, animated navigation link.
   * This function encapsulates the logic for styling and animating both the link
   * container (`<li>`) and the active link indicator.
   *
   * @param {NavLinkItem} link - The link data object.
   * @returns {JSX.Element} The rendered list item with a NavLink and animated underline.
   */
  const renderNavLink = (link: NavLinkItem): JSX.Element => (
    <motion.li
      key={link.id}
      variants={motionVariants.navItem as Variants}
      whileHover="hover"
      whileTap="tap"
    >
      <NavLink
        to={link.path}
        end={link.path === '/'} // `end` prop ensures 'Home' is only active on the exact path
        className={({ isActive }) =>
          `relative text-base font-medium py-2 px-1 transition-colors duration-300 ease-in-out hover:text-blue-600 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-sm ${
            isActive ? 'text-blue-600' : 'text-gray-800'
          }`
        }
      >
        {link.label}
        {/* Active link indicator: Animates using layoutId */}
          <motion.div
            className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-blue-600 rounded-full"
            layoutId="active-nav-underline"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
      </NavLink>
    </motion.li>
  );

  return (
    <motion.header
      className="sticky top-0 left-0 z-50 w-full border-b border-gray-200 bg-white/90 px-[5%] shadow-sm backdrop-blur-md"
      variants={motionVariants.header as Variants}
      initial="initial"
      animate="animate"
      data-testid="navbar"
    >
      <nav className="mx-auto flex h-[70px] max-w-[1200px] items-center justify-between">
        <Logo />
        <motion.ul
          className="flex items-center gap-8"
          variants={motionVariants.navContainer as Variants}
          initial="initial"
          animate="animate"
        >
          {NAV_LINKS.map(renderNavLink)}
        </motion.ul>
      </nav>
    </motion.header>
  );
};

export default Navbar;