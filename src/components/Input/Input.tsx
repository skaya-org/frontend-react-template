// New component Input
import React, { useState, ChangeEvent, JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Import motion and Variants

/**
 * Standardized form input field component.
 * It internally manages its state and styling for consistency across the application.
 * This component does not accept any props or interfaces from parent components,
 * and uses constant data for its internal configuration and default values.
 */
function Input(): JSX.Element {
  // Constant data for internal configuration
  const INPUT_ID = "standard-input";
  const INPUT_LABEL = "Enter your text:";
  // Updated placeholder text to reflect search/filtering capabilities for documentation
  const INPUT_PLACEHOLDER = "Search documentation...";
  const INPUT_TYPE = "text"; // Default input type

  // Internal state to manage the input value
  const [inputValue, setInputValue] = useState<string>('');

  /**
   * Handles the change event of the input field.
   * Updates the internal state with the new input value.
   * @param event The change event from the input element.
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  // --- Framer Motion Variants Definitions ---

  // Variants for the main container div
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -20 }, // Initial state: hidden, slightly above
    visible: {
      opacity: 1, // Animate to visible
      y: 0,       // Animate to original Y position
      transition: {
        duration: 0.5, // Animation duration
        ease: "easeOut", // Easing function
        staggerChildren: 0.1 // Stagger the animation of child components (label, input)
      }
    }
  };

  // Variants for the label
  const labelVariants: Variants = {
    hidden: { opacity: 0, x: -10 }, // Initial state: hidden, slightly to the left
    visible: {
      opacity: 1, // Animate to visible
      x: 0,       // Animate to original X position
      transition: {
        duration: 0.3, // Animation duration
        ease: "easeOut" // Easing function
      }
    }
  };

  // Variants for the input field, including initial, animate, hover, and focus states
  const inputVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 }, // Initial state: hidden, slightly scaled down
    visible: {
      opacity: 1, // Animate to visible
      scale: 1,   // Animate to original scale
      transition: {
        duration: 0.3, // Animation duration
        ease: "easeOut" // Easing function
      }
    },
    hover: {
      scale: 1.005, // Slightly enlarge on hover
      borderColor: '#3B82F6', // Blue-500
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)', // Equivalent to focus:ring-2 blue-500
      transition: { duration: 0.1 } // Quick transition for hover
    },
    focus: {
      scale: 1.005, // Slightly enlarge on focus
      borderColor: '#3B82F6', // Blue-500
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)', // Equivalent to focus:ring-2 blue-500
      transition: { duration: 0.1 } // Quick transition for focus
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-2 p-4 bg-white shadow-md rounded-lg w-full max-w-sm mx-auto"
      variants={containerVariants as Variants} // Apply container variants
      initial="hidden" // Set initial animation state
      animate="visible" // Animate to visible state on mount
    >
      <motion.label
        htmlFor={INPUT_ID}
        className="text-sm font-medium text-gray-700"
        variants={labelVariants as Variants} // Apply label variants
      >
        {INPUT_LABEL}
      </motion.label>
      <motion.input
        id={INPUT_ID}
        type={INPUT_TYPE}
        value={inputValue}
        onChange={handleChange}
        placeholder={INPUT_PLACEHOLDER}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   sm:text-sm text-gray-900 placeholder-gray-400"
        aria-label={INPUT_LABEL}
        variants={inputVariants as Variants} // Apply input variants for initial animation, hover, and focus
        whileHover="hover" // Animate to 'hover' state when mouse is over
        whileFocus="focus" // Animate to 'focus' state when element is focused
      />
      {/* Optionally display the current value for demonstration/debugging */}
      {/* <p className="mt-2 text-sm text-gray-500">Current Value: {inputValue}</p> */}
    </motion.div>
  );
}

export default Input;