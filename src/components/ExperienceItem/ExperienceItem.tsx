import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @file Represents a single, self-contained experience entry.
 * @author Senior Fullstack/TypeScript Developer
 * @version 1.1.0
 */

/**
 * @type {ExperienceData}
 * @description Defines the shape for a single experience entry's data.
 * This structure holds all necessary information to render the component.
 */
type ExperienceData = {
  /** The name of the department or the title of the position. */
  department: string;
  /** A detailed description of the role, responsibilities, and achievements. */
  description: string;
  /** The time period spent in the role, e.g., "Jan 2022 - Present". */
  duration: string;
};

/**
 * @const {ExperienceData} experienceData
 * @description The static, hardcoded data for the experience item.
 * This component is designed to be self-contained and does not accept props
 * for its content, ensuring consistent presentation wherever it's used.
 */
const experienceData: ExperienceData = {
  department: 'Digital Solutions & Innovation',
  description:
    'Architected and delivered a high-performance, scalable e-commerce platform using a micro-frontend architecture. Championed best practices in code quality, CI/CD pipelines, and automated testing, which reduced bug reports by 40% and improved deployment frequency by 2x. Mentored junior developers and established a culture of knowledge sharing and collaborative problem-solving.',
  duration: 'June 2020 - Present · 4 yrs+',
};

/**
 * @const {Variants} containerVariants
 * @description Animation variants for the main container. It staggers the animation of its children.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      ease: 'easeOut',
    },
  },
};

/**
 * @const {Variants} itemVariants
 * @description Animation variants for child elements (heading, paragraphs).
 * Creates a subtle slide-up and fade-in effect.
 */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * @component ExperienceItem
 * @description A self-contained component that displays a single, static experience entry.
 * It uses its own constant data, ensuring it remains decoupled and reusable without
 * the need for props. The design is modeled after a professional profile experience entry,
 * like those found on LinkedIn, and includes a subtle, staggered fade-in animation
 * that triggers on scroll.
 * @returns {JSX.Element} The rendered experience item component.
 */
const ExperienceItem = (): JSX.Element => {
  return (
    <motion.div
      className="max-w-3xl mx-auto bg-white p-6 font-sans border-b border-gray-200"
      variants={containerVariants as Variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      aria-labelledby="experience-department"
      role="region"
    >
      <motion.h3
        id="experience-department"
        className="text-xl font-semibold text-gray-900 mb-1"
        variants={itemVariants as Variants}
      >
        {experienceData.department}
      </motion.h3>
      <motion.p
        className="text-sm text-gray-500 mb-4"
        variants={itemVariants as Variants}
      >
        {experienceData.duration}
      </motion.p>
      <motion.p
        className="text-base text-gray-700 leading-relaxed whitespace-pre-line"
        variants={itemVariants as Variants}
      >
        {experienceData.description}
      </motion.p>
    </motion.div>
  );
};

export default ExperienceItem;