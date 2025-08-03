import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// --- CONSTANT DATA ---
// As per the requirements, all component data is hardcoded to ensure
// the component is self-contained and does not require props.

/**
 * @constant serviceData
 * @description Contains the static content for the ServiceCard component.
 * This includes the title and description of the laundry service.
 */
const serviceData = {
  title: 'Wash & Fold',
  description: 'Your everyday laundry, expertly washed, dried, and folded. Fresh, clean, and ready for your drawers.',
};


// --- ANIMATION VARIANTS ---

/**
 * @constant cardVariants
 * @description Defines the animation states for the main card container.
 * - `initial`: The card is invisible and slightly shifted down.
 * - `animate`: The card fades in and moves to its final position. It uses `staggerChildren`
 *   to orchestrate the animation of its child elements.
 * - `hover`: A subtle scale and shadow lift effect on mouse-over for interactivity.
 * - `tap`: A slight scale-down effect when the card is clicked or tapped.
 */
const cardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.15, // Creates a sequence effect for child elements
    },
  },
  hover: {
    scale: 1.05,
    // Replicates and enhances the tailwind `shadow-xl` for a smoother animation
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  tap: {
    scale: 0.95,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
};

/**
 * @constant itemVariants
 * @description Defines animation states for the child elements inside the card (icon, title, text).
 * These are orchestrated by the parent's `staggerChildren` property.
 * - `initial`: The item is invisible and shifted down.
 * - `animate`: The item fades and slides up into place.
 */
const itemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};


// --- SVG ICON COMPONENT ---

/**
 * Renders a washing machine SVG icon. This is defined internally
 * to keep the ServiceCard component fully self-contained.
 * @returns {JSX.Element} The SVG icon component.
 */
const WashingMachineIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-12 w-12"
  >
    <path d="M15 21h-6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2Z" />
    <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
    <path d="M12 10v2" />
    <path d="M15 3h.01" />
    <path d="M9 3h.01" />
  </svg>
);


// --- MAIN COMPONENT ---

/**
 * A self-contained, reusable card component for displaying a single laundry service.
 *
 * This component follows a strict "no props" policy by using hardcoded constant data
 * for its content, as per the specified guidelines. It features a representative icon,
 * service name, and a descriptive text. It also includes a subtle hover animation
 * using `framer-motion`.
 *
 * Due to its design, this component is not generic. To display a different service,
 * a new, similar component would be created or this one would be duplicated and modified.
 * An ErrorBoundary is not implemented here as this static component has no complex state
 * or asynchronous operations that are likely to throw runtime errors.
 *
 * @returns {JSX.Element} The rendered ServiceCard component.
 */
const ServiceCard = (): JSX.Element => {
  return (
    <motion.div
      // ClassName is updated to remove hover/active states now handled by Framer Motion
      className="m-4 flex max-w-xs cursor-pointer flex-col items-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-center font-sans shadow-lg"
      variants={cardVariants as Variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
    >
      <motion.div
        className="mb-4 text-blue-500"
        variants={itemVariants as Variants}
      >
        <WashingMachineIcon />
      </motion.div>
      <motion.h3
        className="mb-2 text-xl font-semibold text-gray-800"
        variants={itemVariants as Variants}
      >
        {serviceData.title}
      </motion.h3>
      <motion.p
        className="text-sm leading-relaxed text-gray-500"
        variants={itemVariants as Variants}
      >
        {serviceData.description}
      </motion.p>
    </motion.div>
  );
};

export default ServiceCard;