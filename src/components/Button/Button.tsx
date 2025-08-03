import React, { JSX, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @file Button.tsx
 * @description A self-contained, static button component styled with Tailwind CSS and animated with Framer Motion.
 * @version 2.1.0
 * @see
 */

// --- CONSTANTS ---

/**
 * The static text displayed within the button.
 * This is defined as a constant to avoid magic strings and centralize configuration.
 * @type {string}
 */
const BUTTON_TEXT: string = 'Schedule a Pickup';

// --- ANIMATION VARIANTS ---

/**
 * Framer Motion variants for the button's interactive animations.
 * Defines states for hover and tap (press) events.
 * @type {Variants}
 */
const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    // The background color change is handled by Tailwind's hover:bg-blue-700
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
};


// --- STYLES ---
// All styling is now handled by Tailwind CSS classes in the JSX.

/**
 * @component Button
 * @description A simple, reusable button component styled for a primary action using Tailwind CSS.
 *
 * This component is designed to be completely self-contained, requiring no props for its operation.
 * It renders a button with a predefined text and primary action styling. This approach is useful
 * for highly standardized actions within an application where the button's appearance and text
 * are always consistent.
 *
 * It includes a basic `onClick` handler that logs to the console to demonstrate interactivity,
 * and it features subtle, spring-based animations on hover and tap using Framer Motion.
 *
 * @example
 * // To use this component, simply import and render it:
 * import Button from './Button';
 *
 * const MyComponent = () => {
 *   return (
 *     <div>
 *       <p>Click the button below to schedule your pickup.</p>
 *       <Button />
 *     </div>
 *   );
 * }
 *
 * @returns {JSX.Element} The rendered button component.
 */
const Button = (): JSX.Element => {
  /**
   * Handles the click event for the button.
   * This function is memoized with `useCallback` for performance optimization,
   * preventing re-creation on every render, although it's a minor optimization
   * in a component without props or state.
   * @returns {void}
   */
  const handleClick = useCallback((): void => {
    console.log(`'${BUTTON_TEXT}' button was clicked.`);
    // In a real-world scenario, this could trigger a state change,
    // an API call, or a navigation event.
  }, []);

  return (
    <motion.button
      onClick={handleClick}
      aria-label={BUTTON_TEXT}
      variants={buttonVariants as Variants}
      whileHover="hover"
      whileTap="tap"
      className="
        inline-block
        font-sans
        font-bold
        text-base
        text-white
        text-center
        leading-normal
        no-underline
        bg-blue-600
        py-3
        px-6
        rounded-lg
        border-none
        cursor-pointer
        outline-none
        hover:bg-blue-700
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-blue-500
      "
    >
      {BUTTON_TEXT}
    </motion.button>
  );
};

export default Button;