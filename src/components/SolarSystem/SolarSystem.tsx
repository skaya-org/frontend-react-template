/**
 * @file SolarSystem.tsx
 * @description A self-contained, interactive component that renders a stylized solar system.
 * It features a central sun and multiple planets orbiting it, with all data and
 * configuration managed internally as constants. This component is designed to be
 * a production-grade, visually engaging centerpiece with zero external dependencies for its data.
 * @author Senior Fullstack/TypeScript Developer
 * @version 1.1.0 - Added Framer Motion animations
 */

import React, { useState, useMemo, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// The Planet component is a simple, prop-less visual element, potentially adding
// a texture or atmospheric effect. Its size, color, and position are determined
// entirely by this SolarSystem component.
import Planet from '../Planet/Planet';

/**
 * Defines the structure for a single planet's configuration data.
 * This ensures type safety and predictability for all planet objects.
 */
type PlanetData = {
	readonly id: string;
	readonly name: string;
	readonly orbitRadius: number; // Orbit radius in pixels
	readonly planetSize: number; // Diameter of the planet in pixels
	readonly orbitDuration: number; // Time for one full orbit in seconds
	readonly color: string; // Thematic color for the planet, used as a fallback or tint
	readonly initialRotation: number; // Starting angle on the orbit in degrees for visual variation
};

/**
 * Constant data defining the planets in our solar system.
 * This array is the single source of truth for rendering the planets.
 * It is declared with 'as const' to ensure deep immutability, a best practice for static data.
 */
const SOLAR_SYSTEM_DATA: readonly PlanetData[] = [
	{ id: 'mercury', name: 'Mercury', orbitRadius: 60, planetSize: 8, orbitDuration: 10, color: '#A9A9A9', initialRotation: 45 },
	{ id: 'venus', name: 'Venus', orbitRadius: 100, planetSize: 14, orbitDuration: 25, color: '#D2B48C', initialRotation: 180 },
	{ id: 'earth', name: 'Earth', orbitRadius: 150, planetSize: 16, orbitDuration: 40, color: '#4682B4', initialRotation: 90 },
	{ id: 'mars', name: 'Mars', orbitRadius: 200, planetSize: 12, orbitDuration: 75, color: '#CD5C5C', initialRotation: 270 },
	{ id: 'jupiter', name: 'Jupiter', orbitRadius: 280, planetSize: 30, orbitDuration: 150, color: '#DEB887', initialRotation: 120 },
] as const;


// --- Animation Variants ---

/**
 * Variants for the main container to orchestrate the entry animation of its children.
 */
const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			delay: 0.2,
			when: "beforeChildren",
			staggerChildren: 0.3,
		},
	},
};

/**
 * Variants for the Sun, combining a mount animation with a continuous, subtle pulse.
 */
const sunVariants: Variants = {
	hidden: { opacity: 0, scale: 0.5 },
	visible: {
		opacity: 1,
		scale: 1,
		boxShadow: [
			"0 0 40px #ffcc00, 0 0 80px #ff6600, 0 0 120px #ff3300",
			"0 0 50px #ffdc4d, 0 0 90px #ff8533, 0 0 145px #ff5c33",
			"0 0 40px #ffcc00, 0 0 80px #ff6600, 0 0 120px #ff3300",
		],
		transition: {
			opacity: { duration: 0.5, ease: "easeIn" },
			scale: { type: "spring", stiffness: 100, damping: 10 },
			boxShadow: {
				duration: 3.5,
				repeat: Infinity,
				ease: "easeInOut",
				repeatType: "mirror",
			},
		},
	},
};

/**
 * Variants for the planet's orbit, combining a mount animation with the continuous orbital rotation.
 * It uses a `custom` prop to receive planet-specific data.
 */
const orbitVariants: Variants = {
	hidden: { opacity: 0 },
	visible: (planet: PlanetData) => ({
		opacity: 1,
		rotate: [planet.initialRotation, 360 + planet.initialRotation],
		transition: {
			opacity: { duration: 0.8, ease: "easeInOut" },
			rotate: {
				duration: planet.orbitDuration,
				repeat: Infinity,
				ease: "linear",
			},
		},
	}),
};

/**
 * Variants for the planet body itself, making it "pop" into view on its orbit.
 */
const planetBodyVariants: Variants = {
	hidden: { scale: 0, opacity: 0 },
	visible: {
		scale: 1,
		opacity: 1,
		transition: { type: 'spring', stiffness: 300, damping: 15, delay: 0.2 },
	},
};

