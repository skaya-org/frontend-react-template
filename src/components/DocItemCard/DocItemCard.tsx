import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Import Variants

// Import required components. Per requirements, these components are
// self-fulfilled and will not receive any props or interfaces from DocItemCard.
import CodeBlock from '../CodeBlock/CodeBlock';
import ExampleViewer from '../ExampleViewer/ExampleViewer';
import Button from '../Button/Button';
import Card from '../Card/Card';

// --- Constant Data for DocItemCard ---
// All content displayed by DocItemCard is constant, as per the strict guidelines.
// This ensures the component is self-contained and requires no external props for its content.

/**
 * The constant title for the documentation item.
 * @type {string}
 */
const DOC_ITEM_TITLE: string = 'Interactive UI Component';

/**
 * A detailed constant description of the documentation item.
 * This text is hardcoded within the component.
 * @type {string}
 */
const DOC_ITEM_DESCRIPTION: string = `
  This documentation card presents a versatile and highly interactive UI component,
  designed to enhance user engagement through dynamic animations and a responsive layout.
  It showcases robust component architecture principles, emphasizing reusability,
  accessibility, and maintainability. Its purpose is to provide a clear,
  self-contained example of a production-grade React component adhering to
  modern development standards. The component integrates seamlessly into
  various application contexts due to its encapsulated logic and styling.
  It exemplifies how to achieve a rich user experience while maintaining a
  clean and understandable codebase.
`;

/**
 * An array of constant key features highlighting the documentation item's capabilities.
 * @type {string[]}
 */
const DOC_ITEM_FEATURES: string[] = [
  'Fully self-contained with no external props required for content.',
  'Showcases dynamic UI elements with smooth transitions.',
  'Designed with modern accessibility standards in mind.',
  'Utilizes functional components and React hooks for clean state management.',
  'Modular structure for easy understanding and future extensions.',
];

/**
 * The URL for a random placeholder image, used when an image is needed
 * but not explicitly provided for a sub-component (e.g., if a Card needed an image).
 * Although DocItemCard itself doesn't directly display an image,
 * this constant adheres to the guideline for image usage.
 * @type {string}
 */
const PLACEHOLDER_IMAGE_URL: string = 'https://picsum.photos/400/250.webp';

// --- Component Definition ---

/**
 * DocItemCard React Component
 *
 * A generic card component specifically designed to display a single documentation item,
 * such as a component, hook, or utility. It always presents constant descriptive text,
 * code examples, and live previews.
 *
 * This component is built with strict adherence to the following principles:
 * - **Self-Contained Data:** All content (title, description, features) is hardcoded
 *   within the component using constant variables. No props are accepted to configure content.
 * - **Dependency Integration:** It integrates pre-defined `CodeBlock`, `ExampleViewer`,
 *   `Button`, and `Card` components. Crucially, per requirements, these imported
 *   components are also treated as self-fulfilled and do *not* receive any props
 *   from `DocItemCard`. They are expected to render their own constant data.
 * - **React Best Practices:** Utilizes functional components, `motion` for animations,
 *   and Tailwind CSS for styling.
 * - **Error Boundaries:** This component is designed to be wrapped by a parent
 *   error boundary if error handling for its rendering or its children (`CodeBlock`,
 *   `ExampleViewer`, etc.) is required. It does not contain an internal error boundary
 *   as its primary function is display, not complex state or async operations prone to internal errors.
 *
 * @returns {JSX.Element} The rendered documentation item card.
 */
