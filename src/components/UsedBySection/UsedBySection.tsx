import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// --- Type Definitions ---

/**
 * @typedef {object} CompanyLogo
 * @property {string} name - The name of the company, used for the accessibility `aria-label` and React `key`.
 * @property {JSX.Element} svg - The SVG element representing the company logo.
 */
type CompanyLogo = {
  name: string;
  svg: JSX.Element;
};

// --- Constant Data ---

/**
 * An array of company logo data.
 * This constant holds all information required to render the logos, making the component
 * self-contained and eliminating the need for props. The SVGs are designed with `currentColor`
 * to be easily styled through CSS, promoting reusability and maintainability.
 * @const {CompanyLogo[]}
 */
const LOGOS_DATA: CompanyLogo[] = [
  {
    name: 'Innovate Inc.',
    svg: (
      <svg className="h-full w-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L4 24L24 44L44 24L24 4Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M34 14L14 34" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Quantum Solutions',
    svg: (
      <svg className="h-full w-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3"/>
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="3"/>
      </svg>
    ),
  },
  {
    name: 'Apex Enterprises',
    svg: (
      <svg className="h-full w-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 44H44L24 4L4 44Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M14 44L24 24L34 44" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Future Systems',
    svg: (
      <svg className="h-full w-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="3"/>
        <rect x="14" y="14" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="3"/>
      </svg>
    ),
  },
  {
    name: 'Synergy Labs',
    svg: (
      <svg className="h-full w-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M44 4L34 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// --- Motion Variants ---

/**
 * Parent container variants to orchestrate the animations of its children.
 * Staggers the animation of the title and the logo grid.
 * @const {Variants}
 */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

/**
 * Variants for the title animation.
 * Defines a simple slide-in and fade-in effect.
 * @const {Variants}
 */
const titleVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Variants for the grid container to orchestrate the logo animations.
 * Staggers the animation of each logo item.
 * @const {Variants}
 */
const gridContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Framer Motion variants for the logo items.
 * Defines animations for the initial entry and hover states.
 * @const {Variants}
 */
const logoItemVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    y: 0,
    opacity: 0.6,
    scale: 1,
    filter: 'grayscale(100%)',
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.05,
    filter: 'grayscale(0%)',
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};


// --- Component Definition ---

/**
 * Renders a "Trusted By" section featuring a grid of company logos.
 *
 * This component is a production-grade, self-contained unit designed to showcase social proof
 * without external dependencies or props. It follows React best practices, using functional
 * components and a clear, modular structure. All data, including the title and logos, is
 * defined as internal constants, making it a true "drop-in" component.
 *
 * Key Features:
 * - A clean, light background for easy integration into various designs.
 * - A bold, centered title: 'Trusted by many'.
 * - A responsive grid of SVG logos that adapts from 2 to 5 columns.
 * - Interactive hover effects on logos (color restoration and scaling) powered by Framer Motion.
 * - Scroll-triggered, staggered entry animations for the title and logos.
 * - Strong typing with TypeScript for developer confidence and maintainability.
 * - Comprehensive JSDoc for clarity and ease of use.
 *
 * As a purely presentational component with no asynchronous operations, it does not
 * implement its own error boundary. It is intended to be used within an application-level
 * error boundary strategy.
 *
 * @returns {JSX.Element} The fully rendered `UsedBySection` component.
 */
const UsedBySection = (): JSX.Element => {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <motion.div
        className="mx-auto max-w-7xl px-6 lg:px-8"
        variants={containerVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          variants={titleVariants as Variants}
        >
          Trusted by many
        </motion.h2>
        <motion.div
          className="mx-auto mt-16 grid max-w-lg grid-cols-2 items-center justify-items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-5"
          variants={gridContainerVariants as Variants}
        >
          {LOGOS_DATA.map((logo) => (
            <motion.div
              key={logo.name}
              className="col-span-1"
              variants={logoItemVariants as Variants}
              whileHover="hover"
              aria-label={`Logo of ${logo.name}`}
            >
              {/* Container to constrain logo size */}
              <div className="h-12 w-40 text-gray-400">
                {logo.svg}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default UsedBySection;