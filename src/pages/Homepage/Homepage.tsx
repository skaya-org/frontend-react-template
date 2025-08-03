import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import HomePage from 'src/components/HomePage/HomePage';

/**
 * The main application entry point. This component will be clean and simple,
 * importing and rendering only the main 'HomePage' component to
 * display the entire user interface. It will be wrapped in a main container
 * with a dark, space-themed background color.
 * @returns {JSX.Element} The rendered HomePage component.
 */
const Homepage = (): JSX.Element => {
  /**
   * Defines the animation variants for the main page container.
   * This creates a gentle fade-in and slide-up effect when the application loads,
   * presenting the dashboard smoothly.
   */
  const pageVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20, // Start slightly below its final position
    },
    visible: {
      opacity: 1,
      y: 0, // Animate to its final position
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-[#020024] text-slate-100 antialiased"
      initial="hidden"
      animate="visible"
      variants={pageVariants as Variants}
    >
      <HomePage />
    </motion.div>
  );
};

export default Homepage;