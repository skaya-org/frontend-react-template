import React, { useState, useMemo, JSX, Suspense } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {object} TeamLocation
 * @property {string} id - A unique identifier for the location.
 * @property {string} name - The name of the team or office at this location.
 * @property {string} city - The city where the location is.
 * @property {{x: number; y: number}} coords - The percentage-based coordinates on the map (x, y).
 */
type TeamLocation = {
  readonly id: string;
  readonly name: string;
  readonly city: string;
  readonly coords: {
    readonly x: number;
    readonly y: number;
  };
};

/**
 * @typedef {object} CollaborationPath
 * @property {string} id - A unique identifier for the path.
 * @property {string} from - The ID of the starting TeamLocation.
 * @property {string} to - The ID of the ending TeamLocation.
 * @property {number} [tension=0.4] - The tension for the curve of the path, controlling its arc.
 */
type CollaborationPath = {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly tension?: number;
};

// --- CONSTANT DATA ---

/**
 * Pre-defined static data for team locations on the map.
 * This data is self-contained within the component, requiring no external props.
 * Coordinates are percentage-based to ensure responsiveness within the SVG's viewBox.
 * @const {ReadonlyArray<TeamLocation>}
 */
const TEAM_LOCATIONS: readonly TeamLocation[] = [
  { id: 'sf', name: 'HQ', city: 'San Francisco', coords: { x: 10, y: 40 } },
  { id: 'ny', name: 'East Hub', city: 'New York', coords: { x: 23, y: 38 } },
  { id: 'ldn', name: 'EMEA Core', city: 'London', coords: { x: 48, y: 32 } },
  { id: 'blr', name: 'APAC R&D', city: 'Bangalore', coords: { x: 74, y: 60 } },
  { id: 'syd', name: 'Oceania Ops', city: 'Sydney', coords: { x: 92, y: 85 } },
  { id: 'sao', name: 'LATAM Dev', city: 'São Paulo', coords: { x: 30, y: 80 } },
];

/**
 * Pre-defined static data for collaboration paths between team locations.
 * Connects locations using their unique IDs.
 * @const {ReadonlyArray<CollaborationPath>}
 */
const COLLABORATION_PATHS: readonly CollaborationPath[] = [
  { id: 'p1', from: 'sf', to: 'ny' },
  { id: 'p2', from: 'ny', to: 'ldn', tension: 0.3 },
  { id: 'p3', from: 'ldn', to: 'blr', tension: 0.4 },
  { id: 'p4', from: 'blr', to: 'syd' },
  { id: 'p5', from: 'sf', to: 'syd', tension: -0.5 },
  { id: 'p6', from: 'ny', to: 'sao', tension: 0.2 },
  { id: 'p7', from: 'sao', to: 'ldn', tension: 0.6 },
];

// --- ANIMATION VARIANTS ---

/**
 * Variants for the main container of the entire map.
 * Controls the initial 3D rotation and reveal.
 */
const mapContainerVariants: Variants = {
  initial: { opacity: 0, scale: 0.8, rotateX: 60 },
  animate: {
    opacity: 1,
    scale: 1,
    rotateX: 45,
    transition: {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
    },
  },
};

/**
 * Variants for the group containing all map points and paths.
 * Delays and staggers the animation of its children.
 */
const contentGroupVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0.5, // Wait for the map to rotate into view
      staggerChildren: 0.07,
    },
  },
};

/**
 * Variants for individual items (points and paths) inside the map.
 * Defines how each item appears.
 */
const itemVariants: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/**
 * Variants for the pop-up information panel.
 * Controls its appearance and disappearance.
 */
const infoPanelVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};


// --- HELPER FUNCTIONS ---

/**
 * A map to quickly look up location coordinates by their ID.
 * Memoized for performance.
 * @type {Map<string, {x: number; y: number}>}
 */
const locationCoordsMap = new Map(TEAM_LOCATIONS.map(loc => [loc.id, loc.coords]));

/**
 * Generates the SVG path 'd' attribute for a curved line between two points.
 * @param {string} fromId - The ID of the starting location.
 * @param {string} toId - The ID of the ending location.
 * @param {number} [tension=0.4] - The tension of the curve.
 * @returns {string} The SVG path data string.
 */
const generatePathD = (fromId: string, toId: string, tension = 0.4): string => {
  const start = locationCoordsMap.get(fromId);
  const end = locationCoordsMap.get(toId);

  if (!start || !end) return '';

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const midX = start.x + dx * 0.5;
  const midY = start.y + dy * 0.5;
  const controlX = midX - dy * tension;
  const controlY = midY + dx * tension;

  return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
};

// --- SUB-COMPONENTS ---

/**
 * Renders a single point of interest on the map.
 * @param {object} props - The component props.
 * @param {TeamLocation} props.location - The location data to render.
 * @param {Function} props.onSelect - Callback when the point is selected.
 * @param {boolean} props.isSelected - Whether this point is currently selected.
 * @returns {JSX.Element} A group of SVG elements representing a map point.
 */
const MapPoint = ({ location, onSelect, isSelected }: { location: TeamLocation; onSelect: (id: string | null) => void; isSelected: boolean }): JSX.Element => (
  <motion.g
    variants={itemVariants as Variants}
    className="cursor-pointer group"
    transform={`translate(${location.coords.x}, ${location.coords.y})`}
    onClick={() => onSelect(isSelected ? null : location.id)}
  >
    <motion.circle
      className="fill-[rgba(0,255,255,0.7)] stroke-cyan-400"
      r={isSelected ? 3.5 : 2}
      strokeWidth={0.5}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.circle
      className="fill-transparent stroke-cyan-400 opacity-50"
      r={4}
      animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
    />
  </motion.g>
);

