import React, { ReactNode, JSX } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

/**
 * @interface NavLinkItem
 * @description Defines the structure for a single navigation link item.
 * This allows for a consistent and type-safe data format for links passed to the Navbar.
 * It is exported to be used by parent components when constructing the navLinks array.
 */
export interface NavLinkItem {
  /**
   * The text to be displayed for the link.
   * @type {string}
   */
  label: string;

  /**
   * The destination path for the navigation link. This will be used in the `to` prop
   * of react-router-dom's NavLink component.
   * @type {string}
   */
  path: string;

  /**
   * An optional icon to be displayed next to the link label.
   * Can be any valid React node, such as an SVG component from a library like react-icons.
   * @type {ReactNode | undefined}
   */
  icon?: ReactNode;
}

/**
 * @interface NavbarProps
 * @description Defines the props for the Navbar component.
 * It provides a flexible and intuitive API for defining the navbar's brand,
 * navigation links, and any custom action elements.
 */
export interface NavbarProps {
  /**
   * The brand element of the navbar, typically a logo and/or site name.
   * Using `ReactNode` allows for maximum flexibility, accepting a string, an <img> tag,
   * or a custom React component (e.g., a link to the homepage).
   * @type {ReactNode}
   */
  brand: ReactNode;

  /**
   * An array of navigation link objects to be rendered in the main navigation area.
   * Each object must conform to the `NavLinkItem` interface.
   * @type {NavLinkItem[]}
   * @see NavLinkItem
   */
  navLinks: NavLinkItem[];

  /**
   * A slot for additional components or elements, typically aligned to the right side
   * of the navbar. This is ideal for user profile dropdowns, login/logout buttons,
   * theme toggles, or other call-to-action controls.
   * @type {ReactNode | undefined}
   */
  actions?: ReactNode;

  /**
   * An optional CSS class name to apply to the root <nav> element. This allows
   * for custom styling and integration with CSS frameworks.
   * @type {string | undefined}
   */
  className?: string;
}

// Animation variants for Framer Motion.
// Defined outside the component to prevent re-creation on every render.

/**
 * Variants for the brand element, animating it from the left.
 */
const brandVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/**
 * Variants for the navigation list container (ul).
 * It orchestrates the staggering animation of its children (li).
 */
const navListVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1, // Start animating children after the brand has likely appeared
    },
  },
};

/**
 * Variants for each individual navigation link item (li).
 * They fade and slide in from the top.
 */
const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 12 },
  },
};

/**
 * Variants for the actions container, animating it from the right.
 */
const actionsVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/**
 * A consistent, production-grade navigation bar component with fluid animations.
 *
 * This component serves as a foundational UI element, providing a clear and accessible
 * primary navigation structure. It is enhanced with Framer Motion to create an engaging
 * and professional user experience on page load.
 *
 * It leverages `react-router-dom`'s `NavLink` component to handle client-side routing
 * and automatically apply active styles to the current page's link, enhancing user
 * experience.
 *
 * As a presentational component, it receives all its data and configuration via props.
 * For handling potential errors (e.g., if props are derived from a failing data fetch
 * in a parent component), it is recommended to wrap this component in a `ReactErrorBoundary`
 * at a higher level in the component tree.
 *
 * @component
 * @param {NavbarProps} props - The props for the Navbar component.
 * @returns {JSX.Element} The rendered navigation bar element.
 *
 * @example
 * ```tsx
 * import Navbar, { NavLinkItem } from './Navbar';
 * import { BrowserRouter as Router } from 'react-router-dom';
 * // Example using a hypothetical Icon component
 * // import { HomeIcon, AboutIcon, ProfileIcon } from './icons';
 *
 * const navItems: NavLinkItem[] = [
 *   { label: 'Home', path: '/', icon: <HomeIcon className="h-5 w-5" /> },
 *   { label: 'About', path: '/about', icon: <AboutIcon className="h-5 w-5" /> },
 * ];
 *
 * const userActions = (
 *   <div className="flex items-center gap-2">
 *     <ProfileIcon className="h-6 w-6" />
 *     <span>Jane Doe</span>
 *   </div>
 * );
 *
 * const App = () => (
 *   <Router>
 *     <Navbar
 *       brand={<a href="/"><img src="/logo.svg" alt="My Site Logo" className="h-8" /></a>}
 *       navLinks={navItems}
 *       actions={userActions}
 *       className="custom-navbar-theme"
 *     />
 *     { // ... other components and routes }
 *   </Router>
 * );
 * ```
 */
const Navbar = ({
  brand,
  navLinks,
  actions,
  className = '',
}: NavbarProps): JSX.Element => {
  return (
    <nav
      className={`flex items-center justify-between bg-white px-4 py-3 font-sans shadow-sm border-b border-gray-200 sm:px-6 lg:px-8 ${className}`.trim()}
      aria-label="Main navigation"
    >
      {/* Left section: Brand and navigation links */}
      <div className="flex items-center gap-x-10">
        <motion.div
          variants={brandVariants as Variants}
          initial="hidden"
          animate="visible"
        >
          {brand}
        </motion.div>

        {/* Main navigation links */}
        <motion.ul
          className="hidden list-none items-center gap-x-6 md:flex"
          variants={navListVariants as Variants}
          initial="hidden"
          animate="visible"
        >
          {navLinks.map((link) => (
            <motion.li
              key={link.path}
              variants={navItemVariants as Variants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-x-2 text-base transition-colors duration-200 ease-in-out ${
                    isActive
                      ? 'font-semibold text-blue-600'
                      : 'font-medium text-gray-600 hover:text-blue-600'
                  }`
                }
              >
                {link.icon && <span className="flex-shrink-0 h-5 w-5">{link.icon}</span>}
                <span className="leading-none">{link.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Right section: Action buttons or user info */}
      <motion.div
        variants={actionsVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        {actions}
      </motion.div>
    </nav>
  );
};

export default Navbar;