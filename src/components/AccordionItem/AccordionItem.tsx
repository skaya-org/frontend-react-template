import React, { useState, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

/**
 * @interface AccordionItemProps
 * @property {string} question - The question to be displayed in the accordion header.
 * @property {React.ReactNode} answer - The content to be displayed in the accordion body when expanded.
 */
export interface AccordionItemProps {
  question: string;
  answer: React.ReactNode;
}

// A simple chevron icon component for visual indication.
const ChevronIcon = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// Animation variants for the rotating chevron icon.
const chevronVariants: Variants = {
  open: {
    rotate: 180,
    transition: { duration: 0.3 },
  },
  closed: {
    rotate: 0,
    transition: { duration: 0.3 },
  },
};

// Animation variants for the collapsible body section.
const bodyVariants: Variants = {
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.4,
      ease: [0.04, 0.62, 0.23, 0.98], // A gentle easing curve
    },
  },
  collapsed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.4,
      ease: [0.04, 0.62, 0.23, 0.98],
    },
  },
};

/**
 * AccordionItem is a single collapsible item for an FAQ section.
 * It manages its own open/closed state and provides smooth transitions
 * for the body and a rotating chevron icon to indicate the state.
 *
 * @param {AccordionItemProps} { question, answer }
 * @returns {JSX.Element} The rendered AccordionItem component.
 */
const AccordionItem = ({ question, answer }: AccordionItemProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = (): void => setIsOpen(!isOpen);

  return (
    <div className="border-b border-slate-200 mb-2 overflow-hidden">
      <motion.header
        // initial={false} prevents any animations on the header itself on initial load.
        initial={false}
        onClick={toggleOpen}
        className="flex w-full cursor-pointer select-none items-center justify-between p-4 font-medium"
      >
        {question}
        <motion.div
          className="ml-4"
          variants={chevronVariants as Variants}
          animate={isOpen ? 'open' : 'closed'}
          initial={false}
        >
          <ChevronIcon />
        </motion.div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={bodyVariants as Variants}
          >
            <div className="px-4 pb-4 text-gray-600">
              {answer}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccordionItem;