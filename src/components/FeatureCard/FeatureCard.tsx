import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @file Represents a self-contained feature card component.
 * @summary This component displays a single, static feature, including an icon, heading, and description.
 * It is designed to be fully independent, requiring no props, with all its content managed internally.
 * This version includes Framer Motion animations for an enhanced user experience.
 * @version 1.2.0
 * @author Senior Fullstack/TypeScript Developer
 */

// #region --- Data and Configuration ---

/**
 * Defines the static content for the FeatureCard.
 * In a real-world application, this might come from a CMS or a central configuration file,
 * but for this self-contained component, it's defined directly.
 * @constant
 * @type {object}
 * @property {JSX.Element} icon - The SVG icon for the feature.
 * @property {string} heading - The main title of the feature.
 * @property {string} description - A brief explanation of the feature.
 */
const FEATURE_DATA: {
  icon: JSX.Element;
  heading: string;
  description: string;
} = {
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-12 w-12"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  heading: 'Enterprise-Grade Security',
  description:
    'Our platform is built with robust security features to protect your data and ensure compliance, providing peace of mind for your entire organization.',
};

// #endregion

// #region --- Animation Variants ---

/**
 * Framer Motion variants for the main card container.
 * Controls the "enter" animation (fade-in and slide-up) and a hover effect.
 * The `animate` state uses `staggerChildren` to create a sequential animation for the card's content.
 */
const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.2,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // Tailwind's shadow-xl
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

/**
 * Framer Motion variants for the child elements (icon, heading, description).
 * Creates a subtle fade-in and slide-up effect, orchestrated by the parent's `staggerChildren` property.
 */
const itemVariants: Variants = {
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

// #endregion

// #region --- Main Component ---

/**
 * Renders a card to display a single, pre-defined feature or service.
 *
 * This component is entirely self-sufficient and does not accept any props. It encapsulates
 * its own data, styling, and logic, making it a "drop-in" UI element. This design choice
 * ensures consistency wherever the card is used. The component animates into view and
 * features a subtle hover effect using Framer Motion for enhanced user interaction.
 *
 * @component
 * @returns {JSX.Element} The rendered FeatureCard component.
 */
const FeatureCard = (): JSX.Element => {
  const { icon, heading, description } = FEATURE_DATA;

  return (
    <motion.div
      variants={cardVariants as Variants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true, amount: 0.8 }}
      className="
        max-w-sm cursor-pointer rounded-xl border border-slate-200 
        bg-white p-8 text-center font-sans shadow-lg
      "
    >
      <motion.div
        variants={itemVariants as Variants}
        className="mb-6 flex items-center justify-center text-sky-500"
      >
        {icon}
      </motion.div>
      <motion.h3
        variants={itemVariants as Variants}
        className="mb-3 text-2xl font-semibold text-slate-800"
      >
        {heading}
      </motion.h3>
      <motion.p
        variants={itemVariants as Variants}
        className="text-base leading-relaxed text-slate-600"
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

export default FeatureCard;

// #endregion