import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Corrected import for Framer Motion
import ProjectCard from '../ProjectCard/ProjectCard'; // Import path as specified

/**
 * @typedef {object} ProjectPlaceholder
 * @property {string} id - A unique identifier for the project placeholder.
 * @property {string} title - A descriptive title for the project placeholder (used for internal clarity, not passed to ProjectCard).
 */

/**
 * Constant data representing placeholders for projects.
 * This array determines the number of `ProjectCard` components to be rendered
 * within the `PortfolioSection`. As per requirements, `ProjectCard` components
 * are self-fulfilled and do not receive props, meaning they display their own
 * internally defined constant data. Therefore, the data in this array primarily
 * serves to facilitate iteration and structure, not to pass specific project content.
 * @type {ProjectPlaceholder[]}
 */
const PROJECT_PLACEHOLDERS: { id: string; title: string; }[] = [
  { id: 'project-1', title: 'Enterprise Dashboard System' },
  { id: 'project-2', title: 'E-commerce Platform Redesign' },
  { id: 'project-3', title: 'Mobile Fitness Tracking App' },
  { id: 'project-4', title: 'AI-Powered Chatbot Integration' },
  { id: 'project-5', title: 'Supply Chain Optimization Tool' },
  { id: 'project-6', title: 'Personalized Learning Platform' },
];

// Define Variants for the section header animation
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" // Added a common ease function for smoother animation
    }
  }
};

// Define Variants for individual project card animations
const projectCardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" // Added a common ease function
    }
  }
};

/**
 * PortfolioSection component.
 *
 * This component is responsible for displaying a collection of past projects or work samples.
 * It leverages the `ProjectCard` component to render individual project details.
 *
 * Adhering to the strict guidelines:
 * - It uses internal constant data (`PROJECT_PLACEHOLDERS`) to determine how many
 *   `ProjectCard` components to render.
 * - It does NOT accept any props from its parent component.
 * - It does NOT send any props to the `ProjectCard` component, as `ProjectCard`
 *   is defined as a self-fulfilled component that uses its own constant data.
 * - Utilizes `motion` for subtle animations to enhance user experience.
 * - Employs Tailwind CSS utility classes for styling.
 *
 * @returns {JSX.Element} The rendered portfolio section.
 */
const PortfolioSection = (): JSX.Element => {
  return (
    <section id="portfolio" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Motion Animation */}
        <motion.div
          variants={headerVariants as Variants} // Apply header specific variants
          initial="hidden" // Set initial animation state
          whileInView="visible" // Animate to visible state when in view
          viewport={{ once: true, amount: 0.3 }} // Trigger once when 30% of element is in view
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl mb-4">
            My Recent Work
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore a diverse portfolio showcasing my expertise in developing robust and scalable web applications.
          </p>
        </motion.div>

        {/* Grid Container for Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mapping over constant data to render ProjectCard components */}
          {PROJECT_PLACEHOLDERS.map((project, index) => (
            <motion.div
              key={project.id}
              variants={projectCardVariants as Variants} // Apply project card specific variants
              initial="hidden" // Set initial animation state
              whileInView="visible" // Animate to visible state when in view
              transition={{ delay: index * 0.1 }} // Staggered delay for each card based on its index
              viewport={{ once: true, amount: 0.2 }} // Trigger once when 20% of element is in view
              className="w-full"
            >
              {/*
                ProjectCard component is rendered without any props.
                As per the requirements, ProjectCard is a self-fulfilled component
                that utilizes its own internal constant data to display project details.
                Therefore, each instance of ProjectCard rendered here will display
                identical content based on its internal implementation.
              */}
              <ProjectCard />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;