function DocItemCard(): JSX.Element {
  /**
   * Framer Motion variants for the main card animation.
   * Defines the initial and visible states for a fade-in and slide-up effect.
   * @constant {object}
   */
  const cardAnimationVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  /**
   * Variants for the inner content container (div inside Card).
   * This orchestrates the appearance of major sections (header, features, etc.)
   * by staggering their reveal.
   */
  const contentContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.7, // Delay before children start animating (after card finishes its initial animation)
        staggerChildren: 0.15, // Stagger delay between each main section/header
      },
    },
  };

  /**
   * Generic item variants for elements directly managed by a `staggerChildren` parent.
   * Provides a subtle fade-in and slide-up.
   */
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  /**
   * Specific variants for the main title (h1) in the header.
   * Provides a fade-in and slight vertical shift.
   */
  const h1Variants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  /**
   * Specific variants for the description paragraph (p) in the header.
   * Provides a fade-in and slight vertical shift, with a slight delay after the title.
   */
  const pVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
  };

  return (
    <motion.section
      className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto font-sans text-gray-900 dark:text-gray-100"
      initial="hidden"
      animate="visible"
      variants={cardAnimationVariants as Variants} // Apply as Variants
      aria-labelledby="doc-item-title"
    >
      {/*
        The Card component acts as the structural base.
        Per requirements, it does not receive any props from DocItemCard.
        It is assumed to provide its own constant styling and structure.
      */}
      <Card/>
        <motion.div // This motion.div orchestrates the animations of its immediate children (header, sections, footer)
          className="space-y-8 p-4 sm:p-6 lg:p-8"
          initial="hidden"
          animate="visible"
          variants={contentContainerVariants as Variants}
        >
          {/* Header Section */}
          <motion.header
            className="text-center pb-4 border-b border-gray-200 dark:border-gray-700"
            variants={itemVariants as Variants} // This header section itself is an item in the main stagger
          >
            <motion.h1
              id="doc-item-title"
              className="text-4xl sm:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-4 tracking-tight leading-tight"
              variants={h1Variants as Variants} // Nested animation for h1
            >
              {DOC_ITEM_TITLE}
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto"
              variants={pVariants as Variants} // Nested animation for p
            >
              {DOC_ITEM_DESCRIPTION}
            </motion.p>
          </motion.header>

          {/* Features Section */}
          <motion.section
            className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg shadow-md"
            variants={itemVariants as Variants} // This section is an item in the main stagger
          >
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300 mb-4"
              variants={itemVariants as Variants} // H2 within the section, animates with the section
            >
              Key Features
            </motion.h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 text-lg">
              {/* Keep existing li animation, as it's already using index-based delay */}
              {DOC_ITEM_FEATURES.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                >
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.section>

          {/* Live Preview Section */}
          <motion.section
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
            variants={itemVariants as Variants} // This section is an item in the main stagger
          >
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300 mb-4"
              variants={itemVariants as Variants} // H2 within the section
            >
              Live Preview
            </motion.h2>
            <motion.div
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              variants={itemVariants as Variants} // Div wrapping ExampleViewer, animates with the section
            >
              {/*
                The ExampleViewer component displays a live demonstration.
                Per requirements, it does not receive any props.
              */}
              <ExampleViewer />
            </motion.div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
              * The example above is self-contained and interactive.
            </p>
          </motion.section>

          {/* Code Example Section */}
          <motion.section
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
            variants={itemVariants as Variants} // This section is an item in the main stagger
          >
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300 mb-4"
              variants={itemVariants as Variants} // H2 within the section
            >
              Code Example
            </motion.h2>
            <motion.div
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              variants={itemVariants as Variants} // Div wrapping CodeBlock, animates with the section
            >
              {/*
                The CodeBlock component displays the relevant code snippet.
                Per requirements, it does not receive any props.
              */}
              <CodeBlock />
            </motion.div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
              * The code block above shows a simplified implementation.
            </p>
          </motion.section>

          {/* Action Buttons Section */}
          <motion.footer
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            variants={itemVariants as Variants} // Footer itself is an item in the main stagger
          >
            {/*
              Button components provide interactive elements.
              Per requirements, they do not receive any props and are assumed
              to have their own constant text (e.g., "View Source", "API Docs").
              Each button is wrapped in a motion.div to apply itemVariants for a staggered effect
              when the footer appears.
            */}
            <motion.div variants={itemVariants as Variants}>
              <Button /> {/* Assumed to be "View Source" */}
            </motion.div>
            <motion.div variants={itemVariants as Variants}>
              <Button /> {/* Assumed to be "API Documentation" */}
            </motion.div>
          </motion.footer>
        </motion.div>
    </motion.section>
  );
}

export default DocItemCard;