import React, { JSX } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';

// Import required components from their specified paths
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import AboutSection from '../AboutSection/AboutSection';
import ExperienceSection from '../ExperienceSection/ExperienceSection';
import SkillsSection from '../SkillsSection/SkillsSection';
import FloatingDock from '../FloatingDock/FloatingDock';

/**
 * @typedef {object} ErrorFallbackUIProps
 * @property {Error} error - The error that was caught by the ErrorBoundary.
 */

/**
 * A simple, styled fallback component to display when an error occurs.
 * This component is used by the ErrorBoundary to provide a user-friendly error message.
 *
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} The UI to render when an error is caught.
 */
const ErrorFallback = ({ error }: FallbackProps): JSX.Element => (
	<div
		role="alert"
		className="rounded-lg border border-red-800 bg-red-50 p-5 text-center text-red-800"
	>
		<h2 className="mb-2 text-lg font-bold">Something went wrong.</h2>
		<p className="mb-4">
			We're sorry, but the profile page encountered an unexpected error.
		</p>
		<pre className="whitespace-pre-wrap break-all rounded bg-red-100 p-2 text-left text-sm">
			{error.message}
		</pre>
	</div>
);

// Animation variants for the main container and its children
const pageContainerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15, // A slight delay between each section animating in
		},
	},
};

const sectionVariants: Variants = {
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

const dockVariants: Variants = {
	hidden: { y: '100%', opacity: 0 },
	visible: {
		y: '0%',
		opacity: 1,
		transition: {
			type: 'spring',
			stiffness: 80,
			damping: 20,
			delay: 0.8, // Appears after the main content has animated in
		},
	},
};

/**
 * ApolloProfilePage serves as the main container for the Apollo Hospital profile.
 * It follows a LinkedIn-style layout by composing several specialized child components.
 * This component is self-contained and does not accept any props, as it relies on
 * constant data within its child components.
 *
 * It structures the profile by sequentially rendering:
 * 1. `ProfileHeader`: The main banner and branding.
 * 2. `AboutSection`: A detailed description of the hospital.
 * 3. `ExperienceSection`: Key departments and milestones.
 * 4. `SkillsSection`: A list of services and specialties.
 * 5. `FloatingDock`: A persistent navigation element for user convenience.
 *
 * An `ErrorBoundary` is used to wrap the main content, ensuring that any rendering
 * errors in the child components are caught gracefully without crashing the entire page.
 *
 * @returns {JSX.Element} The fully assembled Apollo Hospital profile page.
 */
const ApolloProfilePage = (): JSX.Element => {
	return (
		<div className="flex min-h-screen flex-col items-center bg-stone-100">
			<motion.main
				className="flex w-full max-w-6xl flex-col gap-6 p-6"
				variants={pageContainerVariants as Variants}
				initial="hidden"
				animate="visible"
			>
				<ErrorBoundary FallbackComponent={ErrorFallback}>
					{/* ProfileHeader: Displays the top card with banner, logo, and hospital name. */}
					<motion.div variants={sectionVariants as Variants}>
						<ProfileHeader />
					</motion.div>

					{/* AboutSection: Provides a detailed summary of the hospital's mission and history. */}
					<motion.div variants={sectionVariants as Variants}>
						<AboutSection />
					</motion.div>

					{/* ExperienceSection: Lists key departments or significant milestones. */}
					<motion.div variants={sectionVariants as Variants}>
						<ExperienceSection />
					</motion.div>

					{/* SkillsSection: Showcases all services, specialties, and technologies. */}
					<motion.div variants={sectionVariants as Variants}>
						<SkillsSection />
					</motion.div>
				</ErrorBoundary>
			</motion.main>
			{/* FloatingDock: A persistent navigation element for easy access to actions. */}
			<motion.div
				variants={dockVariants as Variants}
				initial="hidden"
				animate="visible"
				// Wrapper div to apply motion without affecting FloatingDock's internal styling
				className="fixed bottom-0 z-50 w-full"
			>
				<FloatingDock />
			</motion.div>
		</div>
	);
};

export default ApolloProfilePage;