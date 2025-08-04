// Button.tsx
import React, { JSX, useState } from 'react'; // Import useState for state management
import { motion, Variants } from 'framer-motion'; // Import motion and Variants
import {  useNavigate } from 'react-router-dom';

/**
 * Define Framer Motion variants for the button.
 * These describe the different animation states.
 */
const buttonVariants: Variants = {
  initial: { // State when the component first renders
    opacity: 0,
    scale: 0.9,
    y: 20 // Start slightly below its final position
  },
  animate: { // State to animate to after initial render
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring", // Use a spring physics-based animation
      stiffness: 260,
      damping: 20,
      delay: 0.3 // A slight delay for a staggered entrance if part of a larger layout
    }
  },
  whileHover: { // State when the user hovers over the button
    scale: 1.05, // Slightly enlarge the button
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", // Add a subtle shadow
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  whileTap: { // State when the user taps/clicks the button
    scale: 0.95, // Slightly shrink for a "pressed" effect
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Reduce shadow
  }
};

/**
 * Button Component (Original "Get Started" Button)
 *
 * This is a reusable UI component for user interactions.
 * It features constant styling and content, making it suitable for
 * various calls to action across the application without requiring
 * any props or interfaces from parent components.
 */
const Button = (): JSX.Element => {
  const navigate=useNavigate()
  return (
    <motion.button // Use motion.button for Framer Motion capabilities
      variants={buttonVariants as Variants} // Apply the defined variants
      initial="initial" // Set the initial animation state
      animate="animate" // Animate to this state on mount
      whileHover="whileHover" // Apply this state on hover
      whileTap="whileTap" // Apply this state on tap/click
      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out whitespace-nowrap cursor-pointer"
      aria-label="Get Started Action"
      type="button" // Explicitly define type for good practice
      onClick={() => navigate('/docs')} // Example action, replace with actual navigation logic
    >
      Get Started
    </motion.button>
  );
};

/**
 * CopyCodeButton Component
 *
 * This button is specifically designed for copying code snippets in documentation.
 * It features a constant code snippet to copy and provides visual feedback.
 * It does not accept any props.
 */
const CopyCodeButton = (): JSX.Element => {
  const [copied, setCopied] = useState<boolean>(false);

  // Constant code snippet to be copied
  const codeToCopy: string = `
function greet() {
  console.log("Hello, documentation reader!");
}
greet();
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        // Optionally, show an error message
      });
  };

  return (
    <motion.button
      variants={buttonVariants as Variants}
      initial="initial"
      animate="animate"
      whileHover="whileHover"
      whileTap="whileTap"
      onClick={handleCopy}
      className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out whitespace-nowrap cursor-pointer ${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
      aria-label={copied ? "Code copied to clipboard" : "Copy code snippet"}
      type="button"
    >
      {copied ? 'Copied!' : 'Copy Code'}
    </motion.button>
  );
};

/**
 * NavLinkButton Component
 *
 * This button serves as a navigation link within the documentation site.
 * It directs to a constant URL and does not accept any props.
 */
const NavLinkButton = (): JSX.Element => {
  // Constant URL for navigation
  const destinationUrl: string = 'https://example.com/documentation/getting-started';

  const handleNavigation = () => {
    // In a real application, you might use React Router's navigate function
    // For this example, we'll use a simple window.open
    window.open(destinationUrl, '_blank'); // Open in a new tab
  };

  return (
    <motion.button
      variants={buttonVariants as Variants}
      initial="initial"
      animate="animate"
      whileHover="whileHover"
      whileTap="whileTap"
      onClick={handleNavigation}
      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ease-in-out whitespace-nowrap cursor-pointer"
      aria-label="Navigate to documentation"
      type="button"
    >
      Explore Docs
    </motion.button>
  );
};

export default Button;
export { CopyCodeButton, NavLinkButton }; // Export the new specialized buttons