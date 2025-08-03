import React, { JSX } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';

/**
 * @file Card.tsx
 * @description A generic, reusable card component that acts as a self-contained container, enhanced with Framer Motion animations.
 * @author Senior Fullstack/TypeScript Developer
 * @version 1.1.0
 */

/**
 * @constant CARD_CONTENT
 * @description Constant data object containing the placeholder content for the Card component.
 * This approach adheres to the guideline of not passing props for content, making the
 * component completely self-sufficient and predictable.
 * @type {{readonly title: string; readonly body: string}}
 */
const CARD_CONTENT = {
  title: 'Placeholder Card Title',
  body: 'This is the body of the card. It contains placeholder text to demonstrate the structure and padding of this reusable container component. The content is static and defined within the component file itself to ensure it is self-sufficient.',
} as const;

/**
 * @constant cardVariants
 * @description Animation variants for the Card component.
 * Defines the 'hidden' (initial) and 'visible' (animate) states for a subtle entrance animation.
 * The animation makes the card fade in and slide up into place.
 * @type {Variants}
 */
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30, // Start 30px below its final position
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// --- Error Handling ---

/**
 * A fallback component to render when the Card encounters an unrecoverable error.
 * This ensures the application does not crash and provides a user-friendly message,
 * adhering to best practices for component-level error handling.
 *
 * @param {FallbackProps} props - Props provided by react-error-boundary, including the error object.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const CardErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div
    className="max-w-md p-8 mx-auto my-6 font-sans text-center text-red-700 bg-red-50 border border-red-400 rounded-xl shadow-lg"
    role="alert"
  >
    <h3 className="mt-0 mb-4 text-2xl font-semibold">Card Error</h3>
    <p className="m-0 text-base leading-relaxed text-red-600">
      An unexpected error occurred while rendering this card.
    </p>
    <pre className="p-2 mt-4 text-sm text-left text-red-900 whitespace-pre-wrap bg-red-100 rounded-md">
      {error.message}
    </pre>
  </div>
);

// --- Main Component ---

/**
 * A generic, reusable card component that acts as a container with a border,
 * shadow, and padding. It is designed to be self-contained, using constant
 * data for its content, thus requiring no props from its parent. This makes it
 * a stable and predictable base for other, more specific card types.
 * The component includes its own error boundary for maximum resilience and
 * features subtle animations for mounting, hover, and tap states.
 *
 * @component
 * @returns {JSX.Element} The rendered Card component wrapped in an ErrorBoundary.
 */
const Card = (): JSX.Element => {
  // The component's display logic is intentionally simple and static,
  // sourcing all its data from the `CARD_CONTENT` constant.
  // This demonstrates a self-sufficient component pattern.
  return (
    <ErrorBoundary FallbackComponent={CardErrorFallback}>
      <motion.div
        className="max-w-md p-8 mx-auto my-6 font-sans bg-white border border-gray-200 rounded-xl shadow-lg cursor-pointer"
        variants={cardVariants as Variants}
        initial="hidden"
        animate="visible"
        whileHover={{
          scale: 1.04,
          boxShadow: '0px 15px 25px -10px rgba(0,0,0,0.1)',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <h2 className="mt-0 mb-4 text-2xl font-semibold text-gray-900">
          {CARD_CONTENT.title}
        </h2>
        <p className="m-0 text-base leading-relaxed text-gray-600">
          {CARD_CONTENT.body}
        </p>
      </motion.div>
    </ErrorBoundary>
  );
};

export default Card;