import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @constant SKILL_PILL_DATA
 * @description Constant data for the SkillPill component.
 * This object holds the static text to be displayed, ensuring the component
 * is self-contained and requires no props, as per the design guidelines.
 */
const SKILL_PILL_DATA: { readonly name: string } = {
  name: 'General Consultation',
};

/**
 * @constant skillPillVariants
 * @description Framer Motion variants for the SkillPill component.
 * Defines animations for the initial render, hover, and tap states.
 * - `initial`: The component starts invisible and slightly shifted down.
 * - `animate`: The component fades in and moves to its final position. This is
 *   designed to work with a parent's `staggerChildren` for list animations.
 * - `hover`: The component scales up and changes background color for feedback.
 * - `tap`: The component scales down slightly when clicked or tapped.
 */
const skillPillVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.05,
    backgroundColor: '#e5e7eb', // Corresponds to Tailwind's gray-200
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.95,
  },
};

/**
 * Renders a small, pill-shaped component to display a single skill or service.
 *
 * This component is designed to be fully self-contained, utilizing hardcoded
 * constant data for its content. It requires no props, simplifying its integration
 * and ensuring consistent presentation. The component includes dynamic animations
 * for render, hover, and tap states for improved interactivity. It is intended
 * for use within a list or grid where multiple skills are displayed, and its
 * entrance animation can be staggered by a parent motion component. Error
 * handling should be implemented by wrapping a collection of these components
 * in a React Error Boundary at a higher level in the component tree.
 *
 * @example
 * // Simply render the component without any props.
 * <SkillPill />
 *
 * @returns {JSX.Element} The rendered SkillPill component.
 */
const SkillPill = (): JSX.Element => {
  return (
    <motion.div
      className="inline-flex items-center whitespace-nowrap py-1.5 px-3.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full border border-gray-200 cursor-default select-none"
      variants={skillPillVariants as Variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      role="listitem" // Semantic role for accessibility within a list
      aria-label={`Skill: ${SKILL_PILL_DATA.name}`}
    >
      {SKILL_PILL_DATA.name}
    </motion.div>
  );
};

export default SkillPill;