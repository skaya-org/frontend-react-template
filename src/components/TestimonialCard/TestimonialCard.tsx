import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// --- Type Definitions ---

/**
 * @type {TestimonialData}
 * @description Defines the structure for the testimonial data, including the quote, author's details, and avatar.
 */
type TestimonialData = {
  /** The main quote or testimonial text from the customer. */
  quote: string;
  /** The full name of the customer providing the testimonial. */
  name: string;
  /** The location (e.g., city, company) of the customer. */
  location: string;
  /** The URL for the customer's avatar image. */
  avatarUrl: string;
};

// --- Data Constant ---

/**
 * @const {TestimonialData} TESTIMONIAL_DATA
 * @description Hardcoded constant data for the testimonial.
 * This self-contained approach ensures the component works out-of-the-box without needing props.
 * The avatar URL uses a placeholder service for demonstration.
 */
const TESTIMONIAL_DATA: TestimonialData = {
  quote:
    'This component is a perfect example of clean, self-contained design. The use of hardcoded data makes it incredibly easy to integrate and test. A truly production-grade implementation!',
  name: 'Alex Rivera',
  location: 'Lead Developer, Tech Solutions',
  avatarUrl: `https://i.pravatar.cc/150?u=alex_rivera`,
};

// --- Animation Variants ---

/**
 * @const {Variants} containerVariants
 * @description Defines the animation variants for the main container.
 * It orchestrates the staggered animation of its children.
 */
const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      ease: 'easeOut',
    },
  },
};

/**
 * @const {Variants} itemVariants
 * @description Defines the animation for individual child elements.
 * Each item will fade in and slide up into view.
 */
const itemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// --- Main Component ---

/**
 * A self-contained component to showcase a single customer testimonial.
 *
 * It features a clean design with a customer avatar, quote, name, and location.
 * All data is hardcoded as a constant within this file, eliminating the need for props
 * and making it easily reusable. The component includes a subtle entry animation
 * using `framer-motion` for a polished user experience.
 *
 * @component
 * @example
 * // To use this component, simply import it and render it in your application.
 * // No props are needed.
 * import TestimonialCard from './TestimonialCard';
 *
 * function App() {
 *   return (
 *     <div className="p-5 bg-slate-100">
 *       <TestimonialCard />
 *     </div>
 *   );
 * }
 *
 * @returns {JSX.Element} The rendered testimonial card component.
 */
const TestimonialCard = (): JSX.Element => {
  return (
    <motion.div
      className="relative flex flex-col items-center max-w-2xl p-8 mx-auto my-5 overflow-hidden text-center bg-white border rounded-2xl border-slate-200 text-slate-900 shadow-xl"
      variants={containerVariants as Variants}
      initial="initial"
      animate="animate"
      aria-labelledby="testimonial-author"
      role="figure"
    >
      <motion.span
        className="absolute z-0 text-9xl select-none leading-none -top-2 -left-2 text-slate-100"
        aria-hidden="true"
        variants={itemVariants as Variants}
      >
        &ldquo;
      </motion.span>
      <motion.img
        src={TESTIMONIAL_DATA.avatarUrl}
        alt={`Avatar of ${TESTIMONIAL_DATA.name}`}
        className="relative z-10 w-20 h-20 mb-5 rounded-full object-cover border-4 border-white shadow-md"
        variants={itemVariants as Variants}
      />
      <motion.blockquote
        className="relative z-10 px-5 mb-6 text-lg italic leading-loose text-slate-600"
        variants={itemVariants as Variants}
      >
        <p>{TESTIMONIAL_DATA.quote}</p>
      </motion.blockquote>
      <motion.figcaption
        className="relative z-10 flex flex-col items-center mt-auto"
        variants={itemVariants as Variants}
      >
        <p
          id="testimonial-author"
          className="mb-1 text-base font-semibold text-slate-800"
        >
          {TESTIMONIAL_DATA.name}
        </p>
        <p className="text-sm text-slate-500">{TESTIMONIAL_DATA.location}</p>
      </motion.figcaption>
    </motion.div>
  );
};

export default TestimonialCard;