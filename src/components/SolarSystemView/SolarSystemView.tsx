import React, {
	useState,
	useCallback,
	JSX,
	createContext,
	useContext,
} from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// Per the instructions, these components are imported.
// They are expected to use the PlanetDataContext to get their data.
import Planet from '../Planet/Planet';
import PlanetInfoCard from '../PlanetInfoCard/PlanetInfoCard';

/**
 * @typedef {object} PlanetData
 * @property {string} id - A unique identifier for the planet.
 * @property {string} name - The name of the planet.
 * @property {string} description - A short description of the planet.
 * @property {string} imageUrl - URL for the planet's image.
 * @property {number} size - Visual size of the planet in pixels.
 * @property {number} orbitRadius - The radius of the orbit in pixels.
 * @property {number} orbitDuration - The time in seconds for one full orbit.
 * @property {string} color - A representative color for the planet's orbit and glow.
 */
export interface PlanetData {
	id: string;
	name: string;
	description: string;
	imageUrl: string;
	size: number;
	orbitRadius: number;
	orbitDuration: number;
	color: string;
}

/**
 * @constant {PlanetData[]} PLANET_DATA
 * @description Constant data for the planets in the solar system. This self-contained
 * data source ensures the component is plug-and-play.
 */
const PLANET_DATA: PlanetData[] = [
	{
		id: 'mercury',
		name: 'Mercury',
		description:
			"The smallest planet in our solar system and nearest to the Sun, Mercury is only slightly larger than Earth's Moon.",
		imageUrl: 'https://picsum.photos/seed/mercury/200',
		size: 24,
		orbitRadius: 80,
		orbitDuration: 10,
		color: '#A9A9A9',
	},
	{
		id: 'venus',
		name: 'Venus',
		description:
			'Venus spins slowly in the opposite direction from most planets. It has a thick atmosphere that traps heat in a runaway greenhouse effect.',
		imageUrl: 'https://picsum.photos/seed/venus/200',
		size: 40,
		orbitRadius: 130,
		orbitDuration: 25,
		color: '#E5DDCB',
	},
	{
		id: 'earth',
		name: 'Earth',
		description:
			"Our home planet is the only place we know of so far that’s inhabited by living things. It's also the only planet in our solar system with liquid water on the surface.",
		imageUrl: 'https://picsum.photos/seed/earth/200',
		size: 42,
		orbitRadius: 190,
		orbitDuration: 40,
		color: '#4A90E2',
	},
	{
		id: 'mars',
		name: 'Mars',
		description:
			'Mars is a dusty, cold, desert world with a very thin atmosphere. There is strong evidence Mars was—billions of years ago—wetter and warmer, with a thicker atmosphere.',
		imageUrl: 'https://picsum.photos/seed/mars/200',
		size: 32,
		orbitRadius: 260,
		orbitDuration: 75,
		color: '#D06F4F',
	},
	{
		id: 'jupiter',
		name: 'Jupiter',
		description:
			"Jupiter is more than twice as massive than the other planets of our solar system combined. The giant planet's Great Red Spot is a centuries-old storm bigger than Earth.",
		imageUrl: 'https://picsum.photos/seed/jupiter/200',
		size: 80,
		orbitRadius: 360,
		orbitDuration: 150,
		color: '#D8BBA2',
	},
];

/**
 * Context to provide planet data to child components (`Planet`, `PlanetInfoCard`)
 * without prop drilling, adhering to the "no props" rule for child components.
 * @type {React.Context<PlanetData | null>}
 */
export const PlanetDataContext = createContext<PlanetData | null>(null);

/**
 * Custom hook for child components to easily access the planet data.
 * Throws an error if used outside of a PlanetDataContext.Provider.
 * @returns {PlanetData} The planet data from the context.
 */
export const usePlanetData = (): PlanetData => {
	const context = useContext(PlanetDataContext);
	if (!context) {
		throw new Error('usePlanetData must be used within a PlanetDataContext.Provider');
	}
	return context;
};

/**
 * A fallback component to display when a JavaScript error occurs within the component tree.
 * @param {{ error: Error }} props - The props provided by react-error-boundary.
 * @returns {JSX.Element} A simple error message UI.
 */
const ErrorFallback = ({ error }: { error: Error }): JSX.Element => (
	<div
		role="alert"
		className="w-full h-screen flex flex-col justify-center items-center bg-zinc-900 text-white font-mono p-8"
	>
		<h2 className="text-2xl font-bold mb-4 text-red-400">Something went wrong:</h2>
		<pre className="text-red-500 bg-zinc-800 p-4 rounded-md my-4 whitespace-pre-wrap w-full max-w-2xl">
			{error.message}
		</pre>
		<p className="mt-4">Please refresh the page to try again.</p>
	</div>
);

/**
 * Injects dynamic keyframes for the orbit animation into the document's head.
 * @returns {JSX.Element} A style tag with the CSS keyframes.
 */
