import React, { useMemo, JSX, CSSProperties } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @namespace Constants
 * @description Contains all static data and configuration for the CockpitHeader component.
 * This ensures the component is self-contained and does not require props.
 */
const COMPONENT_DATA = {
	/**
	 * The main title displayed on the header.
	 * @type {string}
	 */
	title: 'Stardrive Crypto Command',

	/**
	 * URL for the starfield background image. Using a seeded random image for consistency.
	 * @type {string}
	 */
	starfieldImageUrl: 'https://picsum.photos/seed/stardrive-cockpit/1920/1080.webp',

	/**
	 * Configuration for the decorative status lights. Each object defines a light's color and animation timing.
	 * @type {Array<{color: string, delay: number}>}
	 */
	statusLights: [
		{ color: '#76ff03', delay: 0.1 }, // System nominal (Green)
		{ color: '#03a9f4', delay: 0.6 }, // Shields active (Blue)
		{ color: '#ffeb3b', delay: 0.3 }, // Navigation online (Yellow)
		{ color: '#ff4081', delay: 1.1 }, // Alert status (Pink)
	],
};

/**
 * @interface StatusLightProps
 * @description Defines the props for the internal StatusLight component.
 * @property {string} color - The hexadecimal color code for the light.
 * @property {number} delay - The animation delay for the blinking effect.
 * @property {CSSProperties} style - The positioning style for the light.
 */
interface StatusLightProps {
	color: string;
	delay: number;
	style: CSSProperties;
}

/**
 * @component StatusLight
 * @description An internal component that renders a single, animated status light.
 * It's used by CockpitHeader to create decorative, non-interactive elements.
 * @param {StatusLightProps} props - The properties for the status light.
 * @returns {JSX.Element} A single blinking light element.
 */
const StatusLight = ({ color, delay, style }: StatusLightProps): JSX.Element => {
	const lightVariants: Variants = useMemo(
		() => ({
			blink: {
				opacity: [0.2, 1, 0.2],
				boxShadow: [
					`0 0 2px ${color}`,
					`0 0 10px ${color}, 0 0 20px ${color}`,
					`0 0 2px ${color}`,
				],
			},
		}),
		[color],
	);

	const combinedStyles = useMemo(
		() => ({
			backgroundColor: color,
			...style,
		}),
		[color, style],
	);

	return (
		<motion.div
			className="absolute w-2.5 h-2.5 rounded-full"
			style={combinedStyles}
			variants={lightVariants as Variants}
			animate="blink"
			transition={{
				duration: 2.5,
				repeat: Infinity,
				repeatType: 'loop',
				delay,
				ease: 'easeInOut',
			}}
		/>
	);
};

/**
 * @component CockpitHeader
 * @description A static header component styled to resemble a spaceship cockpit's main viewscreen.
 * It displays a fixed title and decorative elements like a starfield background and status lights.
 * The component is entirely self-contained and requires no props, making it a simple drop-in UI element.
 * It is designed to be resilient and visually appealing without external dependencies or data.
 *
 * @example
 * // To use this component, simply import it and render it in your layout.
 * import CockpitHeader from './CockpitHeader';
 *
 * function App() {
 *   return (
 *     <div>
 *       <CockpitHeader />
 *       // ... rest of your application
 *     </div>
 *   );
 * }
 *
 * @returns {JSX.Element} The rendered spaceship cockpit header.
 */
const CockpitHeader = (): JSX.Element => {
	const cornerBaseClasses = 'absolute w-[30px] h-[30px] border-[#3A7C98]/70';

	/**
	 * @description Animation variants for the main header container.
	 * Orchestrates the staggered animation of its children.
	 */
	const headerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				when: 'beforeChildren',
				staggerChildren: 0.1,
			},
		},
	};

	/**
	 * @description Animation variants for individual items like the title, corners, and lights.
	 * Creates a subtle "pop-in" and "slide-up" effect.
	 */
	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 15, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				type: 'spring',
				stiffness: 120,
				damping: 15,
			},
		},
	};

	return (
		<motion.header
			className="relative flex min-h-[120px] items-center justify-center overflow-hidden border-b-4 border-[#3A7C98] bg-[#0A0F1A] px-8 py-6 text-[#E0F7FA] shadow-lg shadow-[#3A7C98]/40"
			variants={headerVariants as Variants}
			initial="hidden"
			animate="visible"
		>
			<motion.img
				src={COMPONENT_DATA.starfieldImageUrl}
				alt="A view of a starfield from a cockpit."
				className="pointer-events-none absolute top-0 left-[-5%] z-10 h-full w-[110%] object-cover opacity-20"
				animate={{
					x: ['-5%', '0%', '-5%'],
					scale: [1, 1.05, 1],
				}}
				transition={{
					duration: 90,
					repeat: Infinity,
					repeatType: 'mirror',
					ease: 'easeInOut',
				}}
			/>
			<div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-[#0A0F1A]/80 via-transparent to-[#0A0F1A]/80" />

			<div className="pointer-events-none absolute inset-0 z-30">
				<motion.div
					className={`${cornerBaseClasses} top-[15px] left-[15px] border-l-[3px] border-t-[3px]`}
					variants={itemVariants as Variants}
				/>
				<motion.div
					className={`${cornerBaseClasses} top-[15px] right-[15px] border-r-[3px] border-t-[3px]`}
					variants={itemVariants as Variants}
				/>
				<motion.div
					className={`${cornerBaseClasses} bottom-[15px] left-[15px] border-b-[3px] border-l-[3px]`}
					variants={itemVariants as Variants}
				/>
				<motion.div
					className={`${cornerBaseClasses} bottom-[15px] right-[15px] border-b-[3px] border-r-[3px]`}
					variants={itemVariants as Variants}
				/>
			</div>

			<motion.h1
				className="z-30 m-0 font-['Orbitron',_sans-serif] text-[clamp(1.5rem,5vw,2.5rem)] font-bold uppercase tracking-[3px] [text-shadow:0_0_5px_#00e5ff,0_0_10px_#00e5ff,0_0_20px_#00e5ff,0_0_40px_#00b8d4]"
				variants={itemVariants as Variants}
			>
				{COMPONENT_DATA.title}
			</motion.h1>

			{/* Render Status Lights with an animated wrapper for a staggered entrance */}
			{COMPONENT_DATA.statusLights.map((light, index) => (
				<motion.div
					key={index}
					className="absolute z-40"
					style={{
						top: '20px',
						left: `${20 + index * 25}px`,
					}}
					variants={itemVariants as Variants}
				>
					<StatusLight
						color={light.color}
						delay={light.delay}
						// Positioning is now handled by the motion.div wrapper
						style={{}}
					/>
				</motion.div>
			))}
		</motion.header>
	);
};

export default CockpitHeader;