import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {object} Quest
 * @description Represents the structure of a single quest object.
 * @property {string} id - A unique identifier for the quest.
 * @property {string} title - The title of the quest.
 * @property {string} description - A brief description of the quest's objective.
 * @property {string} iconUrl - URL for the quest's icon.
 */
type Quest = {
	id: string;
	title: string;
	description: string;
	iconUrl: string;
};

// --- CONSTANT DATA ---

/**
 * A constant, read-only array of active quests.
 * This data is hardcoded within the component to ensure it is self-contained
 * and does not require any props from parent components.
 * @const {readonly Quest[]}
 */
const ACTIVE_QUESTS: readonly Quest[] = [
	{
		id: 'quest-001',
		title: 'First Steps',
		description: 'Explore the main dashboard and familiarize yourself with the layout.',
		iconUrl: 'https://picsum.photos/seed/quest1/64/64.webp',
	},
	{
		id: 'quest-002',
		title: 'Data Guardian',
		description: 'Visit the user settings page and configure your privacy options.',
		iconUrl: 'https://picsum.photos/seed/quest2/64/64.webp',
	},
	{
		id: 'quest-003',
		title: 'Social Butterfly',
		description: 'Find the community forum and post your first message.',
		iconUrl: 'https://picsum.photos/seed/quest3/64/64.webp',
	},
];

// --- ANIMATION VARIANTS ---

/**
 * Variants for the main container to animate its own entry and orchestrate child animations.
 */
const panelVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.3,
			ease: 'easeOut',
			// Stagger children animations after the panel has animated in
			when: 'beforeChildren',
			staggerChildren: 0.1,
		},
	},
};

/**
 * Variants for the list container (`ul`) to control the staggering of its items.
 */
const listVariants: Variants = {
	hidden: {}, // Let the parent's `staggerChildren` control the timing
	visible: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

/**
 * Variants for each individual quest item in the list.
 */
const itemVariants: Variants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring',
			stiffness: 120,
			damping: 14,
		},
	},
};

// --- ERROR BOUNDARY FALLBACK ---

/**
 * A fallback component to be displayed when an error is caught by the ErrorBoundary.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} A UI element indicating an error has occurred.
 */
const QuestLogErrorFallback = ({ error }: FallbackProps): JSX.Element => (
	<div className="bg-red-500 text-white p-5 rounded-lg text-center" role="alert">
		<h3 className="font-bold text-lg mb-2">Something went wrong in the Quest Log:</h3>
		<pre className="whitespace-pre-wrap text-sm">{error.message}</pre>
	</div>
);

// --- SUB-COMPONENTS ---

/**
 * @interface QuestItemProps
 * @description Defines the props for the QuestItem component.
 * @property {Quest} quest - The quest data to render.
 */
interface QuestItemProps {
	quest: Quest;
}

/**
 * Renders a single quest item in the list.
 * This component is internal to QuestLog and handles the presentation of one quest.
 * It's animated using the `itemVariants`.
 * @param {QuestItemProps} props - The properties for the component.
 * @returns {JSX.Element} A list item element representing a quest.
 */
const QuestItem = ({ quest }: QuestItemProps): JSX.Element => (
	<motion.li
		className="flex items-center gap-4 bg-slate-700 p-4 rounded-lg"
		variants={itemVariants as Variants}
        whileHover={{ scale: 1.03, backgroundColor: 'rgb(71 85 105)' }} // Corresponds to hover:bg-slate-600
        transition={{ type: 'spring', stiffness: 300 }}
	>
		<img
			src={quest.iconUrl}
			alt={`${quest.title} icon`}
			className="w-12 h-12 rounded-full object-cover flex-shrink-0"
		/>
		<div className="flex flex-col gap-1">
			<h3 className="text-lg font-semibold text-slate-100">{quest.title}</h3>
			<p className="text-sm text-slate-400 leading-snug">{quest.description}</p>
		</div>
	</motion.li>
);

// --- MAIN COMPONENT ---

/**
 * A UI panel that displays a list of gamified exploration objectives.
 * It is a self-contained, production-grade component with no external props,
 * using hardcoded data and best practices for stability and maintainability.
 * Includes animations for a polished user experience and a robust error boundary.
 *
 * @returns {JSX.Element} The rendered QuestLog component.
 */
const QuestLog = (): JSX.Element => {
	return (
		<ErrorBoundary FallbackComponent={QuestLogErrorFallback}>
			<motion.section
				className="bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-xl border border-slate-700 text-slate-200 font-sans"
				variants={panelVariants as Variants}
				initial="hidden"
				animate="visible"
				aria-labelledby="quest-log-header"
			>
				{/* The title can inherit variants from its parent */}
				<motion.h2
					id="quest-log-header"
					className="text-2xl font-bold text-white mb-5 pb-3 border-b border-slate-700"
				>
					Active Quests
				</motion.h2>
				<motion.ul
					className="list-none p-0 m-0 flex flex-col gap-4"
					variants={listVariants as Variants}
					aria-label="List of active quests"
				>
					{ACTIVE_QUESTS.map((quest) => (
						<QuestItem key={quest.id} quest={quest} />
					))}
				</motion.ul>
			</motion.section>
		</ErrorBoundary>
	);
};

export default QuestLog;