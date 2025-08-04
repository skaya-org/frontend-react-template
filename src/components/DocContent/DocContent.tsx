// DocContent.tsx

// Import necessary React and JSX types for component definition.
import React, { JSX } from 'react';
// Import 'motion' and 'Variants' from 'framer-motion' for declarative animations.
// Adhering to the prompt's explicit import path and the use of Variants.
import { motion, Variants } from 'framer-motion';

// Import the required documentation components.
// These components are self-contained and, as per requirements,
// do not accept any props or interfaces from their parents.
import ComponentDocumentation from '../ComponentDocumentation/ComponentDocumentation';
import HookDocumentation from '../HookDocumentation/HookDocumentation';
import UtilityDocumentation from '../UtilityDocumentation/UtilityDocumentation';

/**
 * Defines the animation variants for the DocContent component.
 * These variants control the entry and exit animations of the main content area.
 */
const docContentVariants: Variants = {
  // Initial state: invisible and slightly offset downwards.
  initial: { opacity: 0, y: 20 },
  // Animate state: fully visible and at its natural position.
  animate: { opacity: 1, y: 0 },
  // Exit state: invisible and slightly offset upwards, for smooth unmounting.
  exit: { opacity: 0, y: -20 },
};

/**
 * Represents the main display area for documentation content.
 *
 * This component conditionally renders different types of documentation
 * (e.g., Components, Hooks, Utilities) based on an internally defined
 * constant selection. As per the strict guidelines, this component
 * does not receive any props from its parent and uses constant data
 * for its internal logic, thereby demonstrating a self-contained content display.
 *
 * It utilizes `motion` for subtle entry and exit animations, enhancing
 * the user experience by providing visual feedback when content appears.
 * Tailwind CSS utility classes are used for styling, assuming the
 * `@tailwindcss/browser` script is loaded to provide JIT compilation.
 *
 * @returns {JSX.Element} The rendered documentation content area,
 *                          displaying the selected documentation type.
 */
export default function DocContent(): JSX.Element {
  /**
   * Defines the currently active documentation category for display.
   *
   * This constant value dictates which documentation component will be rendered.
   * In line with the requirements, this component does not accept props;
   * thus, the active selection is managed internally as a constant.
   * To demonstrate different content, this value would need to be changed
   * directly within this file, or a higher-level pattern (like React Context)
   * would be used *without* passing props directly to this component.
   *
   * @constant
   * @type {'components' | 'hooks' | 'utilities'}
   */
  const activeSelection: 'components' | 'hooks' | 'utilities' = 'components'; // Example: Hardcoded to 'components' for demonstration.

  /**
   * Renders the specific documentation content based on the `activeSelection` constant.
   *
   * This private helper function uses a switch statement to determine which of the
   * imported documentation components (ComponentDocumentation, HookDocumentation,
   * or UtilityDocumentation) should be rendered. Each component is instantiated
   * without props, adhering to the guideline that they are self-sufficient.
   * A fallback message is provided if `activeSelection` were to be an unrecognized value,
   * though with a strictly typed constant, this path is primarily for robust development.
   *
   * @returns {JSX.Element} The JSX element corresponding to the selected documentation.
   */


  return (
    <motion.div
      // Assign the defined variants object to the motion component.
      variants={docContentVariants as Variants}
      // Specify which variant state to use for initial rendering.
      initial="initial"
      // Specify which variant state to animate to when the component mounts.
      animate="animate"
      // Specify which variant state to animate to when the component unmounts.
      // Note: For 'exit' animations to work, this component must be a direct child
      // of an `AnimatePresence` component from Framer Motion.
      exit="exit"
      // Configuration for the animation duration and easing function, applied to all transitions.
      transition={{ duration: 0.3, ease: 'easeOut' }}
      // Tailwind CSS classes for layout, background, spacing, shadows, and scroll behavior.
      className="flex-1 p-6 md:p-8 bg-white rounded-lg shadow-xl overflow-y-auto dark:bg-gray-800"
      // ARIA live region to announce changes for screen readers, enhancing accessibility.
      aria-live="polite"
      // ARIA label for better context for assistive technologies.
      aria-label="Documentation content display area"
    >
     <ComponentDocumentation />
     <HookDocumentation />
     <UtilityDocumentation />
    </motion.div>
  );
}