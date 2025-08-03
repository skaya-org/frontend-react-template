import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// --- CONSTANT DATA ---
// By defining data here, the component remains self-contained and
// does not require any props, adhering to the specified design constraints.

/**
 * @constant LEVEL_NAME
 * @description The name of the current level or tier.
 * @type {string}
 */
const LEVEL_NAME: string = 'Arcane Master';

/**
 * @constant CURRENT_XP
 * @description The current experience points the user has.
 * @type {number}
 */
const CURRENT_XP: number = 820;

/**
 * @constant TOTAL_XP_FOR_LEVEL
 * @description The total experience points required to complete the current level.
 * @type {number}
 */
const TOTAL_XP_FOR_LEVEL: number = 1000;

/**
 * @constant PROGRESS_PERCENTAGE
 * @description The calculated progress percentage.
 * @type {number}
 */
const PROGRESS_PERCENTAGE: number = (CURRENT_XP / TOTAL_XP_FOR_LEVEL) * 100;

/**
 * @constant GLOW_COLOR_START
 * @description The starting color for the glow animation (semi-transparent).
 * @type {string}
 */
const GLOW_COLOR_START: string = 'rgba(138, 43, 226, 0.75)';

/**
 * @constant GLOW_COLOR_END
 * @description The ending color for the glow animation (more intense).
 * @type {string}
 */
const GLOW_COLOR_END: string = 'rgba(138, 43, 226, 0.95)';


// --- ANIMATION VARIANTS ---
// Using Framer Motion's variants for clean and declarative animations.

/**
 * @type {Variants}
 * @description Animation variants for the main container to orchestrate a
 * staggered entrance animation for its children.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

/**
 * @type {Variants}
 * @description Animation variants for child elements (header, progress bar wrapper)
 * to fade and slide in from below.
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

/**
 * @type {Variants}
 * @description Animation variants for the progress bar fill.
 * Controls the width animation from 0% to the target percentage.
 */
const fillVariants: Variants = {
  hidden: {
    width: '0%',
  },
  visible: {
    width: `${PROGRESS_PERCENTAGE}%`,
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

/**
 * @type {Variants}
 * @description Animation variants for the pulsating glow effect.
 * The `boxShadow` property is animated to create a rewarding, dynamic feel.
 */
const glowVariants: Variants = {
  pulse: {
    boxShadow: [
      `0 0 8px 2px ${GLOW_COLOR_START}`,
      `0 0 16px 4px ${GLOW_COLOR_END}`,
      `0 0 8px 2px ${GLOW_COLOR_START}`,
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
    },
  },
};


/**
 * ProgressBar Component
 *
 * @description
 * A self-contained, visually engaging, and animated progress bar.
 * This component represents a static value, such as a user's level progression,
 * and features a rewarding glow animation. It also includes an entrance
 * animation where elements stagger into view.
 *
 * It is designed to be a "drop-in" component with no props, as all data
 * is managed internally via constants, following strict project guidelines.
 *
 * @returns {JSX.Element} The rendered ProgressBar component.
 */
const ProgressBar = (): JSX.Element => {
  return (
    // The main container orchestrates the initial animation sequence.
    <motion.div
      className="w-full max-w-[600px] font-sans p-4 bg-[#1a1a2e] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] text-[#e0e0e0]"
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      {/* The header fades and slides in as part of the stagger sequence. */}
      <motion.header
        className="flex justify-between items-center mb-3 text-[0.9rem]"
        variants={itemVariants as Variants}
      >
        <span className="font-bold tracking-[0.5px] text-white">
          {LEVEL_NAME}
        </span>
        <span className="text-[#a0a0c0] font-light">
          {CURRENT_XP} / {TOTAL_XP_FOR_LEVEL} XP
        </span>
      </motion.header>

      {/* The progress bar container also staggers in. */}
      <motion.div
        className="relative h-3 w-full bg-[#0f0f24] rounded-full overflow-hidden"
        variants={itemVariants as Variants}
      >
        {/* The fill animation starts once its parent becomes "visible". */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#4b0082] to-[#8A2BE2]"
          variants={fillVariants as Variants}
          // `initial` and `animate` are inherited from the parent `motion.div`,
          // creating a clean, cascading animation effect.
        >
          {/* A nested motion.div for the glow allows it to animate independently
              of the bar's width-fill animation, creating a smoother combined effect. */}
          <motion.div
            className="h-full w-full"
            variants={glowVariants as Variants}
            animate="pulse"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProgressBar;