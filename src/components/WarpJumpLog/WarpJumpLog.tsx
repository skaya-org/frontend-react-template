import React, { JSX, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';
import WarpJumpLogItem from '../WarpJumpLogItem/WarpJumpLogItem';

/**
 * @file WarpJumpLog.tsx
 * @description A component that displays a list of recent "Warp Jumps" (trades).
 * This component acts as a container and adheres to the strict architectural
 * principle of not receiving props, instead relying on internal constant data.
 */

// #region Constants
/**
 * The number of log entries to display.
 * @constant {number}
 */
const LOG_ENTRIES_COUNT = 7;

/**
 * An array generated to provide stable keys for list rendering.
 * @constant {number[]}
 */
const logEntryKeys = Array.from({ length: LOG_ENTRIES_COUNT }, (_, i) => i);
// #endregion

// #region Animation Variants
/**
 * Framer Motion variants for the main container element.
 * Controls the appearance of the component and orchestrates child animations.
 * @type {Variants}
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      delayChildren: 0.2,
      staggerChildren: 0.08,
    },
  },
};

/**
 * Framer Motion variants for each list item.
 * Creates a staggered fade-in and slide-up effect for each log entry.
 * @type {Variants}
 */
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
};
// #endregion

// #region Error Fallback Component
/**
 * A fallback component to be rendered by the ErrorBoundary if a critical
 * error occurs within the WarpJumpLog's child components.
 * @returns {JSX.Element} The error fallback UI.
 */
const LogErrorFallback = (): JSX.Element => (
  <div className="rounded-lg border border-[#FF3B3B] bg-[#2D0B0B] p-5 text-[#FF7B7B]">
    <h3 className="m-0 text-[#FFC1C1]">Log System Failure</h3>
    <p>Could not display recent warp jump history.</p>
  </div>
);
// #endregion

/**
 * `WarpJumpLog` is a sidebar component that displays a history of trade events,
 * styled as a futuristic "Warp Jump" log.
 *
 * It operates as a self-contained unit, requiring no props from its parent.
 * This component is designed to be a container, rendering a static list of
 * `WarpJumpLogItem` components. The number of items is determined by an internal
 * constant, adhering to the project's strict data flow guidelines.
 *
 * @component
 * @returns {JSX.Element} The rendered WarpJumpLog component.
 */
const WarpJumpLog = (): JSX.Element => {
  return (
    <ErrorBoundary FallbackComponent={LogErrorFallback}>
      <motion.aside
        className="flex h-full w-[320px] flex-col overflow-hidden border-l border-l-[#2a3b5e] bg-[#0a0f18] p-5 font-sans text-gray-200"
        variants={containerVariants as Variants}
        initial="hidden"
        animate="visible"
        aria-labelledby="warp-log-title"
      >
        <div className="mb-4 border-b border-b-[#2a3b5e] pb-4">
          <h2
            id="warp-log-title"
            className="m-0 text-2xl font-semibold uppercase tracking-[1px] text-white"
          >
            Warp Jump Log
          </h2>
        </div>
        {/* The <ul> also uses containerVariants to orchestrate its children (the <li>s) */}
        <motion.ul
          className="m-0 flex-grow list-none overflow-y-auto p-0"
          variants={containerVariants as Variants}
          aria-label="List of recent warp jumps"
        >
          {logEntryKeys.map((key) => (
            <motion.li
              key={key}
              className="mb-3"
              variants={itemVariants as Variants}
            >
              {/* WarpJumpLogItem is self-contained and manages its own data/state */}
              <WarpJumpLogItem />
            </motion.li>
          ))}
        </motion.ul>
      </motion.aside>
    </ErrorBoundary>
  );
};

export default memo(WarpJumpLog);