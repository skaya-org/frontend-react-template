import React, { ReactNode, JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @interface IResumeSectionProps
 * @description Defines the props for the ResumeSection component.
 * This interface is exported to allow other components to use its type definition.
 */
export interface IResumeSectionProps {
  /**
   * The title of the resume section (e.g., "Experience", "Education").
   * @type {string}
   * @required
   */
  title: string;

  /**
   * The content of the resume section. This can be any valid React node,
   * allowing for flexible content like lists, paragraphs, or other components.
   * @type {ReactNode}
   * @required
   */
  children: ReactNode;

  /**
   * Optional HTML id for the section element. Useful for creating anchor links
   * within the resume for easy navigation. It also improves accessibility by
   * linking the section to its heading.
   * @type {string}
   * @optional
   */
  id?: string;

  /**
   * Optional CSS class name(s) to apply to the root section element for custom styling.
   * @type {string}
   * @optional
   */
  className?: string;
}

/**
 * @constant sectionVariants
 * @description Framer Motion variants for the main section container.
 * Defines a 'hidden' state (invisible and slightly shifted down) and a 'visible'
 * state (fully opaque and in its final position). The animation is triggered
 * as the component scrolls into the viewport.
 */
const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * @component ResumeSection
 * @description A reusable component that renders a generic section of a resume.
 * It provides a consistent layout with a title and a content area, ensuring a
 * uniform look and feel across different parts of the resume. The component is
 * designed to be accessible and easily styleable.
 *
 * It features a subtle fade-in and slide-up animation using Framer Motion
 * that triggers when the section becomes visible in the viewport.
 *
 * The component's internal styling is designed with a utility-first CSS framework in mind
 * (like Tailwind CSS), but it can be easily customized or overridden via the `className` prop.
 *
 * @param {IResumeSectionProps} props The props for the component.
 * @returns {JSX.Element} A styled, animated section element with a title and the provided children as content.
 *
 * @example
 * ```tsx
 * // In a parent component, rendering an "Experience" and "Education" section.
 * import ResumeSection from './ResumeSection';
 *
 * const MyResume = () => (
 *   <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900">
 *     <ResumeSection title="Professional Experience" id="experience">
 *       <div>
 *         <h3 className="font-semibold text-lg">Senior Software Engineer at TechCorp</h3>
 *         <p className="text-sm text-gray-500">2020 - Present</p>
 *         <ul className="list-disc list-inside mt-2">
 *           <li>Developed and maintained web applications using React and TypeScript.</li>
 *           <li>Collaborated with cross-functional teams to define and ship new features.</li>
 *         </ul>
 *       </div>
 *     </ResumeSection>
 *
 *     <ResumeSection title="Education" id="education" className="mt-4">
 *       <div>
 *         <h3 className="font-semibold text-lg">B.S. in Computer Science</h3>
 *         <p className="text-sm text-gray-500">University of Technology</p>
 *       </div>
 *     </ResumeSection>
 *   </div>
 * );
 * ```
 */
const ResumeSection = ({ title, children, id, className }: IResumeSectionProps): JSX.Element => {
  // Logic for generating a unique ID for the heading if an `id` prop is provided.
  // This is used for `aria-labelledby` to improve accessibility.
  const headingId = id ? `${id}-title` : undefined;

  return (
    <motion.section
      variants={sectionVariants as Variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      id={id}
      className={`py-6 border-b last:border-b-0 border-gray-200 dark:border-gray-700 ${className || ''}`.trim()}
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="mb-4 text-xl font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200"
      >
        {title}
      </h2>
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </motion.section>
  );
};

export default ResumeSection;