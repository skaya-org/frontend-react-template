import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// --- CONSTANT DATA ---

/**
 * @typedef {object} PlanetStat
 * @property {string} label - The name of the statistic (e.g., "Diameter").
 * @property {string} value - The value of the statistic (e.g., "15,299 km").
 */
interface PlanetStat {
  label: string;
  value: string;
}

/**
 * @typedef {object} PlanetData
 * @property {string} name - The name of the planet.
 * @property {string} description - A detailed paragraph describing the planet.
 * @property {string} image - The URL for the planet's image.
 * @property {PlanetStat[]} stats - An array of key statistics about the planet.
 */
interface PlanetData {
  name: string;
  description: string;
  image: string;
  stats: PlanetStat[];
}

/**
 * Self-contained data for the PlanetInfoCard component.
 * This ensures the component is fully independent and requires no external props.
 * The data represents a fictional exoplanet to fit a space theme.
 * @const {PlanetData}
 */
const planetData: PlanetData = {
  name: 'Xylos',
  description: 'A terrestrial exoplanet orbiting a binary star system, Xylos is renowned for its crystalline forests that shimmer with captured starlight and its vast, serene oceans of liquid nitrogen. The planet exists in a state of perpetual twilight, creating a dreamlike and ethereal landscape.',
  image: 'https://picsum.photos/seed/xylos-planet/400/600.webp',
  stats: [
    { label: 'Diameter', value: '14,820 km' },
    { label: 'Mass', value: '2.1 x 10^24 kg' },
    { label: 'Distance', value: '68.5 Light Years' },
  ],
};

// --- ANIMATION VARIANTS ---

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      when: 'beforeChildren', // Ensure card animates in before its children
      staggerChildren: 0.1,
    },
  },
};

const imageVariants: Variants = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1], // A smooth quintic ease-out
    },
  },
};

const contentContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const titleGlowVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    textShadow: '0 0 0px rgba(56,189,248,0)',
  },
  visible: {
    opacity: 1,
    y: 0,
    textShadow: '0 0 5px rgba(56,189,248,0.8), 0 0 10px rgba(56,189,248,0.6), 0 0 20px rgba(56,189,248,0.4)',
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const statItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
};


// --- HELPER COMPONENTS ---

/**
 * A small, reusable component to display a single statistic.
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the statistic.
 * @param {string} props.value - The value of the statistic.
 * @returns {JSX.Element} The rendered statistic item.
 */
const StatItem = ({ label, value }: { label: string; value: string }): JSX.Element => (
  <div className="flex flex-col">
    <span className="text-sm font-semibold text-sky-300 uppercase tracking-wider">{label}</span>
    <span className="text-xl font-medium text-sky-50">{value}</span>
  </div>
);

/**
 * A fallback component to display when the PlanetInfoCard encounters an error.
 * This ensures a graceful failure and provides useful debugging information in development.
 * @param {FallbackProps} props - Props provided by React Error Boundary.
 * @param {Error} props.error - The error that was caught.
 * @returns {JSX.Element} The rendered error fallback UI.
 */
const PlanetCardErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div
    className="flex flex-col items-center justify-center p-8 border border-dashed border-red-400 rounded-lg bg-red-900/20 text-red-200"
    role="alert"
  >
    <h3 className="mb-2 text-lg font-bold text-red-400">Something went wrong</h3>
    <p>The Planet Card could not be displayed.</p>
    <pre className="mt-2 text-xs text-red-300">{error.message}</pre>
  </div>
);

// --- CORE COMPONENT ---

/**
 * The core implementation of the PlanetInfoCard component.
 * It renders the planet's image, name, description, and key statistics
 * using the self-contained `planetData` constant.
 * @returns {JSX.Element} The rendered planet information card.
 */
const PlanetInfoCardCore = (): JSX.Element => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 p-8 font-sans">
      <motion.div
        className="flex flex-col md:flex-row w-full max-w-4xl rounded-2xl overflow-hidden bg-slate-900/85 backdrop-blur-lg border border-sky-400/20 shadow-2xl shadow-black/40 text-sky-100"
        variants={cardVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="md:w-2/5 flex-shrink-0" variants={imageVariants as Variants}>
          <img
            src={planetData.image}
            alt={`An artist's impression of the planet ${planetData.name}`}
            className="w-full h-64 md:h-full object-cover"
          />
        </motion.div>
        <motion.div
          className="p-8 md:p-10 flex flex-col justify-center"
          variants={contentContainerVariants as Variants}
        >
          <motion.h2
            className="mb-4 text-4xl font-bold text-sky-50 [text-shadow:0_0_5px_rgba(56,189,248,0.8),0_0_10px_rgba(56,189,248,0.6),0_0_20px_rgba(56,189,248,0.4)]"
            variants={titleGlowVariants as Variants}
          >
            {planetData.name}
          </motion.h2>
          <motion.p
            className="mb-8 text-base leading-relaxed text-slate-300"
            variants={textItemVariants as Variants}
          >
            {planetData.description}
          </motion.p>
          <motion.div
            className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6 border-t border-sky-400/20 pt-6"
            variants={contentContainerVariants as Variants}
          >
            {planetData.stats.map((stat) => (
              <motion.div key={stat.label} variants={statItemVariants as Variants}>
                <StatItem label={stat.label} value={stat.value} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- EXPORTED COMPONENT WITH ERROR BOUNDARY ---

/**
 * A self-contained card component to display detailed information about a planet.
 * It features a space-themed design with a semi-transparent background and glowing text.
 * All data is hardcoded within the component, so it requires no props.
 * The component is wrapped in an ErrorBoundary for robust production use.
 *
 * @example
 * ```tsx
 * // In your App or a page component:
 * import PlanetInfoCard from './components/PlanetInfoCard';
 *
 * function SpacePage() {
 *   return (
 *     <div>
 *       <h1>Featured Planet</h1>
 *       <PlanetInfoCard />
 *     </div>
 *   );
 * }
 * ```
 * @returns {JSX.Element} The PlanetInfoCard component wrapped in an ErrorBoundary.
 */
const PlanetInfoCard = (): JSX.Element => (
  <ErrorBoundary FallbackComponent={PlanetCardErrorFallback}>
    <PlanetInfoCardCore />
  </ErrorBoundary>
);

export default PlanetInfoCard;