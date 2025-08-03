import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import MetaversePlatformPage from 'src/components/MetaversePlatformPage/MetaversePlatformPage';

/**
 * Defines the animation variants for the main page container.
 * - `hidden`: The initial state before the component enters the viewport (invisible and slightly shifted down).
 * - `visible`: The final state after the animation (fully visible and at its original position).
 */
const pageTransitionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20, // Start slightly below the final position for a subtle lift effect
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

/**
 * Homepage component serves as the main entry point for the application.
 * Its sole purpose is to render the MetaversePlatformPage, which contains
 * all the logic, layout, and child components for the entire application.
 * It wraps the page in a motion container to provide a smooth entry animation.
 * @returns {JSX.Element} The rendered and animated MetaversePlatformPage component.
 */
export const Homepage = (): JSX.Element => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageTransitionVariants as Variants}
    >
      <MetaversePlatformPage />
    </motion.div>
  );
};