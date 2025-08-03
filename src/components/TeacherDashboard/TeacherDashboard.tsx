import React, { JSX } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';

// --- Component Imports ---
// These components are self-contained and manage their own data, requiring no props.

/**
 * QuestDashboard allows teachers to view and manage the list of quests (assignments).
 * It is a core feature of the teacher's administrative view.
 */
import QuestDashboard from '../QuestDashboard/QuestDashboard';

/**
 * EnergyMeter displays the overall morale or "energy" of the classroom.
 * It provides a quick, visual gauge of student engagement.
 */
import EnergyMeter from '../EnergyMeter/EnergyMeter';

// --- Error Fallback Component ---

/**
 * A reusable, styled fallback component for the ErrorBoundary.
 * It renders a user-friendly message when a captured error occurs,
 * preventing a blank screen or a full application crash.
 *
 * @returns {JSX.Element} The rendered fallback UI.
 */
const WidgetErrorFallback = (): JSX.Element => (
  <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-center text-amber-700">
    <h3 className="mb-2 text-lg font-semibold text-amber-800">
      Widget Failed to Load
    </h3>
    <p className="text-sm">
      There was an issue with this component. Please try refreshing the page.
    </p>
  </div>
);

// --- Animation Variants ---

/**
 * Variants for the main container to orchestrate the staggering of child elements.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Animates children one after the other with a 0.2s delay
    },
  },
};

/**
 * Variants for individual dashboard widgets (sections) to animate in.
 * They will fade in and slide up slightly for a clean, modern effect.
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// --- Main TeacherDashboard Component ---

/**
 * The TeacherDashboard component serves as the primary interface for educators.
 * It aggregates key classroom management tools into a single, cohesive view.
 *
 * The dashboard features two main sections arranged side-by-side:
 * 1.  **QuestDashboard**: For creating, assigning, and monitoring student quests.
 * 2.  **EnergyMeter**: A real-time gauge of classroom morale and engagement.
 *
 * Each section is wrapped in an ErrorBoundary to ensure that an issue in one
 * component does not affect the functionality of the other, promoting a robust
 * user experience. The component is entirely self-contained, fetching and managing
 * its own data constants, and thus requires no props.
 *
 * @component
 * @returns {JSX.Element} The fully rendered Teacher Dashboard component.
 */
const TeacherDashboard = (): JSX.Element => {
  return (
    <motion.main
      className="flex h-screen flex-col gap-8 overflow-hidden bg-gray-50 p-8 lg:flex-row"
      aria-label="Teacher Dashboard"
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        className="flex min-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-lg lg:flex-[3]"
        aria-labelledby="quest-dashboard-heading"
        variants={itemVariants as Variants}
      >
        <ErrorBoundary FallbackComponent={WidgetErrorFallback}>
          {/* The h2 is conceptually part of the QuestDashboard but defined here for section context */}
          <h2 id="quest-dashboard-heading" className="sr-only">
            Quest Management
          </h2>
          <QuestDashboard />
        </ErrorBoundary>
      </motion.section>

      <motion.section
        className="flex min-w-[280px] flex-col overflow-hidden rounded-xl bg-white shadow-lg lg:flex-[1]"
        aria-labelledby="energy-meter-heading"
        variants={itemVariants as Variants}
      >
        <ErrorBoundary FallbackComponent={WidgetErrorFallback}>
          {/* The h2 is conceptually part of the EnergyMeter but defined here for section context */}
          <h2 id="energy-meter-heading" className="sr-only">
            Classroom Energy Meter
          </h2>
          <EnergyMeter />
        </ErrorBoundary>
      </motion.section>
    </motion.main>
  );
};

export default TeacherDashboard;