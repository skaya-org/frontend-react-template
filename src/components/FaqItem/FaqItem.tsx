import React, { useState, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- Motion Version ---
// "motion": "12.23.12"

// --- Constants ---

/**
 * @constant FAQ_QUESTION
 * @description The question text for the FAQ item. This is stored as a constant
 * to ensure the component is self-contained and does not require props.
 */
const FAQ_QUESTION: string = 'What is the "One-Component, One-File" principle?';

/**
 * @constant FAQ_ANSWER
 * @description The answer text for the FAQ item. This is also a constant
 * to maintain the component's encapsulation.
 */
const FAQ_ANSWER: string =
  'The "One-Component, One-File" principle advocates for creating components that are entirely self-sufficient. This means all related logic, data, and even styles are contained within the component\'s file. It enhances modularity, simplifies maintenance, and improves reusability by eliminating the need for prop drilling for static content. This FaqItem is an example of that principle.';

// --- Animation Variants ---

/**
 * @description Animation variants for the entire FAQ item container.
 * This creates a subtle entrance animation when the component mounts.
 */
const containerVariants: Variants = {
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
};

/**
 * @description Animation variants for the chevron icon's rotation.
 * This cleanly separates the animation logic from the component's JSX.
 */
const iconVariants: Variants = {
  closed: {
    rotate: 0,
    transition: { duration: 0.2 },
  },
  open: {
    rotate: 90,
    transition: { duration: 0.2 },
  },
};

/**
 * @description Animation variants for the answer panel's entrance and exit.
 * This object is used by `framer-motion` to create a smooth accordion effect.
 */
const answerVariants: Variants = {
  collapsed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: [0.04, 0.62, 0.23, 0.98], // A smooth easing curve
    },
  },
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.4,
      ease: [0.04, 0.62, 0.23, 0.98],
    },
  },
};

/**
 * @component FaqItem
 * @description An individual, self-contained, and collapsible FAQ item.
 *
 * This component demonstrates a production-grade implementation following strict guidelines.
 * It encapsulates its own state and content (question and answer), requiring no props from a parent.
 * It features a smooth expand/collapse animation using `framer-motion` and prioritizes
 * accessibility with semantic HTML and ARIA attributes.
 *
 * @example
 * // To use this component, simply import and render it.
 * // No props are needed.
 * import FaqItem from './components/FaqItem';
 *
 * const App = () => (
 *   <div>
 *     <h1>Frequently Asked Questions</h1>
 *     <FaqItem />
 *   </div>
 * );
 *
 * @returns {JSX.Element} The rendered FaqItem component.
 */
const FaqItem = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /**
   * @function toggleOpen
   * @description Toggles the `isOpen` state to show or hide the answer.
   */
  const toggleOpen = (): void => {
    setIsOpen(prev => !prev);
  };

  const answerId = 'faq-answer-1'; // Static ID for ARIA controls

  return (
    <motion.div
      variants={containerVariants as Variants}
      initial="initial"
      animate="animate"
      className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4 font-sans mb-3"
    >
      <h3 className="m-0">
        <button
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-controls={answerId}
          className="flex w-full cursor-pointer items-center justify-between bg-transparent text-left text-base font-semibold text-gray-800"
        >
          <span className="mr-4">{FAQ_QUESTION}</span>
          <span className="flex flex-shrink-0 items-center justify-center">
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              variants={iconVariants as Variants}
              animate={isOpen ? 'open' : 'closed'}
              initial="closed"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            id={answerId}
            key="faq-content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={answerVariants as Variants}
            role="region" // Accessibility: defines the content as a landmark region
          >
            <div className="pt-4 text-sm leading-relaxed text-gray-600">
              {FAQ_ANSWER}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FaqItem;