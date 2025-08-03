import React, { useState, useCallback, useMemo, JSX } from 'react';
import { MemoryRouter, Routes, Route, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// Per the instructions, AppIcon is an external component.
// We assume its props API is { name: string, icon: JSX.Element, onClick: () => void }.
import AppIcon from '../AppIcon/AppIcon';

// #region --- Type Definitions ---

/**
 * @typedef {object} AppConfig
 * @property {string} id - A unique identifier for the app.
 * @property {string} name - The name of the app, displayed below its icon.
 * @property {() => JSX.Element} Icon - A functional component that renders the app's icon.
 * @property {() => JSX.Element} Component - The main component to render when the app is opened.
 */
type AppConfig = {
  id: string;
  name: string;
  Icon: () => JSX.Element;
  Component: () => JSX.Element;
};

// #endregion --- Type Definitions ---

// #region --- Animation Variants ---

/**
 * Animation variants for the main phone frame container.
 */
const phoneFrameVariants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

/**
 * Animation variants for page transitions.
 */
const pageVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 1.05, y: -20 },
};

/**
 * Transition settings for page animations.
 */
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

/**
 * Generic container variants for staggering child animations.
 */
const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2, // Delay after page transition
    },
  },
};

/**
 * Item variants for home screen icons.
 */
const iconItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

/**
 * Item variants for the photo grid.
 */
const photoItemVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', damping: 15, stiffness: 200 } },
};

/**
 * Item variants for weather details.
 */
const weatherItemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

/**
 * Item variants for the mail list.
 */
