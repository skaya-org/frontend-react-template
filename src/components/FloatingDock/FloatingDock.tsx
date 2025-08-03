import React, { JSX, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import { NavLinkProps } from 'react-router-dom';
import DockTab from '../../components/DockTab/DockTab';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Defines the shape of a single navigation item within the dock.
 * This structure provides all necessary data to render a DockTab.
 * @property {string} id - A unique identifier for the item, crucial for React's `key` prop.
 * @property {NavLinkProps['to']} to - The destination path for navigation, compatible with `react-router-dom`.
 * @property {string} label - The text label displayed beneath the icon in the tab.
 * @property {ReactNode} icon - The icon to be displayed in the tab. Can be an SVG component, an emoji, or any renderable React node.
 */
type DockItem = {
  id: string;
  to: NavLinkProps['to'];
  label: string;
  icon: ReactNode;
};

// ============================================================================
// CONSTANT DATA
// ============================================================================

/**
 * A constant array of dock items. This self-contained data source dictates the
 * content of the FloatingDock, eliminating the need for props and ensuring
 * predictable, static navigation options.
 *
 * To modify the dock's tabs, you only need to edit this array.
 */
const DOCK_ITEMS: readonly DockItem[] = [
  {
    id: 'home',
    label: 'Home',
    to: '/',
    icon: '🏠', // Using emoji as a simple, dependency-free icon
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    to: '/dashboard',
    icon: '📊',
  },
  {
    id: 'profile',
    label: 'Profile',
    to: '/profile',
    icon: '👤',
  },
  {
    id: 'settings',
    label: 'Settings',
    to: '/settings',
    icon: '⚙️',
  },
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Animation variants for the main dock container.
 * Controls the entrance animation of the dock, making it slide up and fade in.
 * The `staggerChildren` property orchestrates the sequential animation of the tabs inside.
 */
const dockVariants: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      delay: 0.2,
      staggerChildren: 0.07, // Animate children with a small delay between them
    },
  },
};

/**
 * Animation variants for each individual dock tab.
 * Controls the entrance of each tab, making it slide up slightly and fade in.
 */
const tabVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring', // Use a spring for a bouncier, more natural feel
      stiffness: 260,
      damping: 20,
    },
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * A self-contained, floating navigation dock fixed to the bottom of the viewport.
 *
 * This component uses an internal constant `DOCK_ITEMS` to define its navigation tabs,
 * making it entirely self-sufficient and independent of parent components for its data.
 * It leverages `framer-motion` for a subtle entrance animation and `react-error-boundary`
 * to gracefully handle potential rendering errors in its children.
 *
 * @component
 * @returns {JSX.Element} The rendered FloatingDock component.
 */
const FloatingDock = (): JSX.Element => {
  /**
   * Renders a fallback UI when an error occurs while rendering the dock tabs.
   * This prevents the entire application from crashing due to a faulty tab.
   * @returns {JSX.Element} The error message UI.
   */
  const renderErrorFallback = (): JSX.Element => (
    <div className="p-4 font-sans text-center text-red-800 bg-red-100 rounded-xl">
      <p>⚠️ Something went wrong while loading the navigation tabs.</p>
    </div>
  );

  return (
    <motion.nav
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/70 p-2 shadow-xl backdrop-blur-md backdrop-saturate-150"
      variants={dockVariants as Variants}
      initial="hidden"
      animate="visible"
      aria-label="Main navigation"
    >
      <ErrorBoundary fallbackRender={renderErrorFallback}>
        {DOCK_ITEMS.map(({ id, to, label, icon }) => (
          <motion.div key={id} variants={tabVariants as Variants}>
            <DockTab
            />
          </motion.div>
        ))}
      </ErrorBoundary>
    </motion.nav>
  );
};

export default FloatingDock;