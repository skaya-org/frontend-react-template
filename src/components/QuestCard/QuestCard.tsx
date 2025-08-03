import React, { JSX, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @typedef {object} QuestData
 * @property {string} id - Unique identifier for the quest.
 * @property {string} title - The title of the quest.
 * @property {string} description - A brief description of the quest.
 * @property {string} imageUrl - URL for the quest's representative image.
 * @property {number} reward - The numerical reward value for completing the quest.
 * @property {string} rewardUnit - The unit of the reward (e.g., XP, Gold).
 */

/**
 * Constant data for the QuestCard.
 * This object holds all the necessary information, making the component self-contained
 * and eliminating the need for props.
 * @type {QuestData}
 */
const QUEST_DATA: {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  reward: number;
  rewardUnit: string;
} = {
  id: 'quest-sage-library-001',
  title: "The Sage's Library Challenge",
  description: 'Uncover ancient secrets by solving a series of riddles hidden within the Grand Library. Time is of the essence!',
  imageUrl: 'https://picsum.photos/400/250.webp',
  reward: 500,
  rewardUnit: 'XP',
};

/**
 * Animation variants for the main card container.
 * This orchestrates the overall appearance and hover effect,
 * staggering the animation of its children.
 */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1,
    },
  },
  hover: {
    scale: 1.03,
    transition: { type: 'spring', stiffness: 300 },
  },
};

/**
 * Animation variants for individual child elements inside the card.
 * Creates a subtle "fade and slide up" effect for each item.
 */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120 },
  },
};

/**
 * QuestCard Component
 *
 * @description A self-contained card component to display information about a single quest.
 * It uses hardcoded constant data, so it does not accept any props. This approach
 * makes the component highly portable and easy to use in static contexts.
 * The card features a title, description, image, reward value, and an interactive "View Quest" button.
 * It's recommended to wrap this component in an ErrorBoundary at a higher level
 * to gracefully handle any unexpected rendering errors.
 *
 * @returns {JSX.Element} The rendered QuestCard component.
 */
const QuestCard = (): JSX.Element => {

  /**
   * Handles the click event for the 'View Quest' button.
   * For this demonstration, it logs the quest ID to the console. In a real-world
   * application, this could trigger navigation, open a modal, or perform another action.
   * `useCallback` is used to memoize the function, preventing re-creation on re-renders.
   */
  const handleViewQuestClick = useCallback((): void => {
    // In a real app with react-router-dom, you might use the `useNavigate` hook.
    // e.g., navigate(`/quests/${QUEST_DATA.id}`);
    console.log(`Action triggered for quest: ${QUEST_DATA.id}`);
    alert(`Viewing details for: "${QUEST_DATA.title}"`);
  }, []);

  return (
    <motion.div
      className="flex flex-col max-w-sm gap-4 p-6 overflow-hidden font-sans bg-white border rounded-xl border-slate-200 shadow-lg"
      variants={cardVariants as Variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <motion.img
        variants={itemVariants as Variants}
        src={QUEST_DATA.imageUrl}
        alt={`Visual representation for ${QUEST_DATA.title}`}
        className="object-cover w-full h-auto border rounded-lg border-slate-100"
        width="400"
        height="250"
      />
      <motion.div variants={itemVariants as Variants} className="flex flex-col flex-grow gap-3">
        <h2 className="text-2xl font-bold leading-tight text-slate-800">{QUEST_DATA.title}</h2>
        <p className="flex-grow text-base leading-relaxed text-slate-600">{QUEST_DATA.description}</p>
      </motion.div>

      <motion.div
        variants={itemVariants as Variants}
        className="flex items-center gap-2 text-lg font-bold text-blue-800"
      >
        <span role="img" aria-label="Reward icon">🏆</span>
        <p>
          Reward: {QUEST_DATA.reward.toLocaleString()} {QUEST_DATA.rewardUnit}
        </p>
      </motion.div>

      <motion.button
        variants={itemVariants as Variants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleViewQuestClick}
        aria-label={`View details for ${QUEST_DATA.title}`}
        className="self-start px-6 py-3 text-base font-bold text-white transition-colors duration-200 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        View Quest
      </motion.button>
    </motion.div>
  );
};

export default QuestCard;