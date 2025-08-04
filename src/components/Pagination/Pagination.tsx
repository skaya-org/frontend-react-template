import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @type {ArticleLinkData}
 * @description Defines the structure for the static article link data.
 * This ensures type safety for our constant data.
 */
type ArticleLinkData = {
  /** The title of the article to be displayed. */
  title: string;
  /** The URL slug for the article link. */
  href: string;
};

/**
 * @const {ArticleLinkData} PREVIOUS_ARTICLE_DATA
 * @description Static data for the 'Previous' article link. In a real application,
 * this data would likely be derived from a router or state management, but
 * per requirements, it is defined as a constant here.
 */
const PREVIOUS_ARTICLE_DATA: ArticleLinkData = {
  title: 'Getting Started with Modern CSS',
  href: '#prev-article', // Using '#' as a placeholder for a static component
};

/**
 * @const {ArticleLinkData} NEXT_ARTICLE_DATA
 * @description Static data for the 'Next' article link.
 */
const NEXT_ARTICLE_DATA: ArticleLinkData = {
  title: 'A Deep Dive into Server Components',
  href: '#next-article',
};

/**
 * @component LeftArrowIcon
 * @description A self-contained SVG component for the left arrow icon.
 * Note: The 'group-hover' class has been removed to allow Framer Motion to handle the animation.
 * @returns {JSX.Element} The rendered SVG icon.
 */
const LeftArrowIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

/**
 * @component RightArrowIcon
 * @description A self-contained SVG component for the right arrow icon.
 * Note: The 'group-hover' class has been removed to allow Framer Motion to handle the animation.
 * @returns {JSX.Element} The rendered SVG icon.
 */
const RightArrowIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

/**
 * @component Pagination
 * @description A navigation component for moving between previous and next articles.
 * This component is fully self-contained and uses static constant data,
 * requiring no props to be passed from parent components. It features styled,
 * animated links for a modern user experience.
 *
 * @example
 * // To use this component, simply import and render it.
 * import Pagination from './Pagination';
 *
 * const MyPage = () => (
 *   <div>
 *     <article>...</article>
 *     <Pagination />
 *   </div>
 * );
 *
 * @returns {JSX.Element} The rendered pagination component.
 */
const Pagination = (): JSX.Element => {
  /**
   * @const {Variants} containerVariants
   * @description Animation variants for the main navigation container.
   * Controls the staggered animation of its children.
   */
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  /**
   * @const {Variants} itemVariants
   * @description Animation variants for the individual link items.
   * Includes initial state, visible state, and hover/tap interactions.
   */
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
    hover: {
      scale: 1.02,
      transition: { type: 'spring', stiffness: 300 },
    },
    tap: {
      scale: 0.98,
    },
  };

  /**
   * @const {Variants} iconVariants
   * @description Animation variants for the arrow icons. They react to the parent's hover state.
   */
  const leftIconVariants: Variants = {
    hover: { x: -4 },
  };

  const rightIconVariants: Variants = {
    hover: { x: 4 },
  };

  return (
    <motion.nav
      aria-label="Article navigation"
      className="mt-16 w-full border-t border-gray-200 pt-8 dark:border-gray-700"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Previous Article Link */}
        <motion.a
          href={PREVIOUS_ARTICLE_DATA.href}
          className="group flex items-center gap-4 rounded-lg border border-gray-300 p-4 text-gray-700 transition-colors duration-300 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
          variants={itemVariants as Variants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.div variants={leftIconVariants as Variants}>
            <LeftArrowIcon />
          </motion.div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Previous</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {PREVIOUS_ARTICLE_DATA.title}
            </span>
          </div>
        </motion.a>

        {/* Next Article Link */}
        <motion.a
          href={NEXT_ARTICLE_DATA.href}
          className="group flex items-center justify-end gap-4 rounded-lg border border-gray-300 p-4 text-gray-700 transition-colors duration-300 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
          variants={itemVariants as Variants}
          whileHover="hover"
          whileTap="tap"
        >
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Next</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {NEXT_ARTICLE_DATA.title}
            </span>
          </div>
          <motion.div variants={rightIconVariants as Variants}>
            <RightArrowIcon />
          </motion.div>
        </motion.a>
      </div>
    </motion.nav>
  );
};

export default Pagination;