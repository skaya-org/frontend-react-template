import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import MainMenu from 'src/components/MainMenu/MainMenu';

/**
 * Variants for the main container animation.
 * Defines the initial (hidden) and final (visible) states for the component's entry animation.
 */
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

const Homepage = (): JSX.Element => {
  // This component now acts as the main entry point for the 'Circuit Critters' game.
  // It provides a full-screen, centered container for the MainMenu.
  // The dark background and text color establish a base theme for the application.
  // A subtle fade-in and scale animation is applied to the main container for a smooth entry.
  return (
    <motion.div
      className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4"
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <MainMenu />
    </motion.div>
  );
};

export default Homepage;