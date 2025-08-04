import React, { JSX, useState, useEffect } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import Button from '../Button/Button'; // New: Import the self-fulfilled Button component

/**
 * @type {NavLink}
 * @description Defines the structure for a navigation link item, containing its display name and target URL.
 */
type NavLink = {
  readonly name: string;
  readonly href: string;
};

/**
 * @const LOGO_TEXT
 * @description The text displayed for the website logo. This is a constant to ensure brand consistency.
 * Updated to 'SKaya' as per requirements.
 */
const LOGO_TEXT: string = 'SKaya';

/**
 * @const NAV_LINKS
 * @description An array of navigation link objects to be displayed in the navbar.
 * Using a constant array ensures that the navigation structure is static and defined within the component.
 * This constant is preserved as per strict guidelines, even if the primary desktop nav
 * now uses a self-fulfilled Button component. It is still used by the mobile nav.
 */
const NAV_LINKS: readonly NavLink[] = [
  { name: 'Docs', href: '#docs' },
  { name: 'API', href: '#api' },
  { name: 'Blog', href: '#blog' },
  { name: 'Community', href: '#community' },
];

/**
 * Animation variants for the main header container.
 * Animates the navbar sliding down into view on load.
 */
const headerVariants: Variants = {
  initial: { y: -100, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Animation variants for the list of navigation links.
 * This container orchestrates the staggered animation of its children.
 */
const navContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Animation variants for individual navigation link items and other content.
 * Each item animates in with a slight vertical movement and fade.
 */
const navItemVariants: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      ease: 'easeOut',
    },
  },
};

/**
 * Animation variants for the mobile sidebar.
 * Controls the slide-in and slide-out animation.
 */
const sidebarVariants: Variants = {
  closed: { 
    x: '-100%', 
    transition: { duration: 0.3, ease: 'easeOut' } 
  },
  open: { 
    x: '0%', 
    transition: { duration: 0.3, ease: 'easeIn' } 
  },
};

/**
 * Animation variants for the mobile menu backdrop.
 * Controls the fade-in and fade-out of the overlay.
 */
const backdropVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.3 } },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/**
 * Animation variants for the container of vertical navigation links in the mobile sidebar.
 * Orchestrates the staggered animation of the links.
 */
const mobileNavContainerVariants: Variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

/**
 * Animation variants for individual navigation links in the mobile sidebar.
 */
const mobileNavItemVariants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

/**
 * Animation variants for the theme toggle icons (sun/moon).
 * Provides a gentle rotation and fade effect on change.
 */