const OrbitKeyframes = (): JSX.Element => (
	<style>
		{`
      @keyframes spin-orbit {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .starry-bg {
        animation: move-twink-back 200s linear infinite;
        background: #000 url(https://www.script-tutorials.com/demos/360/images/stars.png) repeat top center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: -2;
      }
      @keyframes move-twink-back {
          from {background-position:0 0;}
          to {background-position:-10000px 5000px;}
      }
    `}
	</style>
);

// Animation Variants for Framer Motion

const solarSystemVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			delay: 0.5,
			staggerChildren: 0.2,
		},
	},
};

const sunVariants: Variants = {
	hidden: { opacity: 0, scale: 0.5 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 1.5,
			ease: 'easeOut',
			scale: {
				repeat: Infinity,
				repeatType: 'mirror',
				duration: 4,
				ease: 'easeInOut',
			},
		},
	},
};

const planetOrbitVariants: Variants = {
	hidden: { opacity: 0, y: -50, scale: 0.5 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { type: 'spring', stiffness: 100, damping: 12 },
	},
};

const cardWrapperVariants: Variants = {
	hidden: { opacity: 0, y: 50, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
	},
	exit: {
		opacity: 0,
		y: 30,
		scale: 0.95,
		transition: { duration: 0.3, ease: [0.5, 0, 0.75, 0] },
	},
};

/**
 * SolarSystemView
 *
 * A major feature component that renders an interactive solar system. It arranges
 * multiple 'Planet' components in a dynamic, circular CSS layout to simulate orbits
 * around a central sun. It manages which planet is selected and displays its
 * information using the 'PlanetInfoCard' component.
 *
 * This component is self-contained and uses its own constant data, requiring no props.
 *
 * @returns {JSX.Element} The rendered SolarSystemView component.
 */
const SolarSystemView = (): JSX.Element => {
	const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

	/**
	 * Handles the click event on a planet.
	 * @param {PlanetData} planet - The data of the planet that was clicked.
	 */
	const handlePlanetClick = useCallback((planet: PlanetData) => {
		setSelectedPlanet(planet);
	}, []);

	/**
	 * Closes the planet info card by resetting the selected planet state.
	 * This function is intended to be passed to the PlanetInfoCard via context.
	 */
	const handleCloseCard = useCallback(() => {
		setSelectedPlanet(null);
	}, []);

	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<OrbitKeyframes />
			<motion.div
				className="relative w-full min-h-screen flex justify-center items-center bg-black overflow-hidden [perspective:1000px]"
				variants={solarSystemVariants as Variants}
				initial="hidden"
				animate="visible"
			>
				<div className="starry-bg" />
				<motion.div
					aria-label="The Sun"
					className="absolute w-20 h-20 rounded-full bg-[#FFD700] z-20 shadow-[0_0_60px_20px_#FFD700,0_0_100px_40px_#FF8C00]"
					variants={sunVariants as Variants}
				/>

				{PLANET_DATA.map((planet) => {
					const orbitContainerStyle = {
						width: `${planet.orbitRadius * 2}px`,
						height: `${planet.orbitRadius * 2}px`,
						animation: `spin-orbit ${planet.orbitDuration}s linear infinite`,
						zIndex: 10 - PLANET_DATA.indexOf(planet), // Inner planets on top
					};

					const orbitPathStyle = {
						borderColor: `${planet.color}33`, // Use planet color with low opacity
					};

					return (
						<motion.div
							key={planet.id}
							className="absolute rounded-full flex justify-center items-start"
							style={orbitContainerStyle}
							variants={planetOrbitVariants as Variants}
						>
							<div
								className="absolute w-full h-full border border-dashed rounded-full top-0 left-0"
								style={orbitPathStyle}
							/>
							<div
								className="absolute top-0 -translate-y-1/2 cursor-pointer flex items-center justify-center"
								onClick={() => handlePlanetClick(planet)}
								role="button"
								aria-label={`Select planet ${planet.name}`}
								tabIndex={0}
							>
								<PlanetDataContext.Provider value={planet}>
									<Planet />
								</PlanetDataContext.Provider>
							</div>
						</motion.div>
					);
				})}

				<AnimatePresence>
					{selectedPlanet && (
						<PlanetDataContext.Provider value={selectedPlanet}>
							{/*
                The PlanetInfoCard component is expected to consume the PlanetDataContext
                and also get the close handler. We can pass the handler via a separate
                context or assume it's part of the component's internal logic
                (e.g., an internal close button that calls a function from context).
                For this example, we assume the PlanetInfoCard can be extended
                to accept an `onClose` prop if needed, or another context.
                For simplicity, we wrap it here.
              */}
							<motion.div
								className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
								variants={cardWrapperVariants as Variants}
								initial="hidden"
								animate="visible"
								exit="exit"
							>
								<div
									onClick={handleCloseCard}
									className="fixed inset-0 -z-[1]"
									aria-label="Close planet info"
								/>
								<PlanetInfoCard />
							</motion.div>
						</PlanetDataContext.Provider>
					)}
				</AnimatePresence>
			</motion.div>
		</ErrorBoundary>
	);
};

export default SolarSystemView;