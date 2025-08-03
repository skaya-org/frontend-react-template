import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import PortfolioContainer from "src/components/PortfolioContainer/PortfolioContainer";

/**
 * @description Framer Motion variants for the main container's entrance animation.
 * This creates a subtle fade-in and slide-up effect for the entire page on load.
 */
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20, // Start slightly below the final position
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

/**
 * Homepage Component
 *
 * This component serves as the main entry point for the application.
 * It is designed to be clean and simple, with its primary responsibility
 * being the rendering of the PortfolioContainer. The PortfolioContainer
 * then orchestrates the entire user experience of the portfolio.
 *
 * @returns {JSX.Element} The rendered Homepage component.
 */
const Homepage = (): JSX.Element => {
  return (
    <motion.div
      className="min-h-screen bg-slate-50 dark:bg-slate-900"
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <PortfolioContainer />
    </motion.div>
  );
};

export default Homepage;