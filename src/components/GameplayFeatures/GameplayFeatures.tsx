import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

//==============================================================================
// TYPE DEFINITIONS
//==============================================================================

/**
 * @typedef {object} Feature
 * @description Defines the structure for a single gameplay feature item.
 * @property {number} id - A unique identifier for the feature.
 * @property {JSX.Element} icon - The SVG icon representing the feature.
 * @property {string} title - The title of the gameplay feature.
 * @property {string} description - A short paragraph explaining the feature.
 */
type Feature = {
	id: number;
	icon: JSX.Element;
	title: string;
	description: string;
};

//==============================================================================
// CONSTANT DATA & ASSETS
//==============================================================================

/**
 * SVG icon for Solar-Powered Drifting.
 * @constant
 */
const SolarIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="48"
		height="48"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2" />
		<path d="M12 20v2" />
		<path d="m4.93 4.93 1.41 1.41" />
		<path d="m17.66 17.66 1.41 1.41" />
		<path d="M2 12h2" />
		<path d="M20 12h2" />
		<path d="m6.34 17.66-1.41 1.41" />
		<path d="m19.07 4.93-1.41 1.41" />
	</svg>
);

/**
 * SVG icon for Strategic Power Diversion.
 * @constant
 */
const PowerIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="48"
		height="48"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="m21 16-4 4-4-4" />
		<path d="M17 20V4" />
		<path d="m3 8 4-4 4 4" />
		<path d="M7 4v16" />
	</svg>
);

/**
 * SVG icon for Dynamic Ship Scavenging.
 * @constant
 */
const ScavengeIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="48"
		height="48"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
	</svg>
);

/**
 * @constant {Feature[]} FEATURES_DATA
 * @description An array containing the data for all gameplay features. This data is self-contained
 * within the component, eliminating the need for props.
 */
const FEATURES_DATA: readonly Feature[] = [
	{
		id: 1,
		icon: SolarIcon,
		title: 'Solar-Powered Drifting',
		description:
			"Harness the power of the nearest star to execute flawless, silent drifts. Your ship's solar sails recharge your boost gauge, rewarding tactical positioning and sun-chasing maneuvers.",
	},
	{
		id: 2,
		icon: PowerIcon,
		title: 'Strategic Power Diversion',
		description:
			'Instantly reroute energy between shields, weapons, and engines. Sacrifice defense for a speed boost, or go all-out on offense by draining engine power for a devastating laser barrage.',
	},
	{
		id: 3,
		icon: ScavengeIcon,
		title: 'Dynamic Ship Scavenging',
		description:
			'Wreckage is your resource. Scavenge parts from defeated foes to repair your ship, replenish ammo, or discover rare, temporary upgrades that can turn the tide of your next encounter.',
	},
];

//==============================================================================
// ANIMATION VARIANTS
//==============================================================================

/**
 * @description Animation variants for the main title.
 * Defines a gentle fade-in and slide-down effect.
 */
const titleVariants: Variants = {
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
 * @description Animation variants for the container of feature cards.
 * Provides a staggered entrance effect for the children.
 */
const gridVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
};

/**
 * @description Animation variants for each individual feature card.
 * Defines how each card fades in and moves up.
 */
const cardVariants: Variants = {
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


//==============================================================================
// CORE COMPONENT
//==============================================================================

/**
 * Renders the GameplayFeatures section.
 * This component is self-contained and does not require any props. It uses constant data
 * defined within the file to display a list of core gameplay mechanics.
 * @returns {JSX.Element} The rendered gameplay features section.
 */
export const GameplayFeatures = (): JSX.Element => {
	return (
		<section
			className="w-full overflow-hidden bg-gray-900 py-16 px-8 font-sans text-gray-200"
			aria-labelledby="gameplay-features-title"
		>
			<div className="mx-auto max-w-7xl text-center">
				<motion.h2
					id="gameplay-features-title"
					className="mb-12 text-4xl font-bold uppercase tracking-wider text-white"
					variants={titleVariants as Variants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.5 }}
				>
					Core Mechanics
				</motion.h2>
				<motion.div
					className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
					variants={gridVariants as Variants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
				>
					{FEATURES_DATA.map((feature) => (
						<motion.div
							key={feature.id}
							className="flex flex-col items-center rounded-lg border border-gray-700 bg-gray-800 p-8 text-center transition-colors duration-300 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/20"
							variants={cardVariants as Variants}
							whileHover={{ scale: 1.05, y: -8 }}
							transition={{ type: 'spring', stiffness: 260, damping: 15 }}
						>
							<div className="mb-6 text-sky-400" aria-hidden="true">
								{feature.icon}
							</div>
							<h3 className="mb-3 text-xl font-semibold text-gray-50">
								{feature.title}
							</h3>
							<p className="flex-grow text-base leading-relaxed text-gray-300">
								{feature.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

