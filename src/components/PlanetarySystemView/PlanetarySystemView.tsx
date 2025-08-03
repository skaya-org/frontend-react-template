import React, { JSX, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import TokenPlanet from '../TokenPlanet/TokenPlanet';

/**
 * @typedef {object} TokenData
 * @property {string} id - A unique identifier for the token.
 * @property {string} name - The full name of the cryptocurrency.
 * @property {string} symbol - The ticker symbol for the cryptocurrency.
 * @property {string} imageUrl - The URL for the token's visual representation.
 * @property {number} size - The diameter of the planet in pixels.
 * @property {number} orbitRadius - The radius of the planet's orbit in pixels.
 * @property {number} orbitDuration - The time in seconds for one complete orbit.
 * @property {number} initialAngle - The starting angle in degrees on the orbit path.
 */
type TokenData = {
  id: string;
  name: string;
  symbol:string;
  imageUrl: string;
  size: number;
  orbitRadius: number;
  orbitDuration: number;
  initialAngle: number;
};

/**
 * Constant data for the cryptocurrency tokens to be displayed as planets.
 * This self-contained data ensures the component is decoupled and requires no props.
 * @const {TokenData[]} TOKEN_SYSTEM_DATA
 */
const TOKEN_SYSTEM_DATA: Readonly<TokenData[]> = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    imageUrl: 'https://picsum.photos/seed/btc/100/100.webp',
    size: 60,
    orbitRadius: 120,
    orbitDuration: 25,
    initialAngle: 45,
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    imageUrl: 'https://picsum.photos/seed/eth/80/80.webp',
    size: 50,
    orbitRadius: 220,
    orbitDuration: 35,
    initialAngle: 180,
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    imageUrl: 'https://picsum.photos/seed/sol/70/70.webp',
    size: 45,
    orbitRadius: 310,
    orbitDuration: 45,
    initialAngle: 270,
  },
  {
    id: 'doge',
    name: 'Dogecoin',
    symbol: 'DOGE',
    imageUrl: 'https://picsum.photos/seed/doge/60/60.webp',
    size: 35,
    orbitRadius: 380,
    orbitDuration: 20,
    initialAngle: 90,
  },
    {
    id: 'ada',
    name: 'Cardano',
    symbol: 'ADA',
    imageUrl: 'https://picsum.photos/seed/ada/65/65.webp',
    size: 40,
    orbitRadius: 450,
    orbitDuration: 60,
    initialAngle: 0,
  },
];

/**
 * A fallback component to display when an error occurs within the PlanetarySystemView.
 * @param {{ error: Error }} props - The props containing the error information.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const PlanetaryErrorFallback = ({ error }: { error: Error }): JSX.Element => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-[#1a1a2e] font-mono text-[#e0e0e0]">
    <h1 className="text-3xl text-[#ff6b6b]">Galactic Anomaly Detected</h1>
    <p>The planetary system view failed to render.</p>
    <pre className="mt-4 max-w-[80%] whitespace-pre-wrap text-center">{error.message}</pre>
  </div>
);


// --- Animation Variants ---

/**
 * Variants for the main container to orchestrate the animations of its children.
 * The system fades in and then staggers the appearance of each celestial body.
 */
const systemContainerVariants: Variants = {
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
 * Variants for the central star. It fades and scales in with a gentle pulse.
 */
const sunVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
      duration: 1.5,
    },
  },
};

/**
 * Variants for each planet's orbit path. They fade in and expand to full size.
 */
const orbitPathVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: "circOut",
    },
  },
};

/**
 * Variants for the container that handles a planet's rotation.
 * It fades the planet in and then begins its infinite orbital rotation.
 * The `custom` prop is used to pass planet-specific data for the animation.
 */
const planetContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (custom: { orbitDuration: number; initialAngle: number }) => ({
      opacity: 1,
      rotate: [custom.initialAngle, custom.initialAngle + 360],
      transition: {
        opacity: { duration: 1, ease: 'easeIn' },
        rotate: {
          duration: custom.orbitDuration,
          ease: 'linear',
          repeat: Infinity,
        },
      },
    }),
  };

/**
 * `PlanetarySystemView` is a major dashboard section that visualizes a collection
 * of cryptocurrency tokens as a planetary system. Each token orbits a central "sun,"
 * creating a dynamic and engaging galaxy map. The component is self-contained and
 * uses constant data, requiring no props.
 *
 * @component
 * @returns {JSX.Element} The rendered PlanetarySystemView component.
 */
const PlanetarySystemView = (): JSX.Element => {
  // useMemo is used to ensure the list of planets is stable between re-renders,
  // although with constant data it's a micro-optimization and good practice.
  const planets = useMemo(() => TOKEN_SYSTEM_DATA, []);

  return (
    <ErrorBoundary FallbackComponent={PlanetaryErrorFallback}>
      <motion.div
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_#1c2130_0%,_#0c0d14_100%)] [perspective:1000px]"
        aria-label="Cryptocurrency Planetary System"
        variants={systemContainerVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative flex h-px w-px items-center justify-center">
          <motion.div
            className="absolute z-10 h-20 w-20 rounded-full bg-[radial-gradient(ellipse_at_center,_#ffecb3_0%,_#ff8f00_100%)] shadow-[0_0_40px_10px_#ffc107,0_0_80px_20px_#ff9800,inset_0_0_20px_#ffeb3b]"
            role="img"
            aria-label="Central Star"
            variants={sunVariants as Variants}
          ></motion.div>
          <AnimatePresence>
            {planets.map((planet) => (
              <React.Fragment key={planet.id}>
                {/* Visual representation of the orbit path */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15"
                  style={{
                    width: planet.orbitRadius * 2,
                    height: planet.orbitRadius * 2,
                  }}
                  aria-hidden="true"
                  variants={orbitPathVariants as Variants}
                />
                {/* The rotating arm that controls the planet's orbital motion */}
                <motion.div
                  className="absolute left-0 top-0 h-full w-full"
                  aria-label={`${planet.name} orbit`}
                  variants={planetContainerVariants as Variants}
                  custom={{
                    orbitDuration: planet.orbitDuration,
                    initialAngle: planet.initialAngle,
                  }}
                >
                  {/* Container to position the planet at the end of the arm */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      // Pushes the planet out from the center by its orbit radius
                      top: `calc(50% - ${planet.orbitRadius}px)`,
                    }}
                  >
                     {/* The actual TokenPlanet component */}
                     <TokenPlanet
                      />
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};

export default PlanetarySystemView;