import React, { useState, JSX, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import AccordionItem from '../AccordionItem/AccordionItem';
// The AccordionItem is assumed to handle its own internal animations,
// such as chevron rotation, based on the `isOpen` prop.

//==============================================================================
// INTERFACES
//==============================================================================

/**
 * @interface FaqItemData
 * @description Represents the data structure for a single FAQ item.
 * This interface is exported to allow type sharing across components.
 */
export interface FaqItemData {
  /**
   * @property {string} id - A unique identifier for the FAQ item.
   * Essential for React's `key` prop and for managing accordion state.
   */
  id: string;

  /**
   * @property {string} question - The question text for the FAQ item.
   */
  question: string;

  /**
   * @property {ReactNode} answer - The answer content for the FAQ item.
   * Can be a simple string or complex JSX for rich content.
   */
  answer: ReactNode;
}

/**
 * @interface FaqSectionProps
 * @description Defines the props for the FaqSection component.
 * This interface is exported to ensure type-safe usage of the component.
 */
export interface FaqSectionProps {
  /**
   * @property {string} title - The main title for the FAQ section.
   */
  title: string;

  /**
   * @property {string} [subtitle] - An optional subtitle or introductory text for the section.
   */
  subtitle?: string;

  /**
   * @property {FaqItemData[]} items - An array of FAQ items to be displayed in the accordion.
   */
  items: FaqItemData[];

  /**
   * @property {string} [className] - Optional CSS class name for custom styling of the root section element.
   */
  className?: string;

  /**
   * @property {boolean} [allowMultipleOpen=false] - If true, multiple FAQ items can be open simultaneously.
   * If false (default), opening one item will close any other open item.
   */
  allowMultipleOpen?: boolean;
}

//==============================================================================
// HELPER COMPONENTS
//==============================================================================

/**
 * Renders a fallback UI when an error occurs within the FAQ list.
 * @param {FallbackProps} props - Props provided by React Error Boundary, including the error object.
 * @returns {JSX.Element} The fallback UI component.
 */
const FaqListErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div role="alert" className="p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
    <p className="font-medium">Sorry, we couldn't load the FAQ content.</p>
    <pre className="mt-2 text-xs whitespace-pre-wrap">{error.message}</pre>
  </div>
);

//==============================================================================
// MAIN COMPONENT
//==============================================================================

/**
 * @component FaqSection
 * @description A flexible and accessible FAQ accordion section.
 * It displays a list of questions and answers, allowing users to expand and collapse items.
 *
 * @param {FaqSectionProps} props - The props for the component.
 * @returns {JSX.Element} The rendered FAQ section.
 *
 * @example
 * const faqs = [
 *   { id: 'faq1', question: 'What is React?', answer: 'A JavaScript library for building user interfaces.' },
 *   { id: 'faq2', question: 'What is TypeScript?', answer: <p>A superset of JavaScript that adds static types.</p> }
 * ];
 *
 * <FaqSection title="Frequently Asked Questions" items={faqs} />
 */
const FaqSection = ({
  title,
  subtitle,
  items,
  className = '',
  allowMultipleOpen = false
}: FaqSectionProps): JSX.Element => {
  // State to manage which accordion items are expanded.
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // --- Animation Variants ---
  /**
   * Variants for container elements to orchestrate staggered animations for their children.
   */
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  /**
   * Variants for individual items (like titles or FAQ rows) to fade in and slide up.
   */
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  /**
   * Variants for the accordion content panel to animate its height and opacity.
   */
  const contentVariants: Variants = {
    collapsed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
    },
    expanded: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
    },
  };

  /**
   * Toggles the expanded state of a given FAQ item.
   * @param {string} id - The ID of the FAQ item to toggle.
   */
  const handleToggle = (id: string): void => {
    setExpandedIds(currentIds => {
      const isCurrentlyExpanded = currentIds.includes(id);

      if (allowMultipleOpen) {
        // Add or remove the ID from the array
        return isCurrentlyExpanded
          ? currentIds.filter(itemId => itemId !== id)
          : [...currentIds, id];
      } else {
        // If it's already open, close it. Otherwise, open it and close others.
        return isCurrentlyExpanded ? [] : [id];
      }
    });
  };

  return (
    <section
      className={`bg-slate-50 py-16 sm:py-24 overflow-hidden ${className}`}
      aria-labelledby="faq-section-title"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          variants={containerVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            id="faq-section-title"
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            variants={itemVariants as Variants}
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              className="mt-4 text-lg leading-8 text-slate-600"
              variants={itemVariants as Variants}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>

        <ErrorBoundary FallbackComponent={FaqListErrorFallback}>
          {!items || items.length === 0 ? (
            <p className="mt-16 text-center text-slate-600">No frequently asked questions available at the moment.</p>
          ) : (
            <motion.div
              className="mt-12 space-y-4"
              variants={containerVariants as Variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {items.map(({ id, question, answer }) => {
                const isExpanded = expandedIds.includes(id);

                return (
                  <motion.div
                    key={id}
                    variants={itemVariants as Variants}
                    className="rounded-lg border border-slate-200 bg-white shadow-sm"
                  >
             
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default FaqSection;