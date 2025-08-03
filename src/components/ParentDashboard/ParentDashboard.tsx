import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// As per the project structure, we import the child component.
// This component is self-contained and does not require any props.
import HolographicReportCard from '../HolographicReportCard/HolographicReportCard';

/**
 * @namespace ParentDashboard
 * @description A module containing the ParentDashboard component, designed for displaying student information.
 * This adheres to a strict no-props architecture, where child components are self-sufficient.
 */

// Animation variants for the container to orchestrate the children's animations.
const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.3,
			delayChildren: 0.2,
		},
	},
};

// Animation variants for the child elements (title and report card).
const itemVariants: Variants = {
	hidden: { y: 20, opacity: 0 },
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
 * @component ParentDashboard
 * @description The main view for a logged-in parent. Its primary purpose is to display
 * the student's report card in a visually appealing layout. It is a simple container
 * for the report card component.
 *
 * This component is designed to be a top-level view within the parent's authenticated
 * section of the application. It provides a clean, focused space for presenting critical
 * student information.
 *
 * In a real-world application, this component should be wrapped by a React `ErrorBoundary`
 * at the routing level to catch and handle any potential rendering errors from its children,
 * ensuring a robust user experience.
 *
 * Following the strict architectural principle of this project, this component does not
 * accept any props. It relies on the imported `HolographicReportCard` component to manage
 * its own state and data, which is sourced from a constant data file.
 *
 * @returns {JSX.Element} The rendered ParentDashboard component, featuring a title and the student's report card.
 */
const ParentDashboard = (): JSX.Element => {
	return (
		<motion.main
			className="flex min-h-screen w-full flex-col items-center justify-start bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-100 to-slate-100 p-4 pt-16 font-sans md:p-16"
			role="main"
			aria-labelledby="dashboard-title"
			variants={containerVariants as Variants}
			initial="hidden"
			animate="visible"
		>
			<motion.h1
				id="dashboard-title"
				className="mb-10 text-center font-bold text-gray-800 text-[clamp(1.75rem,_5vw,_2.5rem)]"
				variants={itemVariants as Variants}
			>
				Student Progress Overview
			</motion.h1>

			{/* The primary content of the dashboard is the student's report card. */}
			<motion.div variants={itemVariants as Variants} className="w-full max-w-4xl">
				<HolographicReportCard />
			</motion.div>
		</motion.main>
	);
};

export default ParentDashboard;