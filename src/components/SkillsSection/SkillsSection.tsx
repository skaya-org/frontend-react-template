import React, { JSX } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';

// --- Component Imports ---
import ProfileSectionCard from '../../components/ProfileSectionCard/ProfileSectionCard';
import SkillPill from '../../components/SkillPill/SkillPill';

// --- Constants ---

/**
 * Defines the type for a single skill item.
 * @property {number} id - The unique identifier for the skill.
 * @property {string} name - The name of the medical service or specialty.
 */
type Skill = {
  id: number;
  name: string;
};

/**
 * Constant data for the medical services and specialties offered by Apollo Hospital.
 * This hardcoded data ensures the component is self-contained and does not require props,
 * making it a reusable and predictable "drop-in" UI element.
 *
 * @const
 * @type {ReadonlyArray<Skill>}
 */
const SKILLS_DATA: ReadonlyArray<Skill> = [
  { id: 1, name: 'Cardiology' },
  { id: 2, name: 'Neurology' },
  { id: 3, name: 'Oncology' },
  { id: 4, name: 'Orthopedics' },
  { id: 5, name: 'Gastroenterology' },
  { id: 6, name: 'Pulmonology' },
  { id: 7, name: 'Nephrology' },
  { id: 8, name: 'Urology' },
  { id: 9, name: 'Dermatology' },
  { id: 10, name: 'Endocrinology' },
  { id: 11, name: 'Pediatrics' },
  { id: 12, name: 'Emergency Medicine' },
];

// --- Animation Variants ---

/**
 * Variants for the container of the skill pills.
 * Orchestrates a staggered animation for its children.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Time delay between each child animation
      delayChildren: 0.2,    // Delay before the first child starts animating
    },
  },
};

/**
 * Variants for each individual skill pill item.
 * Defines a "fade in and slide up" animation.
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 12,
    },
  },
};


// --- Helper Components ---

/**
 * A simple fallback component to render if an error occurs within the SkillsSection.
 * This ensures that a failure in rendering the skills list does not crash the
 * entire application, providing a better user experience.
 *
 * @returns {JSX.Element} The fallback UI.
 */
const SkillsErrorFallback = (): JSX.Element => (
  <div
    className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700"
    role="alert"
  >
    <p className="m-0 font-medium">
      Could not display the list of services.
    </p>
    <p className="m-0 mt-2 text-sm">
      Please try refreshing the page.
    </p>
  </div>
);

// --- Main Component ---

/**
 * Renders a section showcasing the various medical services and specialties offered.
 *
 * This component is designed to be fully self-contained. It uses a hardcoded list of skills,
 * eliminating the need for props and ensuring consistent display wherever it's used.
 * It is structured using `ProfileSectionCard` for its container and title, and it dynamically
 * renders `SkillPill` components for each service within a flexbox layout.
 * An `ErrorBoundary` is implemented to gracefully handle potential rendering errors,
 * maintaining application stability.
 *
 * The list of skills animates into view using a staggered effect when the section becomes visible.
 *
 * @component
 * @returns {JSX.Element} The rendered `SkillsSection` component.
 */
const SkillsSection = (): JSX.Element => {
  return (
      <ErrorBoundary FallbackComponent={SkillsErrorFallback}>
        <motion.div
          className="flex flex-wrap gap-3 pt-2"
          variants={containerVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {SKILLS_DATA.map((skill) => (
            <motion.div key={skill.id} variants={itemVariants as Variants}>
              <SkillPill />
            </motion.div>
          ))}
        </motion.div>
      </ErrorBoundary>
  );
};

export default SkillsSection;