const mailItemVariants: Variants = {
  hidden: { x: -30, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

/**
 * Variants for the app screen header.
 */
const appHeaderVariants: Variants = {
  initial: { y: -50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { delay: 0.3, ease: 'easeOut' } },
};


// #endregion --- Animation Variants ---


// #region --- Mock App Components ---
// These are placeholder components for the apps inside the simulator.

/**
 * A mock Photos App component.
 * @returns {JSX.Element} The rendered Photos App.
 */
const PhotosApp = (): JSX.Element => (
  <motion.div
    className="grid grid-cols-3 gap-[5px]"
    variants={staggerContainerVariants as Variants}
    initial="hidden"
    animate="visible"
  >
    {Array.from({ length: 12 }).map((_, i) => (
      <motion.div key={i} variants={photoItemVariants as Variants}>
        <img
          src={`https://picsum.photos/id/${10 + i}/100/100.webp`}
          alt="A random gallery view"
          className="w-full h-auto aspect-square object-cover rounded-lg"
          loading="lazy"
        />
      </motion.div>
    ))}
  </motion.div>
);

/**
 * A mock Weather App component.
 * @returns {JSX.Element} The rendered Weather App.
 */
const WeatherApp = (): JSX.Element => (
  <motion.div
    className="flex flex-col items-center justify-center text-white h-full text-center"
    variants={staggerContainerVariants as Variants}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={weatherItemVariants as Variants}>
      <span className="text-[80px]">☀️</span>
    </motion.div>
    <motion.div variants={weatherItemVariants as Variants}>
      <h2 className="my-2.5 text-6xl font-light">72°F</h2>
    </motion.div>
    <motion.div variants={weatherItemVariants as Variants}>
      <p className="m-0 text-2xl">San Francisco</p>
    </motion.div>
    <motion.div variants={weatherItemVariants as Variants}>
      <p className="my-[5px] text-lg text-white/70">Clear Skies</p>
    </motion.div>
  </motion.div>
);

/**
 * A mock Mail App component.
 * @returns {JSX.Element} The rendered Mail App.
 */
const MailApp = (): JSX.Element => (
  <motion.div
    className="text-white"
    variants={staggerContainerVariants as Variants}
    initial="hidden"
    animate="visible"
  >
    {['Project Update', 'Team Lunch', 'Weekly Newsletter', 'Security Alert'].map((subject, i) => (
      <motion.div
        key={i}
        className="flex items-center p-[15px] border-b border-white/10"
        variants={mailItemVariants as Variants}
      >
        <div className="w-10 h-10 rounded-full bg-zinc-700 mr-[15px]"></div>
        <div>
          <p className="m-0 font-bold">{subject}</p>
          <p className="m-0 text-sm text-white/60">sender@example.com</p>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

// #endregion --- Mock App Components ---


// #region --- Constant Data ---

/**
 * Static configuration for all applications available in the simulator.
 * This constant data drives the home screen and app routing.
 */
const APPS_CONFIG: readonly AppConfig[] = [
  {
    id: 'photos',
    name: 'Photos',
    Icon: () => <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg" style={{ background: 'linear-gradient(45deg, #4facfe, #00f2fe)' }}>🏞️</div>,
    Component: PhotosApp,
  },
  {
    id: 'weather',
    name: 'Weather',
    Icon: () => <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg" style={{ background: 'linear-gradient(45deg, #f093fb, #f5576c)' }}>☀️</div>,
    Component: WeatherApp,
  },
  {
    id: 'mail',
    name: 'Mail',
    Icon: () => <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg" style={{ background: 'linear-gradient(45deg, #43e97b, #38f9d7)' }}>✉️</div>,
    Component: MailApp,
  },
];

/**
 * A map for quick lookup of an app's main component by its ID.
 */
const APP_COMPONENT_MAP = new Map(APPS_CONFIG.map(app => [app.id, app.Component]));


// #endregion --- Constant Data ---

// #region --- Internal Components ---

/**
 * Renders the Home Screen with application icons.
 * @returns {JSX.Element} The home screen component.
 */
const HomeScreen = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <motion.div
      key="home"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants as Variants}
      className=" w-full h-full backdrop-blur-[20px] backdrop-saturate-[1.8] bg-black/30 flex flex-col"
    >
      <motion.div
        className="grid grid-cols-4 gap-5 p-10 px-5"
        variants={staggerContainerVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        {APPS_CONFIG.map(app => (
          <motion.div key={app.id} variants={iconItemVariants as Variants}>
            <AppIcon
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

/**
 * Renders the view for an opened application.
 * It includes a header with a back button and the app's main content.
 * @returns {JSX.Element} The app view screen.
 */
const AppScreen = (): JSX.Element => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const appConfig = APPS_CONFIG.find(app => app.id === appId);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);



  return (
    <motion.div
      key={appId}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants as Variants}
      className=" inset-0 w-full h-full backdrop-blur-[20px] backdrop-saturate-[1.8] bg-black/30 flex flex-col"
    >
      <motion.header
        className="flex items-center p-5 flex-shrink-0 border-b border-white/10"
        variants={appHeaderVariants as Variants}
        initial="initial"
        animate="animate"
      >
        <button onClick={handleGoBack} className="bg-transparent border-none text-white text-2xl cursor-pointer pr-2.5">
          &lt;
        </button>
        <h1 className="text-xl font-bold text-white m-0 flex-grow text-center">IOS</h1>
      </motion.header>
      <main className="flex-grow overflow-y-auto p-2.5">
        appComponent
      </main>
    </motion.div>
  );
};

/**
 * A component that renders the animated routes for the simulator.
 * It uses the current location to enable AnimatePresence on route changes.
 * @returns {JSX.Element} The animated routes component.
 */
const AnimatedRoutes = (): JSX.Element => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <AppScreen />
    </AnimatePresence>
  );
};

/**
 * The fallback component for the ErrorBoundary.
 * @param {object} props - The props provided by react-error-boundary.
 * @param {Error} props.error - The error that was caught.
 * @param {() => void} props.resetErrorBoundary - Function to reset the component state.
 * @returns {JSX.Element} A user-friendly error screen.
 */
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }): JSX.Element => (
    <div className="p-5 text-white text-center flex flex-col justify-center h-full bg-red-800/80">
      <h2 className="mb-2.5">App Crashed</h2>
      <p className="text-sm italic text-white/80">{error.message}</p>
      <button onClick={resetErrorBoundary} className="mt-5 px-5 py-2.5 border border-white rounded-lg bg-transparent text-white cursor-pointer">
        Reboot Simulator
      </button>
    </div>
);

// #endregion --- Internal Components ---


/**
 * A functional simulator of a smartphone designed to demo mobile applications.
 *
 * It features a mock touchscreen, a static set of AppIcons on a home screen,
 * and handles animated transitions between different app views internally using
 * `react-router-dom`'s `MemoryRouter` and `framer-motion`.
 * This component is self-contained and does not require any props.
 *
 * @example
 * ```jsx
 * <SmartphoneSimulator />
 * ```
 * @returns {JSX.Element} The fully functional SmartphoneSimulator component.
 */
const SmartphoneSimulator = (): JSX.Element => {
  const [key, setKey] = useState(0);

  // This function allows the ErrorBoundary to "reboot" the entire simulator
  // by changing the key of the MemoryRouter, effectively unmounting and
  // remounting the whole navigation stack.
  const resetSimulator = useCallback(() => {
    setKey(prevKey => prevKey + 1);
  }, []);

  return (
    <div className="flex justify-center items-center p-10 font-sans">
      <motion.div
        className="relative flex justify-center items-center w-[375px] h-[812px] bg-[#111] rounded-[50px] p-[15px] shadow-2xl shadow-black/50 ring-1 ring-inset ring-white/10"
        variants={phoneFrameVariants as Variants}
        initial="initial"
        animate="animate"
      >
        <div className="w-full h-full bg-black rounded-[35px] overflow-hidden relative bg-cover bg-center bg-[url(https://picsum.photos/id/1015/375/812.webp)]">
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={resetSimulator}>
              <AnimatedRoutes />
          </ErrorBoundary>
        </div>
      </motion.div>
    </div>
  );
};


export default SmartphoneSimulator;