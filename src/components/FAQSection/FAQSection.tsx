import React, { useState, useCallback, ReactNode, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

//==============================================================================
// INTERFACES
//==============================================================================

/**
 * @interface FAQItemData
 * @description Defines the structure for a single Frequently Asked Question item.
 * This interface is exported so it can be used when preparing data for the FAQSection.
 */
export interface FAQItemData {
  /** 
   * A unique identifier for the FAQ item.
   * Essential for React's reconciliation process and accessibility attributes.
   */
  id: string | number;
  /** 
   * The question content. Can be a simple string or a more complex React node.
   */
  question: ReactNode;
  /** 
   * The answer content. Can be a simple string or a more complex React node.
   */
  answer: ReactNode;
}

/**
 * @interface FAQSectionProps
 * @description Defines the props for the FAQSection component.
 */
export interface FAQSectionProps {
  /** 
   * The main title of the FAQ section.
   */
  title: ReactNode;
  /** 
   * An optional subtitle or introductory text for the FAQ section.
   */
  subtitle?: ReactNode;
  /** 
   * An array of FAQ items to be displayed in the accordion.
   * Each item must conform to the `FAQItemData` interface.
   */
  items: FAQItemData[];
  /**
   * If true, multiple FAQ items can be open simultaneously.
   * @default false
   */
  allowMultipleOpen?: boolean;
  /** 
   * An optional CSS class name to apply to the root section element for custom styling.
   */
  className?: string;
}

/**
 * @interface FAQItemProps
 * @description Defines the props for the internal FAQItem component.
 * @internal
 */
interface FAQItemProps {
  /** The FAQ item data object. */
  item: FAQItemData;
  /** Whether the accordion item is currently expanded. */
  isOpen: boolean;
  /** Callback function to toggle the open/closed state of the item. */
  onToggle: () => void;
}

//==============================================================================
// HELPER & INTERNAL COMPONENTS
//==============================================================================

/**
 * @description A simple fallback component to display when an error occurs within the FAQ section.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} The fallback UI.
 * @internal
 */
const ErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div role="alert" className="p-5 text-red-800 bg-red-100 border border-red-300 rounded-lg">
    <p className="font-bold">FAQ Section Error:</p>
    <p>We're sorry, but this section could not be displayed correctly.</p>
    <pre className="mt-2.5 p-2 bg-red-200 rounded text-sm whitespace-pre-wrap">{error.message}</pre>
  </div>
);

/**
 * @description An animated chevron icon to indicate the open/closed state of an accordion item.
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Determines the rotation of the icon.
 * @returns {JSX.Element} An animated SVG icon.
 * @internal
 */
const ChevronIcon = ({ isOpen }: { isOpen: boolean }): JSX.Element => (
  <motion.div
    animate={{ rotate: isOpen ? 180 : 0 }}
    transition={{ duration: 0.3 }}
    className="ml-4 flex-shrink-0"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </motion.div>
);

/**
 * @description Renders a single accordion item (question and answer).
 * It manages its own animation state based on the `isOpen` prop.
 * @param {FAQItemProps} props - The props for the component.
 * @returns {JSX.Element} A single FAQ item.
 * @internal
 */
const FAQItem = ({ item, isOpen, onToggle }: FAQItemProps): JSX.Element => {
  const contentId = `faq-content-${item.id}`;
  const headerId = `faq-header-${item.id}`;

  return (
    <div className="border-b border-gray-200">
      <h3>
        <button
          id={headerId}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="flex w-full items-center justify-between py-6 text-left text-base font-semibold text-gray-800 transition-colors hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <span className="flex-1 pr-4">{item.question}</span>
          <ChevronIcon isOpen={isOpen} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            id={contentId}
            role="region"
            aria-labelledby={headerId}
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-gray-700 leading-relaxed">{item.answer}</div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

//==============================================================================
// ANIMATION VARIANTS
//==============================================================================

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const headerItemVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};


//==============================================================================
// MAIN COMPONENT
//==============================================================================

/**
 * @component FAQSection
 * @description A fully-featured, accessible, and animated FAQ section component.
 * It displays a list of questions and answers in an accordion format.
 *
 * @param {FAQSectionProps} props - The props for the FAQSection component.
 * @returns {JSX.Element} The rendered FAQSection component.
 */
const FAQSection = ({
  title,
  subtitle,
  items,
  allowMultipleOpen = false,
  className = '',
}: FAQSectionProps): JSX.Element => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  /**
   * Toggles the open state of an accordion item based on its index.
   * The behavior changes based on the `allowMultipleOpen` prop.
   */
  const handleToggle = useCallback((indexToToggle: number) => {
    setOpenIndexes(currentOpenIndexes => {
      const isCurrentlyOpen = currentOpenIndexes.includes(indexToToggle);

      if (allowMultipleOpen) {
        // If multiple are allowed, add or remove the index from the array
        return isCurrentlyOpen
          ? currentOpenIndexes.filter(i => i !== indexToToggle)
          : [...currentOpenIndexes, indexToToggle];
      } else {
        // If only one is allowed, set it to the new index or an empty array
        return isCurrentlyOpen ? [] : [indexToToggle];
      }
    });
  }, [allowMultipleOpen]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <motion.section 
        variants={sectionVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className={`w-full max-w-3xl mx-auto py-12 px-6 font-sans text-gray-900 sm:py-16 lg:py-20 ${className}`} 
        aria-label={typeof title === 'string' ? title : 'Frequently Asked Questions'}
      >
        <motion.div className="text-center" variants={headerItemVariants as Variants}>
            {title && <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-4 text-lg text-gray-600">{subtitle}</p>}
        </motion.div>
        
        {items && items.length > 0 ? (
          <motion.div 
            className="mt-12 border-t border-gray-200"
            variants={listContainerVariants as Variants}
          >
            {items.map((item, index) => (
              <motion.div key={item.id} variants={listItemVariants as Variants}>
                <FAQItem
                  item={item}
                  isOpen={openIndexes.includes(index)}
                  onToggle={() => handleToggle(index)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p 
            variants={headerItemVariants as Variants}
            className="mt-12 text-center text-gray-500"
          >
            No frequently asked questions available at this time.
          </motion.p>
        )}
      </motion.section>
    </ErrorBoundary>
  );
};

export default FAQSection;