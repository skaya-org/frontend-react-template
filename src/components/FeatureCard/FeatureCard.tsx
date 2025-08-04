import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @const {JSX.Element} ICON_SVG
 * @description A constant holding the SVG icon for the feature card.
 * This SVG is styled with Tailwind CSS classes.
 */
const ICON_SVG: JSX.Element = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-sky-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <title>Feature Icon</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9 9 0 100-18 9 9 0 000 18z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 12a3 3 0 100-6 3 3 0 000 6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 12c-3.31 0-6 1.34-6 3s2.69 3 6 3 6-1.34 6-3-2.69-3-6-3z"
      transform="rotate(60 12 12)"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 12c-3.31 0-6 1.34-6 3s2.69 3 6 3 6-1.34 6-3-2.69-3-6-3z"
      transform="rotate(-60 12 12)"
    />
  </svg>
);

/**
 * @const {string} FEATURE_TITLE
 * @description The title text for the feature card.
 */
const FEATURE_TITLE: string = 'Powered by React';

/**
 * @const {string} FEATURE_DESCRIPTION
 * @description The descriptive text for the feature card.
 */
const FEATURE_DESCRIPTION: string =
  'Extend or customize your website layout by reusing React components for a consistent, modular, and highly maintainable design system.';

/**
 * @namespace FeatureCard
 * @description A self-contained card component to display a single, static feature.
 * It strictly adheres to a "no-props" policy, with all content—icon, title,
 * and description—hardcoded as constants within the component file. This design
 * ensures predictability and reusability in static contexts without needing
 * data passed from parent components.
 *
 * The card features a clean, modern aesthetic with a light gray background,
 * rounded corners, and a subtle box-shadow that enhances on hover.
 * It leverages `framer-motion` for a smooth hover animation and an orchestrated
 * entrance animation for its content.
 *
 * @component
 * @returns {JSX.Element} The rendered FeatureCard component.
 *
 * @example
 * // This component requires no props and can be used directly.
 * import FeatureCard from './FeatureCard';
 *
 * function App() {
 *   return (
 *     <main className="flex min-h-screen items-center justify-center bg-white p-4">
 *       <FeatureCard />
 *     </main>
 *   );
 * }
 */
const FeatureCard = (): JSX.Element => {
  /**
   * @const {Variants} cardVariants
   * @description Animation variants for the main card container.
   * - `offscreen`: The initial state of the card before it enters the viewport.
   * - `onscreen`: The state of the card when it is visible in the viewport, triggering a staggered animation for its children.
   * - `hover`: The state of the card when the user hovers over it, causing it to lift and gain a more prominent shadow.
   */
  const cardVariants: Variants = {
    offscreen: {
      opacity: 0,
      y: 20,
    },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
        staggerChildren: 0.1, // Stagger children animations by 0.1s
      },
    },
    hover: {
      y: -5,
      boxShadow:
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // Corresponds to shadow-lg
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  /**
   * @const {Variants} itemVariants
   * @description Animation variants for the child elements inside the card (icon, title, description).
   * - `offscreen`: The initial, hidden state of the item.
   * - `onscreen`: The final, visible state of the item, animated with a spring effect.
   */
  const itemVariants: Variants = {
    offscreen: {
      opacity: 0,
      y: 15,
    },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="max-w-xs rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm"
      aria-labelledby="feature-title"
      aria-describedby="feature-description"
      variants={cardVariants as Variants}
      initial="offscreen"
      whileInView="onscreen"
      whileHover="hover"
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="flex flex-col items-start space-y-4">
        {/* Icon Container */}
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100"
          variants={itemVariants as Variants}
        >
          {ICON_SVG}
        </motion.div>

        {/* Text Content */}
        <div className="flex flex-col">
          <motion.h3
            id="feature-title"
            className="text-lg font-semibold text-gray-900"
            variants={itemVariants as Variants}
          >
            {FEATURE_TITLE}
          </motion.h3>
          <motion.p
            id="feature-description"
            className="mt-1 text-base font-normal text-gray-600"
            variants={itemVariants as Variants}
          >
            {FEATURE_DESCRIPTION}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;