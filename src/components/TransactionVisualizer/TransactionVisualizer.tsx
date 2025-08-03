import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// --- Constants ---

/**
 * @constant ANIMATION_CONFIG
 * @description Central configuration for all animation timings and properties.
 * This ensures consistency and easy tuning of the visualizer's behavior.
 */
const ANIMATION_CONFIG = {
  // Total duration for one full cycle of the morphing shape animation.
  shapeMorphDuration: 8,
  // Number of orbiting light trails.
  trailCount: 4,
  // Duration for one full orbit of a light trail.
  trailOrbitDuration: 6,
  // Stagger delay between each trail's animation start.
  trailStaggerDelay: 0.2, // Adjusted for a quicker cascade effect
};

/**
 * @constant MORPHING_SHAPE_PATHS
 * @description A sequence of SVG path data (`d` attributes) that the central shape morphs through.
 * Each path is defined within a 100x100 viewBox.
 */
const MORPHING_SHAPE_PATHS = [
  'M 50,15 L 85,35 L 85,65 L 50,85 L 15,65 L 15,35 Z', // Hexagon
  'M 20,20 L 80,20 L 80,80 L 20,80 Z', // Square
  'M 50,10 L 90,90 L 10,90 Z', // Triangle
  'M 50,10 L 90,50 L 50,90 L 10,50 Z', // Diamond
  'M 50,15 L 85,35 L 85,65 L 50,85 L 15,65 L 15,35 Z', // Hexagon (to complete the loop)
];

// --- Animation Variants ---

/**
 * @constant containerVariants
 * @description Framer Motion variants for the main container.
 * Manages the initial appearance and staggered animation of its children.
 */
const containerVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: ANIMATION_CONFIG.trailStaggerDelay,
    },
  },
};

/**
 * @constant shapeVariants
 * @description Framer Motion variants for the central morphing shape.
 * It animates an entry sequence (fade and scale) and then begins the perpetual morphing.
 */
const shapeVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.5,
  },
  animate: {
    opacity: 1,
    scale: 1,
    d: MORPHING_SHAPE_PATHS,
    transition: {
      // Define separate transitions for entry and the looping animation
      opacity: { duration: 0.7, ease: 'easeOut' },
      scale: { duration: 0.7, ease: 'easeOut' },
      d: {
        duration: ANIMATION_CONFIG.shapeMorphDuration,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      },
    },
  },
};

/**
 * @constant trailVariants
 * @description Framer Motion variants for the orbiting light trails.
 * Starts from an invisible state and animates into a perpetual circular orbit.
 */
const trailVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    x: [0, 50, 0, -50, 0],
    y: [50, 0, -50, 0, 50],
    scale: [1, 1.2, 1, 0.8, 1],
    opacity: [0.8, 1, 0.8, 1, 0.8],
    transition: {
      duration: ANIMATION_CONFIG.trailOrbitDuration,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// --- Error Boundary Fallback ---

/**
 * @description A fallback component to render when the TransactionVisualizer encounters a critical error.
 * It provides a user-friendly message and logs the error for debugging.
 * @param {object} props - The props object.
 * @param {Error} props.error - The error caught by the boundary.
 * @returns {JSX.Element} A simple, styled error message component.
 */
const VisualizationErrorFallback = ({ error }: { error: Error }): JSX.Element => {
  // In a real application, you would log this error to a monitoring service.
  console.error('TransactionVisualizer failed to render:', error.message);

  return (
    <div
      role="alert"
      className="flex h-[300px] w-[300px] flex-col items-center justify-center rounded-lg border border-[#ff4d4d] bg-[#050818] p-5 text-center font-mono text-[#ff4d4d]"
    >
      <h3 className="m-0 mb-2.5 text-lg">Animation Error</h3>
      <p className="m-0 text-xs">
        The transaction visualizer could not be displayed.
      </p>
    </div>
  );
};

// --- Main Component ---

/**
 * @description
 * The `TransactionVisualizer` component renders a complex, self-contained animation
 * of morphing shapes and orbiting light trails. It is designed to provide engaging
 * visual feedback for asynchronous processes like blockchain transactions or
 * smart contract interactions.
 *
 * This component is entirely self-sufficient, using hardcoded constant data for its
 * animation sequence and styling, and requires no props.
 *
 * @returns {JSX.Element} The rendered TransactionVisualizer component.
 */
const TransactionVisualizer = (): JSX.Element => {
  return (
    <motion.div
      aria-label="Transaction processing animation"
      className="relative flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-2xl bg-[#050818] shadow-[0_0_30px_rgba(0,246,255,0.75),inset_0_0_20px_rgba(0,0,0,0.5)]"
      variants={containerVariants as Variants}
      initial="initial"
      animate="animate"
    >
      {/* Light trails orbiting the central shape */}
      {Array.from({ length: ANIMATION_CONFIG.trailCount }).map((_, index) => (
        <motion.div
          key={`trail-${index}`}
          aria-hidden="true"
          className="absolute h-2 w-2 rounded-full bg-[#7a00ff] [filter:drop-shadow(0_0_10px_rgba(122,0,255,0.85))]"
          variants={trailVariants as Variants}
        />
      ))}

      {/* Central morphing shape */}
      <motion.svg
        width="150"
        height="150"
        viewBox="0 0 100 100"
        className="overflow-visible [filter:drop-shadow(0_0_15px_rgba(0,246,255,0.75))]"
        // The SVG itself doesn't need variants as its child path is animated
      >
        <motion.path
          variants={shapeVariants as Variants}
          className="stroke-2 fill-[rgba(0,246,255,0.1)] stroke-[#00f6ff]"
          // The initial state and animation are handled by variants
        />
      </motion.svg>
    </motion.div>
  );
};

/**
 * @description
 * This component wraps the `TransactionVisualizer` with a React Error Boundary.
 * This is the preferred export as it ensures the component is robust and won't
 * crash the entire application if an unexpected rendering error occurs.
 *
 * It follows the principle of creating production-grade, resilient components.
 *
 * @returns {JSX.Element} The TransactionVisualizer component safely wrapped in an ErrorBoundary.
 */
const SafeTransactionVisualizer = (): JSX.Element => (
  <ErrorBoundary FallbackComponent={VisualizationErrorFallback}>
    <TransactionVisualizer />
  </ErrorBoundary>
);

export default SafeTransactionVisualizer;