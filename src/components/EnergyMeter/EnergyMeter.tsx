import React, { JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// --- CONSTANTS --- //

/**
 * @constant ENERGY_LEVEL
 * @description The static energy level to be displayed, on a scale of 0 to 100.
 * This represents the fixed group morale for the classroom.
 * @type {number}
 */
const ENERGY_LEVEL: number = 85;

/**
 * @constant MAX_ENERGY
 * @description The maximum possible energy level.
 * @type {number}
 */
const MAX_ENERGY: number = 100;

/**
 * @constant PULSE_COLOR
 * @description The color used for the pulsating glow effect on the energy fill.
 * @type {string}
 */
const PULSE_COLOR: string = 'rgba(74, 222, 128, 0.75)';

// --- ERROR BOUNDARY FALLBACK --- //

/**
 * A fallback component to be displayed when the EnergyMeter encounters a rendering error.
 * It provides a user-friendly message within the component's layout.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} The fallback UI.
 */
const EnergyMeterFallback = ({ error }: FallbackProps): JSX.Element => (
	<div
		className="flex h-[300px] w-[60px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-red-500 bg-red-950 p-4 text-center font-mono text-red-200"
		role="alert"
	>
		<div className="text-base font-bold">Energy Surge!</div>
		<p className="mt-2 text-xs">{error.message}</p>
	</div>
);

// --- ANIMATION VARIANTS --- //

/**
 * Variants for the main container to orchestrate the child animations.
 */
const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.5,
		},
	},
};

/**
 * Variants for the "Classroom Energy" text.
 */
const textVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: 'easeOut',
		},
	},
};

// --- CORE COMPONENT --- //

/**
 * EnergyMeter is a self-contained component that visualizes a static classroom
 * energy level. It uses a vertical bar with a vibrant, pulsating animation to
 * represent group morale without requiring any external props.
 *
 * @component
 * @returns {JSX.Element} A visual representation of the energy meter.
 */
const EnergyMeter = (): JSX.Element => {
	const fillHeightPercentage = (ENERGY_LEVEL / MAX_ENERGY) * 100;

	/**
	 * Variants for the energy meter's fill level and pulsating glow.
	 * Defined inside the component to access `fillHeightPercentage` and `PULSE_COLOR`.
	 */
	const meterFillVariants: Variants = {
		hidden: {
			height: '0%',
			opacity: 0,
		},
		visible: {
			height: `${fillHeightPercentage}%`,
			opacity: 1,
			boxShadow: [
				`0 0 10px 2px ${PULSE_COLOR}`,
				`0 0 25px 8px ${PULSE_COLOR}`,
				`0 0 10px 2px ${PULSE_COLOR}`,
			],
			transition: {
				height: { duration: 1.5, ease: 'easeOut' },
				opacity: { duration: 0.5 },
				boxShadow: {
					duration: 2.5,
					repeat: Infinity,
					repeatType: 'mirror',
					ease: 'easeInOut',
				},
			},
		},
	};

	return (
		<motion.div
			className="flex flex-col items-center justify-center p-8 font-sans text-gray-50"
			variants={containerVariants as Variants}
			initial="hidden"
			animate="visible"
		>
			<div className="relative flex h-[300px] w-[60px] items-end overflow-hidden rounded-xl border-4 border-gray-600 bg-gray-700 shadow-inner shadow-black/40">
				<AnimatePresence>
					<motion.div
						className="absolute bottom-0 left-0 w-full rounded-b-lg bg-gradient-to-t from-green-400 to-emerald-400"
						variants={meterFillVariants as Variants}
					/>
				</AnimatePresence>
			</div>
			<motion.p
				className="mt-4 text-xl font-semibold uppercase tracking-widest drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
				variants={textVariants as Variants}
			>
				Classroom Energy
			</motion.p>
		</motion.div>
	);
};

// --- EXPORT WITH ERROR BOUNDARY --- //

/**
 * A wrapper component that provides a safety net for the EnergyMeter.
 * It uses an ErrorBoundary to catch any potential runtime errors within the
 * EnergyMeter and displays a graceful fallback UI instead of crashing the app.
 *
 * @returns {JSX.Element} The EnergyMeter component wrapped in an ErrorBoundary.
 */
const EnergyMeterWithBoundary = (): JSX.Element => (
	<ErrorBoundary FallbackComponent={EnergyMeterFallback}>
		<EnergyMeter />
	</ErrorBoundary>
);

export default EnergyMeterWithBoundary;