const themeIconVariants: Variants = {
  hidden: {
    opacity: 0,
    rotate: -90,
    scale: 0.5,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

/**
 * Renders the logo element for the navbar.
 * It's a self-contained component for clarity and separation of concerns.
 * @returns {JSX.Element} The rendered logo component.
 */
const Logo = (): JSX.Element => (
  <motion.a 
    href="/" 
    className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <svg 
      className="h-8 w-8 text-green-500"
      viewBox="0 0 258 258" 
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
        <path d="m164.33 129.07-51.62-51.62a15.41 15.41 0 0 1 21.8-21.8l62.52 62.52a15.41 15.41 0 0 1 0 21.8l-62.52 62.52a15.41 15.41 0 1 1-21.8-21.8z"/>
        <path d="m113.71 129.07-51.62-51.62a15.41 15.41 0 0 1 21.8-21.8l62.52 62.52a15.41 15.41 0 0 1 0 21.8l-62.52 62.52a15.41 15.41 0 1 1-21.8-21.8z"/>
    </svg>
    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
      {LOGO_TEXT}
    </span>
  </motion.a>
);

/**
 * Renders the primary navigation links for desktop view.
 * This component now uses the self-fulfilled Button component to render the links.
 * @returns {JSX.Element} The rendered navigation links component.
 */
const NavigationLinks = (): JSX.Element => (
  <motion.ul
    className="hidden items-center gap-x-8 md:flex"
    variants={navContainerVariants as Variants}
    initial="initial"
    animate="animate"
  >
    {/* Updated to use the self-fulfilled Button component for navigation items. */}
    {/* Assumes Button is a motion component and handles its own entry or receives parent context */}
    <Button /> 
  </motion.ul>
);

/**
 * @component Navbar
 * @description A production-grade, fixed-top navigation bar. It is fully self-contained,
 * requiring no props, and uses internal constants for its content. This design promotes
 * reusability and maintainability by isolating the component's data and logic.
 * The navbar is responsive, theme-aware, and includes links and icons.
 * The component's styling has been modified to make it sticky, ensuring it remains
 * at the top of the viewport when scrolling, by utilizing existing Tailwind CSS classes.
 * @returns {JSX.Element} The rendered Navbar component.
 */
const Navbar = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <motion.header
        // The 'sticky inset-x-0 top-0 z-30' classes already make the header sticky,
        // ensuring it remains at the top of the viewport when scrolling, as requested.
        className="sticky inset-x-0 top-0 z-30 bg-white/80 shadow-sm backdrop-blur-md dark:border-b dark:border-slate-800 dark:bg-slate-900/80"
        variants={headerVariants as Variants}
        initial="initial"
        animate="animate"
        aria-label="Main Navigation"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo wrapper motion.div already correctly animated */}
            <motion.div
              variants={navItemVariants as Variants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              <Logo />
            </motion.div>
            <div className="flex items-center gap-6">
              <nav className="hidden items-center gap-6 md:flex">
                <NavigationLinks />
              </nav>

              <motion.div 
                className="flex items-center gap-4"
                variants={navContainerVariants as Variants} // Parent for staggered animation
                initial="initial"
                animate="animate"
              >
                 {/* Applied navItemVariants to the separator for staggered animation with its siblings */}
                 <motion.div 
                    className="hidden h-6 w-px bg-slate-200 dark:bg-slate-700 md:block"
                    variants={navItemVariants as Variants}
                    // Initial and animate states are implicitly inherited or driven by parent's staggerChildren,
                    // but explicitly setting them adds clarity and robustness.
                    initial="initial" 
                    animate="animate"
                 ></motion.div>
                 <motion.a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="GitHub Repository" 
                    className="text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                    variants={navItemVariants as Variants}
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <span className="sr-only">GitHub</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
                 </motion.a>
                 <motion.button 
                    type="button" 
                    onClick={toggleTheme} 
                    className="text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500" 
                    aria-label="Toggle theme"
                    variants={navItemVariants as Variants}
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                   <span className="sr-only">Toggle Theme</span>
                   <AnimatePresence mode="wait" initial={false}>
                    {theme === 'light' ? (
                      <motion.svg
                        key="sun"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        variants={themeIconVariants as Variants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </motion.svg>
                    ) : (
                      <motion.svg
                        key="moon"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        variants={themeIconVariants as Variants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </motion.svg>
                    )}
                   </AnimatePresence>
                 </motion.button>
              </motion.div>

              <motion.div
                className="md:hidden"
                variants={navItemVariants as Variants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                  aria-controls="mobile-menu"
                  aria-expanded={isOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              variants={backdropVariants as Variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              variants={sidebarVariants as Variants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white shadow-xl dark:bg-slate-900"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800 sm:px-6 lg:px-8">
                <Logo />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="-mr-2 inline-flex items-center justify-center rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                  <span className="sr-only">Close menu</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <motion.nav
                variants={mobileNavContainerVariants as Variants}
                initial="closed"
                animate="open"
                exit="closed"
                className="mt-6 flow-root"
              >
                <ul className="-my-6 divide-y divide-slate-200 px-4 dark:divide-slate-700 sm:px-6 lg:px-8">
                  {NAV_LINKS.map((link) => (
                    <motion.li key={link.name} variants={mobileNavItemVariants as Variants} className="py-6">
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50 dark:text-slate-50 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-500"
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;