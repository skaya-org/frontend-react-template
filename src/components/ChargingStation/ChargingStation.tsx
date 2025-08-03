import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// --- ANIMATION VARIANTS ---

/**
 * @constant stationVariants
 * @description Framer Motion variants for the charging station container.
 * It includes an initial entrance animation (fade in and scale up) and a
 * continuous, pulsating glow effect on the box-shadow.
 * @type {Variants}
 */
const stationVariants: Variants = {
	initial: {
		opacity: 0,
		scale: 0.5,
	},
	animate: {
		opacity: 1,
		scale: 1,
		boxShadow: [
			'0 0 15px 5px rgba(0, 255, 255, 0.75)',
			'0 0 25px 10px rgba(0, 255, 255, 0.75)',
			'0 0 15px 5px rgba(0, 255, 255, 0.75)',
		],
		transition: {
			// Entrance animation transition
			scale: {
				type: 'spring',
				stiffness: 120,
				damping: 10,
			},
			opacity: {
				duration: 0.5,
				ease: 'easeOut',
			},
			// Continuous pulse animation transition
			boxShadow: {
				duration: 2.5,
				repeat: Infinity,
				repeatType: 'mirror',
				ease: 'easeInOut',
			},
		},
	},
};

/**
 * @constant iconVariants
 * @description Framer Motion variants for the inner SVG icon.
 * This creates a subtle scaling pulse that is synchronized with the
 * container's glow, reinforcing the "charging" effect.
 * @type {Variants}
 */
const iconVariants: Variants = {
	animate: {
		scale: [1, 1.1, 1],
		transition: {
			duration: 2.5,
			repeat: Infinity,
			repeatType: 'mirror',
			ease: 'easeInOut',
		},
	},
};

/**
 * @component ChargingStation
 * @description A visual component representing the critter's destination or "goal".
 * It is styled with a distinct neon theme to be easily identifiable. The component is
 * entirely self-contained, using Tailwind CSS for styling and requiring no props.
 * A synchronized pulsating animation from `framer-motion` on both the container
 * and the icon gives it a dynamic, "live" feel, reinforcing its purpose as a charging point.
 *
 * @returns {JSX.Element} The rendered ChargingStation component.
 */
const ChargingStation = (): JSX.Element => {
	return (
		<motion.div
			className="relative flex h-[80px] w-[80px] items-center justify-center rounded-full border-2 border-[#00ffff] bg-[#00ffff]/10"
			variants={stationVariants as Variants}
			initial="initial"
			animate="animate"
			aria-label="Critter charging station"
		>
			{/*
        This embedded SVG represents a simple power/lightning icon,
        making the station's purpose universally understandable without extra assets.
        It is also animated to pulse in sync with the outer glow.
      */}
			<motion.svg
				className="h-[45%] w-[45%] fill-white drop-shadow-[0_0_5px_#00ffff]"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				variants={iconVariants as Variants}
				animate="animate"
			>
				<path d="M7 21L12 12L7 3H17L12 12L17 21H7Z" />
			</motion.svg>
		</motion.div>
	);
};

export default ChargingStation;