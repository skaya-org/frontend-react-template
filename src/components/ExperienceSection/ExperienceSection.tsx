import React, { JSX, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';
import ProfileSectionCard from '../../components/ProfileSectionCard/ProfileSectionCard';
import ExperienceItem from '../../components/ExperienceItem/ExperienceItem';

/**
 * @typedef {string} ExperienceId
 * @description A unique identifier for an experience item.
 * This ID is used by the ExperienceItem component to look up its own content from its internal constant data.
 * This approach ensures that ExperienceSection is only concerned with the list and order of experiences,
 * not their specific content, promoting high cohesion and low coupling.
 */
type ExperienceId =
  | 'cardiology'
  | 'neurology'
  | 'orthopedics'
  | 'oncology'
  | 'foundation_1950';

/**
 * @const SECTION_TITLE
 * @description The title displayed at the top of the experience section.
 */
const SECTION_TITLE: string = 'Departments & Milestones';

/**
 * @const EXPERIENCE_ITEM_IDS
 * @description An array of unique identifiers for each department or milestone to be displayed.
 * The order of IDs in this array determines the order of rendering in the UI.
 * Each ID corresponds to a specific data set managed within the `ExperienceItem` component itself.
 */
const EXPERIENCE_ITEM_IDS: readonly ExperienceId[] = [
  'cardiology',
  'neurology',
  'orthopedics',
  'oncology',
  'foundation_1950',
];

/**
 * @const listVariants
 * @description Animation variants for the container of the experience items.
 * Controls the staggered animation of its children.
 */
const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/**
 * @const itemVariants
 * @description Animation variants for each individual experience item.
 * Defines a fade-in and slide-up effect.
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
 * Renders a fallback UI when the experience list fails to render.
 * @returns {JSX.Element} A simple error message.
 */
const ExperienceErrorFallback = (): JSX.Element => (
  <div className="p-4 text-center text-red-600 bg-red-100 rounded-lg">
    <p>We're sorry, but this section could not be displayed at the moment.</p>
  </div>
);

/**
 * A fallback component to display while experience items are loading.
 * This is particularly useful if ExperienceItem uses lazy loading.
 * @returns {JSX.Element} A loading placeholder.
 */
const ExperienceLoadingFallback = (): JSX.Element => (
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="w-full h-24 bg-gray-200 rounded-lg animate-pulse"
      />
    ))}
  </div>
);

/**
 * @component ExperienceSection
 * @description A self-contained section that displays a static, predefined list of the hospital's
 * key departments and historical milestones. It uses an internal constant array of IDs to
 * render `ExperienceItem` components, each of which is responsible for fetching its own
 * data based on the provided ID. This component requires no props from its parent.
 *
 * @returns {JSX.Element} The rendered ExperienceSection component.
 */
const ExperienceSection = (): JSX.Element => {
  return (
      <ErrorBoundary FallbackComponent={ExperienceErrorFallback}>
        <Suspense fallback={<ExperienceLoadingFallback />}>
          <motion.div
            role="list"
            className="space-y-6"
            variants={listVariants as Variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {EXPERIENCE_ITEM_IDS.map((id) => (
              <motion.div key={id} variants={itemVariants as Variants}>
                <ExperienceItem  />
              </motion.div>
            ))}
          </motion.div>
        </Suspense>
      </ErrorBoundary>
  );
};

export default ExperienceSection;