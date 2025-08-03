import React, { JSX } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';

// --- CONSTANT DATA ---

/**
 * @constant BADGE_DATA
 * @description Contains the static data for the achievement badge.
 * This includes the image URL, alt text, and the title.
 * Using a constant object ensures that this component is self-contained and
 * does not require props, promoting reusability and predictability.
 */
const BADGE_DATA = {
  imageUrl: 'https://picsum.photos/seed/research-ninja/128/128.webp',
  imageAlt: 'A circular badge icon representing the Research Ninja achievement.',
  title: 'Research Ninja',
};

// --- ANIMATION VARIANTS ---

/**
 * @description Variants for the main container. It fades and scales in,
 * and orchestrates the staggering animation of its children.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: 0.15, // Creates a sequence effect for children
    },
  },
};

/**
 * @description Variants for the badge image. It pops in with a spring effect.
 */
const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 15,
    },
  },
};

/**
 * @description Variants for the badge title. It fades and slides up.
 */
const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'circOut',
    },
  },
};

// --- ERROR HANDLING ---

/**
 * @component ErrorFallback
 * @description A minimal fallback UI to display if the Badge component encounters a rendering error.
 * This ensures that a failure in this component does not crash the entire application.
 * @param {FallbackProps} props - Props provided by react-error-boundary, including the caught error.
 * @returns {JSX.Element} The rendered error fallback UI.
 */
const ErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div
    className="flex h-[182px] w-[150px] flex-col items-center justify-center rounded-xl border border-dashed border-red-500 bg-red-50 p-4 font-sans text-red-500"
    role="alert"
  >
    <div className="text-2xl">⚠️</div>
    <p className="mt-2 text-sm">Badge Failed</p>
    {/* In a real app, we might log the error here: console.error(error.message) */}
  </div>
);

// --- MAIN COMPONENT ---

/**
 * @component Badge
 * @description A self-contained component to display a single, unlocked achievement badge.
 * It is built with static, predefined data ('Research Ninja') for the image and title,
 * requiring no props from its parent. This approach ensures maximum encapsulation
 * and predictability. The component is wrapped in an ErrorBoundary to handle
 * potential rendering errors gracefully.
 *
 * It features a choreographed mount animation where the container, image, and
 * text appear in sequence. A subtle hover effect provides interactive feedback.
 *
 * @returns {JSX.Element} The rendered and animated achievement badge component.
 */
const Badge = (): JSX.Element => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <motion.div
        className="flex w-[150px] flex-col items-center justify-center gap-3 rounded-xl bg-gray-50 p-4 text-center font-sans shadow-md"
        variants={containerVariants as Variants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.05, y: -8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <motion.img
          src={BADGE_DATA.imageUrl}
          alt={BADGE_DATA.imageAlt}
          className="h-20 w-20 rounded-full border-[3px] border-gray-200 object-cover"
          width="80"
          height="80"
          loading="lazy"
          variants={imageVariants as Variants}
        />
        <motion.p
          className="m-0 whitespace-nowrap text-base font-semibold text-gray-800"
          variants={textVariants as Variants}
        >
          {BADGE_DATA.title}
        </motion.p>
      </motion.div>
    </ErrorBoundary>
  );
};

export default Badge;