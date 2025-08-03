import React, { JSX, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

// --- TYPE DEFINITIONS ---

/**
 * @typedef HowItWorksStep
 * @description Defines the structure for a single step in the "How It Works" process.
 * @property {number} stepNumber - The sequential number of the step.
 * @property {string} title - The main heading for the step.
 * @property {string} description - A brief explanation of the step.
 * @property {ReactNode} icon - A React component (typically an SVG) representing the step's icon.
 */
type HowItWorksStep = {
	stepNumber: number;
	title: string;
	description: string;
	icon: ReactNode;
};

// --- SVG ICONS (as stateless components) ---

/**
 * @description SVG icon for scheduling a pickup.
 * @returns {JSX.Element} The rendered SVG icon.
 */
const ScheduleIcon = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
		<line x1="16" x2="16" y1="2" y2="6" />
		<line x1="8" x2="8" y1="2" y2="6" />
		<line x1="3" x2="21" y1="10" y2="10" />
		<path d="M8 14h.01" />
		<path d="M12 14h.01" />
		<path d="M16 14h.01" />
		<path d="M8 18h.01" />
		<path d="M12 18h.01" />
		<path d="M16 18h.01" />
	</svg>
);

/**
 * @description SVG icon for packing items.
 * @returns {JSX.Element} The rendered SVG icon.
 */
const PackIcon = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2" />
		<path d="m21 10-7.5 4.22" />
		<path d="m3.5 10 7.5 4.22" />
		<path d="M12 22V14" />
		<path d="M21 15v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5l4-2.2" />
	</svg>
);

/**
 * @description SVG icon for delivery confirmation.
 * @returns {JSX.Element} The rendered SVG icon.
 */
const DeliverIcon = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M15 11h6" />
		<path d="M15 15h2" />
		<path d="M2 9.5A4.5 4.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6.5A4.5 4.5 0 0 1 2 13.5v-4Z" />
		<path d="M6 16.5V12" />
		<path d="M10.5 16.5a2.5 2.5 0 0 0 0-5h-4" />
	</svg>
);

// --- CONSTANT DATA ---

/**
 * @constant HOW_IT_WORKS_DATA
 * @description An array of objects defining the content for each step in the "How It Works" section.
 * This constant data source makes the component self-contained and removes the need for props.
 */
const HOW_IT_WORKS_DATA: Readonly<HowItWorksStep[]> = [
	{
		stepNumber: 1,
		title: 'Schedule a Pickup',
		description: 'Choose a convenient date and time through our easy-to-use online portal or mobile app.',
		icon: <ScheduleIcon />,
	},
	{
		stepNumber: 2,
		title: 'Pack Your Items',
		description: 'Securely pack your items in your own boxes. Our team will handle the rest with care.',
		icon: <PackIcon />,
	},
	{
		stepNumber: 3,
		title: 'We Deliver',
		description: 'Your items are swiftly transported to their destination. Track your delivery in real-time.',
		icon: <DeliverIcon />,
	},
];

// --- ANIMATION VARIANTS (Framer Motion) ---

/**
 * @description Variants for the main header text to fade in and slide down.
 */
const headerTextVariants: Variants = {
	hidden: { y: -20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			duration: 0.6,
			ease: 'easeOut',
		},
	},
};

/**
 * @description Variants for the container to orchestrate staggered animations for its children.
 */
const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1,
		},
	},
};

/**
 * @description Variants for individual card items for a subtle fade-in and upward motion.
 */
const itemVariants: Variants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring',
			stiffness: 100,
			damping: 10,
		},
	},
};

/**
 * @component HowItWorksCard
 * @description A self-contained section component that displays the "How It Works" process.
 * It uses internally defined constant data for its content, requiring no props from a parent component.
 * This component renders a series of cards, each detailing a specific step in the process.
 * It includes subtle animations using Framer Motion for an enhanced user experience.
 *
 * @returns {JSX.Element} The fully rendered "How It Works" section.
 */
const HowItWorksCard = (): JSX.Element => {
	return (
		<section
			className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 font-sans"
			aria-labelledby="how-it-works-title"
		>
			<motion.div
				className="text-center mb-12"
				variants={headerTextVariants as Variants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.8 }}
			>
				<h2 id="how-it-works-title" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
					How It Works
				</h2>
				<p className="text-lg text-gray-500 max-w-2xl mx-auto">
					Follow these three simple steps to get your items delivered quickly and safely.
				</p>
			</motion.div>

			<motion.div
				className="grid grid-cols-1 md:grid-cols-3 gap-8"
				variants={containerVariants as Variants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.5 }}
			>
				{HOW_IT_WORKS_DATA.map((step) => (
					<motion.div
						key={step.stepNumber}
						className="flex flex-col items-center bg-white rounded-xl p-8 text-center shadow-md border border-gray-200"
						variants={itemVariants as Variants}
					>
						<div
							className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6"
							aria-hidden="true"
						>
							{step.icon}
						</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-2">{`${step.stepNumber}. ${step.title}`}</h3>
						<p className="text-base text-gray-600 leading-relaxed">{step.description}</p>
					</motion.div>
				))}
			</motion.div>
		</section>
	);
};

export default HowItWorksCard;