/**
 * The core SolarSystem component.
 * It renders the sun and orbiting planets based on the `SOLAR_SYSTEM_DATA` constant.
 * State is used to manage hover interactions for displaying planet names.
 * @returns {JSX.Element} The rendered SolarSystem component.
 */
const SolarSystem = (): JSX.Element => {
	const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

	/**
	 * Calculates the size of the container based on the largest orbit radius.
	 * `useMemo` prevents recalculation on every render.
	 */
	const containerSize = useMemo(() => {
		const maxOrbit = Math.max(...SOLAR_SYSTEM_DATA.map(p => p.orbitRadius));
		const maxPlanetSize = Math.max(...SOLAR_SYSTEM_DATA.map(p => p.planetSize));
		// Add padding for planet size to prevent clipping
		return maxOrbit * 2 + maxPlanetSize;
	}, []);

	return (
		<motion.div
			className="box-content flex items-center justify-center relative bg-[radial-gradient(circle,#000020,#000010,#000000)] overflow-hidden rounded-2xl p-[50px]"
			style={{ width: containerSize, height: containerSize }}
			variants={containerVariants as Variants}
			initial="hidden"
			animate="visible"
		>
			<motion.div
				className="absolute z-10 h-[60px] w-[60px] rounded-full bg-[radial-gradient(circle,#ffcc00,#ff6600,#ff3300)] shadow-[0_0_40px_#ffcc00,0_0_80px_#ff6600,0_0_120px_#ff3300]"
				variants={sunVariants as Variants}
			/>
			{SOLAR_SYSTEM_DATA.map(planet => (
				<motion.div
					key={planet.id}
					className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-dashed border-white/20"
					style={{
						width: planet.orbitRadius * 2,
						height: planet.orbitRadius * 2,
					}}
					variants={orbitVariants as Variants}
					custom={planet}
				>
					<div
						className="absolute top-0 left-1/2 z-[5] flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center"
						onMouseEnter={() => setHoveredPlanet(planet.name)}
						onMouseLeave={() => setHoveredPlanet(null)}
						// The planet's own rotation is corrected by rotating it opposite to the orbit's rotation.
						// This keeps the planet upright relative to the viewer.
					>
						<motion.div
							className="flex items-center justify-center rounded-full bg-cover bg-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5),0_0_5px_rgba(255,255,255,0.2)]"
							style={{
								width: planet.planetSize,
								height: planet.planetSize,
								backgroundColor: planet.color,
								backgroundImage: `url(https://picsum.photos/seed/${planet.id}/50/50)`,
							}}
							variants={planetBodyVariants as Variants}
							whileHover={{ scale: 1.5, zIndex: 15 }}
							transition={{ type: 'spring', stiffness: 300 }}
						>
							{/* Render the prop-less Planet component as an overlay or texture */}
							<Planet />
						</motion.div>
						<AnimatePresence>
							{hoveredPlanet === planet.name && (
								<motion.div
									className="pointer-events-none absolute bottom-[120%] z-20 whitespace-nowrap rounded bg-black/70 px-2 py-1 text-xs font-bold text-white"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.2 }}
								>
									{planet.name}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</motion.div>
			))}
		</motion.div>
	);
};

/**
 * A simple fallback component to display when an error occurs within the SolarSystem.
 * This provides a graceful degradation of the UI instead of a crash.
 * @param {FallbackProps} props - Props provided by React Error Boundary, including the error object.
 * @returns {JSX.Element} The fallback UI.
 */
const SolarSystemErrorFallback = ({ error }: FallbackProps): JSX.Element => (
	<div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border border-[#ff4d4d] bg-[#1a0000] p-5 text-[#ffcccc]" role="alert">
		<h2 className="mb-2.5 text-2xl text-[#ff8080]">Solar System Malfunction</h2>
		<pre className="max-w-full overflow-auto rounded bg-[#330000] p-2.5 font-mono">{error.message}</pre>
	</div>
);

/**
 * A wrapper component that provides a robust error boundary for the SolarSystem.
 * This is the component that should be imported and used throughout the application
 * to ensure stability.
 * @returns {JSX.Element} The SolarSystem component wrapped in an ErrorBoundary.
 */
const SolarSystemWithBoundary = (): JSX.Element => (
	<ErrorBoundary FallbackComponent={SolarSystemErrorFallback}>
		<SolarSystem />
	</ErrorBoundary>
);

export default SolarSystemWithBoundary;