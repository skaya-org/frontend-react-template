import React, { useState, JSX, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';

/**
 * @interface NavLinkItem
 * @description Defines the structure for a single navigation link item.
 * @property {string} label - The visible text for the navigation link.
 * @property {string} to - The path for the react-router-dom NavLink.
 * @property {string} ariaLabel - The ARIA label for accessibility, describing the link's purpose.
 */
export interface NavLinkItem {
  label: string;
  to: string;
  ariaLabel: string;
}

/**
 * @interface NavbarProps
 * @description Defines the props for the Navbar component.
 * @property {string} siteTitle - The title of the site, displayed in the top-left corner. It also acts as a link to the homepage.
 * @property {NavLinkItem[]} navLinks - An array of navigation link objects to be displayed in the navbar.
 * @property {string} [className] - Optional additional CSS class names to apply to the main header element.
 */
export interface NavbarProps {
  siteTitle: string;
  navLinks: NavLinkItem[];
  className?: string;
}

// --- Animation Variants ---

/**
 * Variants for the main navbar container to slide in from the top.
 */
const navbarVariants: Variants = {
  initial: { y: -100, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1, 
    transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.2 } 
  },
};

/**
 * Variants for the site title hover and tap animations.
 */
const siteTitleVariants: Variants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

/**
 * Variants for the desktop navigation container to orchestrate staggered animations for its children.
 */
const desktopNavContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.4,
    },
  },
};

/**
 * Variants for individual desktop navigation links: staggered entry, hover, and tap effects.
 */
const desktopNavItemVariants: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
  hover: { scale: 1.1, originX: 0.5 },
  tap: { scale: 0.95 },
};

/**
 * Variants for the mobile menu overlay to fade in and out.
 */
const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

/**
 * Variants for the individual mobile navigation links for staggered entry.
 */
const mobileLinkItemVariants: Variants = {
  initial: { x: 80, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  exit: { x: 80, opacity: 0, transition: { duration: 0.1 } },
};


/**
 * @component Navbar
 * @description A responsive navigation bar for a portfolio website. It features a site title,
 * navigation links, and a mobile-friendly hamburger menu with smooth animations.
 *
 * @param {NavbarProps} props - The props for the component.
 * @returns {JSX.Element} The rendered navigation bar component.
 *
 * @example
 * const navLinks = [
 *   { label: 'Home', to: '/', ariaLabel: 'Navigate to Home page' },
 *   { label: 'About', to: '/about', ariaLabel: 'Navigate to About Me page' },
 *   { label: 'Projects', to: '/projects', ariaLabel: 'Navigate to Projects page' },
 *   { label: 'Contact', to: '/contact', ariaLabel: 'Navigate to Contact page' },
 * ];
 *
 * <Navbar siteTitle="My Portfolio" navLinks={navLinks} />
 */
const Navbar = ({ siteTitle, navLinks, className }: NavbarProps): JSX.Element => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  /**
   * Toggles the visibility of the mobile navigation menu.
   */
  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(prev => !prev);
  };

  /**
   * Closes the mobile menu, typically after a link is clicked.
   */
  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  /**
   * Animation variants for the mobile menu container.
   * Includes staggerChildren to animate links sequentially.
   */
  const mobileMenuVariants = useMemo(() => ({
      initial: { x: '100%' },
      animate: { 
        x: 0, 
        transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.07, delayChildren: 0.2 } 
      },
      exit: { x: '100%', transition: { duration: 0.2, ease: 'easeIn' } },
  }), []);

  const mobileLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-2xl font-medium no-underline transition-colors duration-300
    ${isActive ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-gray-900'}`;

  return (
    <>
      <motion.header 
        className={`sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 shadow-sm backdrop-blur-md ${className || ''}`}
        variants={navbarVariants as Variants}
        initial="initial"
        animate="animate"
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
          {/* Site Title / Logo */}
          <motion.div variants={siteTitleVariants as Variants} whileHover="hover" whileTap="tap">
            <NavLink to="/" className="text-2xl font-bold text-gray-800 no-underline transition-colors duration-300 hover:text-gray-500" aria-label={`${siteTitle} - Home Page`}>
              {siteTitle}
            </NavLink>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.ul 
            className="hidden list-none items-center gap-6 md:flex"
            variants={desktopNavContainerVariants as Variants}
            initial="initial"
            animate="animate"
          >
            {navLinks.map((link) => (
              <motion.li
                key={link.to}
                variants={desktopNavItemVariants as Variants}
                whileHover="hover"
                whileTap="tap"
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `relative py-1 text-base font-medium no-underline transition-colors duration-300 
                    ${isActive ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-gray-900'}`
                  }
                  aria-label={link.ariaLabel}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-[-2px] left-0 h-[2px] w-full bg-blue-600"
                          layoutId="active-desktop-link"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            className="relative z-50 -mr-2 block rounded-md p-2 text-gray-800 transition-colors hover:bg-gray-100 md:hidden"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path
                    animate={{ d: isMobileMenuOpen ? "M 6 18 L 18 6" : "M 4 6 L 20 6" }}
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                />
                <motion.path
                    d="M 4 12 L 20 12"
                    animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                    transition={{ duration: 0.1 }}
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                />
                <motion.path
                    animate={{ d: isMobileMenuOpen ? "M 6 6 L 18 18" : "M 4 18 L 20 18" }}
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                />
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Navigation Menu with Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/50"
              variants={overlayVariants as Variants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            <motion.ul
              className="fixed inset-y-0 right-0 z-40 flex w-4/5 max-w-xs list-none flex-col items-center justify-center gap-8 bg-white shadow-xl md:hidden"
              variants={mobileMenuVariants as Variants}
              initial="initial"
              animate="animate"
              exit="exit"
              aria-hidden={!isMobileMenuOpen}
              role="menu"
            >
              {navLinks.map((link) => (
                <motion.li 
                  key={`mobile-${link.to}`} 
                  role="menuitem"
                  variants={mobileLinkItemVariants as Variants}
                >
                  <NavLink
                    to={link.to}
                    className={mobileLinkClasses}
                    aria-label={link.ariaLabel}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;