import React, { useState, JSX, Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Lazily import the complex component to improve initial load time.
// The code for SolarSystemView will only be fetched when the user clicks its tab.
const SolarSystemView = lazy(() => import('../SolarSystemView/SolarSystemView'));

// --- Type Definitions ---

/**
 * @type {Tab}
 * @description Defines the structure for a single tab in the interface.
 * @property {string} id - A unique identifier for the tab.
 * @property {string} label - The text displayed on the tab button.
 * @property {JSX.Element} content - The React component or element to render when the tab is active.
 */
type Tab = {
  id: string;
  label: string;
  content: JSX.Element;
};

// --- Constant Data ---

/**
 * @constant TABS
 * @description An array of tab configurations that drives the entire tabbed interface.
 * By keeping this as a constant, the component is self-contained and requires no props.
 * The `readonly` assertion ensures data immutability, a best practice in functional components.
 */
const TABS: readonly Tab[] = [
  {
    id: 'solar-system',
    label: 'Solar System Metaverse',
    content: <SolarSystemView />,
  },
  {
    id: 'legacy-projects',
    label: 'Legacy Projects',
    content: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-600 pb-2">
          Our Legacy Projects
        </h2>
        <p className="text-gray-300 leading-relaxed">
          Before we ventured into the metaverse, our team built a variety of
          award-winning applications. These projects, while not actively
          developed, showcase our foundational skills in robust engineering and
          user-centric design.
        </p>
        <img
          src="https://picsum.photos/400/200.webp"
          alt="Legacy project abstract art"
          className="rounded-lg mt-4 max-w-full h-auto mx-auto"
        />
      </div>
    ),
  },
  {
    id: 'about-us',
    label: 'About Us',
    content: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white border-b border-gray-600 pb-2">
          About Our Team
        </h2>
        <p className="text-gray-300 leading-relaxed">
          We are a passionate group of developers, designers, and dreamers
          dedicated to pushing the boundaries of digital interaction. Our
          mission is to create immersive and meaningful experiences that connect
          people in new and exciting ways.
        </p>
        <img
          src="https://picsum.photos/400/201.webp"
          alt="Team collaboration abstract art"
          className="rounded-lg mt-4 max-w-full h-auto mx-auto"
        />
      </div>
    ),
  },
];

// --- Animation Variants ---

/**
 * Variants for the main page container to orchestrate staggered animations for its children.
 */
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

/**
 * Variants for major child elements like the header and main content area.
 * They will fade in and slide up.
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

/**
 * Variants for the tab content panel, managing enter and exit animations.
 * Used with AnimatePresence for smooth transitions between tabs.
 */
const contentPanelVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};


// --- Helper Components ---

/**
 * A simple fallback component to display when an error occurs within a tab's content.
 * @param {object} props - The props object provided by React Error Boundary.
 * @param {Error} props.error - The error that was caught by the ErrorBoundary.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const ErrorFallback = ({ error }: { error: Error }): JSX.Element => (
  <div role="alert" className="p-6 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
    <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong.</h3>
    <p>This section of the application encountered an issue.</p>
    <pre className="bg-gray-900 p-4 rounded-md whitespace-pre-wrap break-words text-red-300 mt-4 font-mono text-sm">
      {error.message}
    </pre>
    <p className="mt-4">Please try refreshing the page or selecting another tab.</p>
  </div>
);

/**
 * A simple loader to display while lazy-loaded components are being fetched.
 * @returns {JSX.Element} The rendered loader UI.
 */
const ContentLoader = (): JSX.Element => (
    <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-lg text-gray-400 animate-pulse">Loading Experience...</p>
    </div>
);


// --- Main Component ---

/**
 * Renders the main home page with a tabbed interface.
 *
 * This component manages the state for the active tab and displays the corresponding
 * content. It uses a constant data structure (`TABS`) to define the available tabs,
 * making it self-contained and easy to configure without needing props. It includes an
 * ErrorBoundary to gracefully handle rendering errors in tab content, and Framer Motion
 * for fluid animations on page load and tab switching.
 *
 * @component
 * @returns {JSX.Element} The fully rendered HomePage component.
 */
const HomePage = (): JSX.Element => {
  const [activeTabId, setActiveTabId] = useState<string>(TABS[0].id);

  const activeTab = TABS.find(tab => tab.id === activeTabId);

  return (
    <motion.div
      className="font-sans text-gray-200 bg-gray-900 min-h-screen p-4 sm:p-8 flex flex-col items-center box-border"
      variants={pageVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <motion.header
        className="w-full max-w-6xl text-center mb-8 border-b border-gray-700 pb-6"
        variants={itemVariants as Variants}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
          Interactive Showcase
        </h1>
        <nav aria-label="Main navigation" className="flex justify-center gap-2 sm:gap-4 flex-wrap">
          {TABS.map(tab => {
            const isActive = tab.id === activeTabId;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`
                  py-3 px-5 text-sm sm:text-base font-medium cursor-pointer border rounded-lg 
                  transition-colors duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500
                  ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-blue-500'
                  }
                `}
                aria-selected={isActive}
                role="tab"
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {tab.label}
              </motion.button>
            );
          })}
        </nav>
      </motion.header>

      <motion.main
        className="w-full max-w-6xl bg-gray-800 p-6 sm:p-8 rounded-lg shadow-2xl"
        variants={itemVariants as Variants}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
           <AnimatePresence mode="wait">
            <motion.div
              key={activeTabId}
              variants={contentPanelVariants as Variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="will-change-transform" // Performance optimization hint
            >
              <Suspense fallback={<ContentLoader />}>
                {activeTab ? activeTab.content : <p>Please select a tab.</p>}
              </Suspense>
            </motion.div>
           </AnimatePresence>
        </ErrorBoundary>
      </motion.main>
    </motion.div>
  );
};

export default HomePage;