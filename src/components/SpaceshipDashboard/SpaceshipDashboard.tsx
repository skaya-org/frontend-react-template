import React, { useState, useEffect, JSX } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import CockpitHeader from '../CockpitHeader/CockpitHeader';
import PlanetarySystemView from '../PlanetarySystemView/PlanetarySystemView';
import WarpJumpLog from '../WarpJumpLog/WarpJumpLog';
import CometAlert from '../CometAlert/CometAlert';
import BlackHoleMinigame from '../BlackHoleMinigame/BlackHoleMinigame';

/**
 * @component ErrorFallback
 * @description A visually themed component to display when a critical error occurs in a child component.
 * @param {object} props - The props object.
 * @param {Error} props.error - The error that was caught by the ErrorBoundary.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const ErrorFallback = ({ error }: { error: Error }): JSX.Element => (
	<div
		role="alert"
		className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-red-500 bg-red-900/30 p-8 text-center"
	>
		<h2 className="text-xl font-bold text-red-300">SYSTEM MALFUNCTION</h2>
		<p className="mt-2 text-red-200">
			A critical error was detected in one of the dashboard modules:
		</p>
		<pre className="mt-4 whitespace-pre-wrap text-red-200">
			{error.message}
		</pre>
	</div>
);

// Animation Variants for the dashboard boot-up sequence
const dashboardVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const headerVariants: Variants = {
	hidden: { opacity: 0, y: -50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { type: 'spring', stiffness: 120, damping: 20 },
	},
};

const mainContentVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const panelVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.4, ease: 'easeOut' },
	},
};

/**
 * @component SpaceshipDashboard
 * @description The main container component for the spaceship-themed crypto dashboard.
 * It assembles all the primary UI sections, including the header, main content, and sidebar.
 * It also manages the state for showing and hiding overlay components like `CometAlert` and
 * `BlackHoleMinigame` based on simulated, time-based events.
 * @returns {JSX.Element} The fully assembled spaceship dashboard.
 */
const SpaceshipDashboard = (): JSX.Element => {
	/**
	 * @state {boolean} isAlertVisible - Controls the visibility of the CometAlert overlay.
	 */
	const [isAlertVisible, setAlertVisible] = useState(false);

	/**
	 * @state {boolean} isMinigameVisible - Controls the visibility of the BlackHoleMinigame overlay.
	 */
	const [isMinigameVisible, setMinigameVisible] = useState(false);

	/**
	 * @effect
	 * Simulates periodic market swing notifications.
	 * An interval is set up to randomly trigger the `CometAlert` component.
	 * When triggered, the alert is visible for a short duration before automatically disappearing.
	 */
	useEffect(() => {
		const alertInterval = setInterval(() => {
			// 25% chance to show an alert every 15 seconds
			if (Math.random() < 0.25) {
				setAlertVisible(true);
				setTimeout(() => {
					setAlertVisible(false);
				}, 5000); // Alert stays for 7 seconds
			}
		}, 1500); // Check every 1.5 seconds

		return () => clearInterval(alertInterval);
	}, []);

	/**
	 * @effect
	 * Simulates a rare, major market event (like a "market crash").
	 * After a longer delay, it triggers the `BlackHoleMinigame` overlay. The minigame
	 * represents a timed event and will disappear after its duration is over.
	 */
	useEffect(() => {
		const minigameTimer = setTimeout(() => {
			setMinigameVisible(true);
			const minigameDurationTimer = setTimeout(() => {
				setMinigameVisible(false);
			}, 25000); // Minigame event lasts for 25 seconds

			return () => clearTimeout(minigameDurationTimer);
		}, 4000); // Trigger after 4.5 seconds from launch

		return () => clearTimeout(minigameTimer);
	}, []);

	return (
		<motion.div
			className="flex h-screen w-screen flex-col overflow-hidden bg-[#000010] text-gray-200"
			style={{
				backgroundImage: `
          radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
          radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
          radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
          radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px)
        `,
				backgroundSize: '550px 550px, 350px 350px, 250px 250px, 150px 150px',
				backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px',
			}}
			variants={dashboardVariants as Variants}
			initial="hidden"
			animate="visible"
		>
			<motion.div variants={headerVariants as Variants}>
				<CockpitHeader />
			</motion.div>

			<motion.main
				className="flex flex-1 gap-4 overflow-hidden p-4"
				variants={mainContentVariants as Variants}
			>
				<ErrorBoundary FallbackComponent={ErrorFallback}>
					<motion.div
						className="flex flex-[3] flex-col rounded-lg border border-[rgba(0,190,255,0.3)] bg-[rgba(0,0,20,0.5)] backdrop-blur-[10px]"
						variants={panelVariants as Variants}
					>
						<PlanetarySystemView />
					</motion.div>
					<motion.aside
						className="flex flex-1 flex-col rounded-lg border border-[rgba(0,190,255,0.3)] bg-[rgba(0,0,20,0.5)] backdrop-blur-[10px]"
						variants={panelVariants as Variants}
					>
						<WarpJumpLog />
					</motion.aside>
				</ErrorBoundary>
			</motion.main>

			<AnimatePresence>
				{isAlertVisible && (
					<motion.div
						className="pointer-events-none fixed inset-0 z-[1000] flex items-start justify-center pt-[80px]"
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50, transition: { duration: 0.3 } }}
						transition={{ type: 'spring', stiffness: 200, damping: 20 }}
					>
						<div className="pointer-events-auto">
							<CometAlert />
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{isMinigameVisible && (
					<motion.div
						className="pointer-events-none fixed inset-0 z-[1000] flex items-center justify-center"
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
						transition={{ duration: 0.7, ease: 'backInOut' }}
					>
						<div className="pointer-events-auto">
							<BlackHoleMinigame />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default SpaceshipDashboard;