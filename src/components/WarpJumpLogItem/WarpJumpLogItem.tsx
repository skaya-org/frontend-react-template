import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @description Constant data for the WarpJumpLogItem component.
 * This object holds all the static information for a single log entry.
 * By defining data internally, the component becomes self-contained and
 * eliminates the need for props, simplifying its integration.
 */
const WARP_JUMP_LOG_DATA = {
  transactionType: 'Warp Jump',
  amount: 0.5,
  fromCurrency: 'ETH',
  toCurrency: 'BTC',
  stardate: '2024.10.26',
};

/**
 * @description Framer Motion variants for the log item animations.
 * This object defines the different animation states for the component:
 * - `hidden`: The initial state before the component is visible (off-screen and transparent).
 * - `visible`: The state when the component animates into view.
 * - `hover`: The state when the user's cursor is over the component, providing interactive feedback.
 * - `tap`: The state when the user clicks or taps on the component.
 */
const logItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.02,
    borderLeftColor: 'rgb(255, 255, 255)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.98,
  },
};

/**
 * Renders a single, static trade history entry styled as a futuristic "Warp Jump" log.
 *
 * This is a purely presentational component that encapsulates its own data,
 * defined in the `WARP_JUMP_LOG_DATA` constant. It does not accept any props,
 * making it a simple, "drop-in" UI element. The component is designed to be
 * used within a list structure (e.g., `<ul>`) and includes a subtle entry
 * animation using `framer-motion`.
 *
 * Its self-contained nature ensures consistency and reduces the burden on parent
 * components, aligning with clean code principles.
 *
 * @component
 * @returns {JSX.Element} The rendered `WarpJumpLogItem` component.
 *
 * @example
 * // This component is intended to be used within a list wrapper.
 * <ul className="p-0">
 *   <WarpJumpLogItem />
 *   <WarpJumpLogItem />
 * </ul>
 */
const WarpJumpLogItem = (): JSX.Element => {
  // Construct the log message from the internal constant data.
  const logMessage = `${WARP_JUMP_LOG_DATA.transactionType}: ${WARP_JUMP_LOG_DATA.amount} ${WARP_JUMP_LOG_DATA.fromCurrency} to ${WARP_JUMP_LOG_DATA.toCurrency} | Stardate: ${WARP_JUMP_LOG_DATA.stardate}`;

  return (
    <motion.li
      className="list-none mb-3 rounded border-l-[3px] border-l-[#64ffda] bg-[rgba(10,25,47,0.85)] px-6 py-4 font-mono text-[0.9rem] leading-normal tracking-wider text-[#ccd6f6] shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
      aria-label={`Trade log entry: ${logMessage}`}
      variants={logItemVariants as Variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      <p className="m-0 p-0">{logMessage}</p>
    </motion.li>
  );
};

export default WarpJumpLogItem;