import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @file RightSidebar.tsx
 * @description This file defines the RightSidebar component, which serves as a static "On this page" navigation.
 * @author Senior Fullstack/TypeScript Developer
 * @version 1.0.0
 */

/**
 * @typedef {object} NavigationLink
 * @description Represents the structure for a single navigation link in the sidebar.
 * @property {string} title - The visible text of the link.
 * @property {string} href - The anchor URL the link points to (e.g., "#introduction").
 */
type NavigationLink = {
  readonly title: string;
  readonly href: string;
};

/**
 * @const {ReadonlyArray<NavigationLink>} NAVIGATION_LINKS
 * @description A constant array of navigation link objects. This data is hardcoded
 * to ensure the component is self-contained and does not require props for its content.
 * These links should correspond to element IDs in the main content area of the page.
 */
const NAVIGATION_LINKS: readonly NavigationLink[] = [
  { title: 'Introduction', href: '#introduction' },
  { title: 'Installation', href: '#installation' },
  { title: 'Usage', href: '#usage' },
  { title: 'Core Concepts', href: '#core-concepts' },
  { title: 'API Reference', href: '#api-reference' },
  { title: 'Examples', href: '#examples' },
  { title: 'Contributing', href: '#contributing' },
];

/**
 * @const {object} containerVariants
 * @description Framer Motion variants for the main navigation container.
 * Animates the container with a staggered effect for its children.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.3, // A slight delay before the sidebar appears
      when: 'beforeChildren',
      staggerChildren: 0.08, // Each child will animate in 0.08s after the previous one
    },
  },
};

/**
 * @const {object} itemVariants
 * @description Framer Motion variants for each navigation link item.
 * Animates each list item with a fade-in and slide-up effect.
 */
const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring', // Use a spring animation for a natural bounce
      stiffness: 120,
      damping: 15,
    },
  },
};

/**
 * @component RightSidebar
 * @description A fixed-position sidebar on the right of the screen providing "On this page" navigation.
 * It displays a static list of anchor links that correspond to headings within the main content.
 * The component is fully self-contained, managing its own data and styling, and does not accept any props.
 * It is designed to be hidden on smaller screens (below `lg` breakpoint) to ensure a clean mobile layout.
 *
 * @returns {JSX.Element} The rendered RightSidebar component.
 */
const RightSidebar = (): JSX.Element => {
  return (
    // The <nav> element provides semantic meaning for navigation.
    // It's hidden on screens smaller than 1024px (`lg:`).
    // `aria-labelledby` improves accessibility by linking the nav to its visible title.
    <motion.nav
      className="hidden lg:block fixed top-0 right-0 h-screen w-64 border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      aria-labelledby="on-this-page-title"
      initial="hidden"
      animate="visible"
      variants={containerVariants as Variants} // Main container for orchestration
    >
      {/* This inner div handles padding and vertical scrolling if the content overflows. */}
      <div className="h-full overflow-y-auto px-8 pt-24 pb-10">
        <h2
          id="on-this-page-title"
          className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100"
        >
          On this page
        </h2>
        {/* Unordered list to structure the navigation links semantically. */}
        <ul className="space-y-2">
          {NAVIGATION_LINKS.map((link) => (
            <motion.li
              key={link.href}
              variants={itemVariants as Variants} // Each item animates based on these variants
            >
              <a
                href={link.href}
                className="block text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors duration-200"
              >
                {link.title}
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
};

export default RightSidebar;