/**
 * Renders an animated collaboration path between two points.
 * @param {object} props - The component props.
 * @param {CollaborationPath} props.path - The path data to render.
 * @returns {JSX.Element} An animated SVG path element.
 */
const MapPath = ({ path }: { path: CollaborationPath }): JSX.Element => {
  const d = useMemo(() => generatePathD(path.from, path.to, path.tension), [path]);

  if (!d) return <></>;

  return (
    <motion.path
      variants={itemVariants as Variants}
      d={d}
      className="fill-none stroke-[rgba(0,255,255,0.6)] [stroke-dasharray:4_2]"
      strokeWidth={0.5}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 2,
      }}
    />
  );
};

/**
 * A simple fallback component for the ErrorBoundary.
 * @param {object} props - Component props.
 * @param {Error} props.error - The caught error.
 * @returns {JSX.Element} The fallback UI.
 */
const MapErrorFallback = ({ error }: { error: Error }): JSX.Element => (
    <div role="alert" className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-[#1a0505] text-[#ffdddd] p-8 box-border">
      <h2 className="text-2xl font-bold mb-2">Something went wrong with the map.</h2>
      <p className="mb-4">We are sorry for the inconvenience. Please try refreshing the page.</p>
      <pre className="bg-black/30 p-4 rounded-lg mt-4 max-w-full overflow-x-auto">{error.message}</pre>
    </div>
);


/**
 * The main component rendering the 3D world map with team locations and collaboration paths.
 * It is a self-contained unit that manages its own state and data, requiring no external props.
 * Features a stylized 3D perspective, animated points of interest, and flowing connection paths.
 * @returns {JSX.Element} The fully rendered SharedTeamMap component.
 */
const SharedTeamMap = (): JSX.Element => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const selectedLocation = useMemo(
    () => TEAM_LOCATIONS.find(loc => loc.id === selectedLocationId),
    [selectedLocationId]
  );

  return (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-[radial-gradient(circle,_#020c16,_#010408)] text-[#e6f1ff] font-sans overflow-hidden">
      <div className="relative w-[90%] max-w-[1000px] aspect-video [perspective:1500px]">
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          variants={mapContainerVariants as Variants}
          initial="initial"
          animate="animate"
        >
          {/* A simplified, stylized world map SVG background */}
          <svg
            className="w-full h-full -translate-z-[50px]"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
                <radialGradient id="mapGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" className="[stop-color:rgba(10,50,80,0.5)]" />
                    <stop offset="100%" className="[stop-color:rgba(5,25,40,0.9)]" />
                </radialGradient>
            </defs>
            <path
              d="M99.5,53.8C99.2,38.2,89,24.2,74.8,17.4C60.2,10.4,42.5,13.3,29.9,23.5C17.2,33.8,9.8,49.8,12.2,65.6C14.6,81.4,26.6,94.2,41.5,98.2C56.5,102.2,73,96.8,84.5,85.5C95.9,74.3,100,59.9,99.5,53.8z M5.5,53.8C5.2,38.2,19,24.2,34.8,17.4C40.2,10.4,52.5,13.3,69.9,23.5C77.2,33.8,89.8,49.8,82.2,65.6C74.6,81.4,66.6,94.2,51.5,98.2C36.5,102.2,23,96.8,14.5,85.5C9.9,74.3,0,59.9,5.5,53.8z"
              fill="url(#mapGradient)"
              className="stroke-[rgba(30,100,130,0.4)]"
              strokeWidth={0.2}
            />

            <motion.g variants={contentGroupVariants as Variants}>
              {COLLABORATION_PATHS.map(path => (
                <MapPath key={path.id} path={path} />
              ))}
              {TEAM_LOCATIONS.map(location => (
                <MapPoint
                  key={location.id}
                  location={location}
                  onSelect={setSelectedLocationId}
                  isSelected={selectedLocationId === location.id}
                />
              ))}
            </motion.g>
          </svg>
           {/* Info Panel for selected location */}
          <AnimatePresence>
            {selectedLocation && (
              <motion.div
                className="absolute px-4 py-3 bg-[rgba(10,30,50,0.85)] border border-cyan-500/40 rounded-lg backdrop-blur-[10px] text-center pointer-events-none shadow-lg shadow-cyan-500/10 text-white"
                style={{
                  // Position panel near the point
                  left: `${selectedLocation.coords.x}%`,
                  top: `${selectedLocation.coords.y}%`,
                  transform: 'translate(-50%, -120%)',
                }}
                variants={infoPanelVariants as Variants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h3 className="text-lg font-semibold text-cyan-300">{selectedLocation.name}</h3>
                <p className="text-sm text-slate-300">{selectedLocation.city}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};


/**
 * A wrapper component that provides an error boundary for the SharedTeamMap.
 * This ensures that if any rendering error occurs within the map,
 * the entire application does not crash.
 * @returns {JSX.Element} The SharedTeamMap component wrapped in an ErrorBoundary.
 */
const SharedTeamMapWithErrorBoundary = (): JSX.Element => (
  <ErrorBoundary FallbackComponent={MapErrorFallback}>
    <Suspense fallback={<div className="w-full h-full min-h-[600px] flex items-center justify-center bg-[radial-gradient(circle,_#020c16,_#010408)] text-[#e6f1ff] font-sans">Loading Map...</div>}>
      <SharedTeamMap />
    </Suspense>
  </ErrorBoundary>
);

export default SharedTeamMapWithErrorBoundary;