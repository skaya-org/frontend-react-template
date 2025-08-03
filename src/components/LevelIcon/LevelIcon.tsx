import React, { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

// --- Constants ---

/**
 * @typedef LevelData
 * @description Defines the structure for the constant data representing the level.
 * @property {number} levelNumber - The number of the level.
 * @property {string} path - The navigation path for this level.
 * @property {number} stars - The number of stars achieved (out of 3).
 */
type LevelData = {
  levelNumber: number;
  path: string;
  stars: number;
};

/**
 * @const LEVEL_DATA
 * @description Hardcoded constant data for the LevelIcon component.
 * This self-contained data eliminates the need for props, making the component
 * autonomous and easy to use in a static context.
 */
const LEVEL_DATA: LevelData = {
  levelNumber: 1,
  path: '/level/1',
  stars: 2,
};

const MAX_STARS = 3;

// --- Animation Variants ---

/**
 * @const containerVariants
 * @description Variants for the main card container. Handles mount animation,
 * content staggering, and interactive hover/tap states.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
      staggerChildren: 0.2,
    },
  },
  hover: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 300, damping: 10 },
  },
  tap: {
    scale: 0.95,
  },
};

/**
 * @const itemVariants
 * @description Variants for child elements within the card, like the level text
 * and the star rating container. They fade and slide in.
 */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

/**
 * @const starRatingContainerVariants
 * @description Orchestrates the staggering animation for individual stars.
 */
const starRatingContainerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  // 'hidden' state is inherited from the parent animator
};

/**
 * @const starVariants
 * @description Defines the animation for each individual star, making them
 * pop into view with a spring effect.
 */
const starVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 12,
    },
  },
};

// --- Helper Components ---

/**
 * @typedef StarProps
 * @description Props for the Star component.
 * @property {boolean} filled - Whether the star should be filled or empty.
 */
type StarProps = {
  filled: boolean;
};

/**
 * Renders a single star SVG icon.
 * @param {StarProps} props - The props for the component.
 * @returns {JSX.Element} A single star SVG element.
 */
const Star = ({ filled }: StarProps): JSX.Element => {
  return (
    <svg
      className={`h-6 w-6 ${
        filled
          ? 'fill-[#ffd700] drop-shadow-[0_0_5px_#ffd700]'
          : 'fill-[#4a4a6a]'
      }`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 4.517 1.48-8.279L0 9.306l8.332-1.151L12 .587z" />
    </svg>
  );
};

/**
 * Renders a star rating based on the hardcoded LEVEL_DATA.
 * Each star is individually animated on mount.
 * @returns {JSX.Element} A container with the animated star rating.
 */
const StarRating = (): JSX.Element => (
  <motion.div
    className="flex gap-2"
    variants={starRatingContainerVariants as Variants}
    // `initial` and `animate` props are automatically propagated
    // from the parent motion component in LevelIcon.
  >
    {Array.from({ length: MAX_STARS }, (_, index) => (
      <motion.div key={index} variants={starVariants as Variants}>
        <Star filled={index < LEVEL_DATA.stars} />
      </motion.div>
    ))}
  </motion.div>
);

// --- Main Component ---

/**
 * LevelIcon Component
 *
 * A self-contained, clickable card that represents a game level.
 * It displays a static level number and a star rating based on hardcoded data,
 * eliminating the need for any props. The component features a vibrant neon border
 * and handles its own navigation logic using `react-router-dom`.
 *
 * This component is designed to be easily dropped into any part of an application
 * where a static level selection is needed, without requiring data flow from parent components.
 * It is fully accessible and includes interactive animations.
 *
 * @returns {JSX.Element} The rendered LevelIcon component.
 */
const LevelIcon = (): JSX.Element => {
  const navigate = useNavigate();

  /**
   * Handles the click event on the component.
   * Navigates to the path defined in the constant LEVEL_DATA.
   */
  const handleNavigate = (): void => {
    navigate(LEVEL_DATA.path);
  };

  return (
    <motion.div
      className="relative flex h-[220px] w-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-[#00f6ff] bg-[#1a1a2e] p-5 font-sans text-[#e0e0e0]"
      onClick={handleNavigate}
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      aria-label={`Navigate to Level ${LEVEL_DATA.levelNumber}`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_5px_#00f6ff,0_0_15px_#00f6ff,0_0_25px_#00f6ff,inset_0_0_10px_#00f6ff]"
        aria-hidden="true"
      />

      <motion.div
        className="mb-4 select-none text-5xl font-bold [text-shadow:0_0_5px_#ffffff,0_0_10px_#00f6ff]"
        variants={itemVariants as Variants}
      >
        {`Level ${LEVEL_DATA.levelNumber}`}
      </motion.div>
      <motion.div variants={itemVariants as Variants}>
        <StarRating />
      </motion.div>
    </motion.div>
  );
};

export default LevelIcon;