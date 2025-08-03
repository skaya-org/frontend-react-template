import React, { JSX } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import QuestCard from '../QuestCard/QuestCard';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {object} Quest
 * @description Defines the structure for a single quest item.
 * This type is used for the constant data representing the list of quests.
 * @property {string} id - A unique identifier for the quest.
 * @property {string} title - The title of the quest.
 */
type Quest = {
  id: string;
  title: string; // Used for accessibility and keys, even if QuestCard doesn't use it.
};

// --- CONSTANT DATA ---

/**
 * @const {Quest[]} QUEST_DATA
 * @description A constant array of quest data. In a real-world application,
 * this would be fetched from an API, but for this component, it's static
 * as per the requirements to ensure the component is self-contained.
 * The QuestCard component is rendered for each item in this array.
 */
const QUEST_DATA: readonly Quest[] = [
  { id: 'q1', title: 'Introduction to Algebra' },
  { id: 'q2', title: 'The World of Photosynthesis' },
  { id: 'q3', title: 'Renaissance Art History' },
  { id: 'q4', title: 'Basics of Python Programming' },
  { id: 'q5', title: 'The Solar System Exploration' },
  { id: 'q6', title: 'Creative Writing Workshop' },
  { id: 'q7', title: 'Advanced Calculus Challenge' },
];

// --- HELPER COMPONENTS ---

/**
 * A simple fallback component to display when an error is caught by the ErrorBoundary.
 * @returns {JSX.Element} The rendered error message UI.
 */
const QuestListErrorFallback = (): JSX.Element => (
  <div className="flex h-full flex-col items-center justify-center rounded-lg border border-red-500 bg-red-50 p-5 text-center text-red-700">
    <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
    <p>We couldn't display the quest list. Please try refreshing the page.</p>
  </div>
);

// --- ANIMATION VARIANTS ---

/**
 * @type {Variants}
 * @description Animation variants for the header container.
 * It animates into view and orchestrates its children's animations.
 */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 14,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

/**
 * @type {Variants}
 * @description Animation variants for items inside the header (title, button).
 */
const headerItemVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * @type {Variants}
 * @description Animation variants for the quest list container (<ul>).
 * It staggers the animation of its children (<li> items).
 */
const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3, // Start after the header animation has had a moment to settle
      staggerChildren: 0.07,
    },
  },
};

/**
 * @type {Variants}
 * @description Animation variants for each individual quest item (<li>).
 * Defines how each item enters and exits.
 */
const questItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

// --- MAIN COMPONENT ---

/**
 * QuestDashboard component
 *
 * @description A comprehensive dashboard for viewing and managing quests.
 * It features a header with a title and a button for assigning new quests,
 * followed by a scrollable grid of `QuestCard` components.
 * This component is self-contained and uses static data, requiring no props.
 * It also includes an error boundary to gracefully handle potential rendering errors
 * in the quest list.
 *
 * @returns {JSX.Element} The rendered QuestDashboard component.
 */
const QuestDashboard = (): JSX.Element => {
  return (
    <div className="flex h-screen w-full flex-col bg-gray-100 font-sans">
      <motion.header
        className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-5"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-2xl font-bold text-gray-800"
          variants={headerItemVariants as Variants}
        >
          Quest Dashboard
        </motion.h1>
        {/*
         * This button is designed for a "teacher's view" to add new quests.
         * It uses react-router-dom's Link component for navigation.
         * The variants are inherited from the parent header.
         */}
        <motion.div
          variants={headerItemVariants as Variants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/quests/new"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-base font-semibold text-white no-underline shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Assign New Quest
          </Link>
        </motion.div>
      </motion.header>

      <main className="flex-grow overflow-y-auto p-6">
        <ErrorBoundary FallbackComponent={QuestListErrorFallback}>
          <motion.ul
            className="grid list-none gap-6 p-0 m-0 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {QUEST_DATA.map((quest) => (
                <motion.li
                  key={quest.id}
                  variants={questItemVariants as Variants}
                  layout
                >
                  {/*
                   * The QuestCard component is rendered for each quest.
                   * As per requirements, it does not receive any props.
                   * It's assumed to have its own static content.
                   * The `key` prop is essential for React's rendering logic.
                   */}
                  <QuestCard />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default QuestDashboard;