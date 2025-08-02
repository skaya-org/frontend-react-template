import React from 'react';
import { motion, Variants } from 'framer-motion';

// Variants for the main container to orchestrate the animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger the animation of child elements
      delayChildren: 0.1,   // Add a small delay before starting the stagger
    },
  },
};

// Variants for individual items (header and list items) to animate in
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeOut",
      duration: 0.5,
    },
  },
};


const ExperienceEntry = ({
  title = "Senior Frontend Developer",
  company = "Innovatech Solutions",
  startDate = "Jan 2021",
  endDate = "Present",
  responsibilities = [
    "Led the development of a new design system using React and Tailwind CSS, improving UI consistency and development speed by 40%.",
    "Engineered complex, responsive user interfaces for a suite of SaaS products, serving over 50,000 active users.",
    "Mentored junior developers, conducted code reviews, and established best practices for frontend development.",
    "Collaborated with UX/UI designers and product managers to translate mockups and requirements into high-quality technical solutions.",
  ],
}) => {
  return (
    <motion.div
      className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      variants={containerVariants as Variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% of the component is in view
    >
      {/* Header section with title, company, and dates */}
      <motion.header
        className="flex flex-col items-start gap-x-4 gap-y-2 sm:flex-row sm:justify-between"
        variants={itemVariants as Variants}
      >
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {title}
          </h3>
          <p className="text-base font-medium text-sky-600 dark:text-sky-400">
            {company}
          </p>
        </div>
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {startDate} – {endDate}
        </div>
      </motion.header>

      {/* Description / Responsibilities list */}
      <ul className="list-disc list-inside space-y-2 text-base text-slate-700 dark:text-slate-300">
        {responsibilities.map((item, index) => (
          <motion.li
            key={index}
            className="leading-relaxed"
            variants={itemVariants as Variants}
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ExperienceEntry;