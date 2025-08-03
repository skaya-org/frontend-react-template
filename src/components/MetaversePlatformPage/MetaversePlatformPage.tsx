import React, { useState, useCallback, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// Import child components as per the requirements.
// These components are assumed to be self-contained and require no props.
import WorldViewer from '../WorldViewer/WorldViewer';
import Marketplace from '../Marketplace/Marketplace';
import SocialHub from '../SocialHub/SocialHub';
import QuestLog from '../QuestLog/QuestLog';
import UserContentToolbar from '../UserContentToolbar/UserContentToolbar';
import CustomizationPanel from '../CustomizationPanel/CustomizationPanel';

// Framer Motion: 12.23.12

// --- Animation Variants ---

/**
 * Variants for the main page container to orchestrate staggered entrances.
 */
const pageContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

/**
 * Variants for the main 3D world view, providing a subtle zoom-in effect.
 */
const worldViewerVariants: Variants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: 'easeOut' },
  },
};

/**
 * Variants for HUD elements like the QuestLog, making them slide in.
 */
const hudElementVariants: Variants = {
  initial: { opacity: 0, x: 50, y: -50 },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

/**
 * Variants for the top toolbar, sliding in from the top.
 */
const toolbarVariants: Variants = {
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { y: -100, opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

/**
 * Variants for the side panel, sliding in from the right.
 */
const panelVariants: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { x: '100%', opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

/**
 * Variants for the full-screen overlay backdrop.
 */
const overlayBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

/**
 * Variants for the content inside the overlay, giving it a subtle scale-up effect.
 */
const overlayContentVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.1 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

/**
 * Variants for the futuristic screen wipe transition.
 */
const screenWipeVariants: Variants = {
  initial: { scaleY: 0 },
  animate: { scaleY: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { scaleY: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * @typedef {'none' | 'marketplace' | 'social'} ActiveOverlay
 * @description Defines the possible full-screen overlay views.
 */
type ActiveOverlay = 'none' | 'marketplace' | 'social';

/**
 * Fallback component to be rendered when an error is caught by the ErrorBoundary.
 */
const ErrorFallback = ({ error }: { error: Error }): JSX.Element => (
  <div className="flex h-full w-full flex-col items-center justify-center bg-[#1c1c1c] text-gray-200">
    <h2 className="text-2xl font-bold">Something went wrong in the Metaverse.</h2>
    <p className="mt-2">We've encountered an unexpected error.</p>
    <pre className="mt-4 max-w-[80%] overflow-x-auto rounded bg-[#333] p-2.5 text-[#ff8a8a]">
      {error.message}
    </pre>
    <button
      onClick={() => window.location.reload()}
      className="mt-5 cursor-pointer rounded bg-blue-500 px-5 py-2.5 text-base text-white transition-colors hover:bg-blue-600"
    >
      Reload Experience
    </button>
  </div>
);

/**
 * The main top-level component that orchestrates the entire metaverse experience.
 */
const MetaversePlatformPage = (): JSX.Element => {
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>('none');
  const [isToolbarVisible, setToolbarVisible] = useState<boolean>(false);
  const [isCustomizationPanelVisible, setCustomizationPanelVisible] = useState<boolean>(false);
  const [isTransitioning, setTransitioning] = useState<boolean>(false);

  const handleSetOverlay = useCallback((newOverlay: ActiveOverlay) => {
    if (activeOverlay === newOverlay) return;

    setTransitioning(true);
    setTimeout(() => {
      setActiveOverlay(newOverlay);
      setTransitioning(false);
    }, 500);
  }, [activeOverlay]);

  const toggleToolbar = useCallback(() => setToolbarVisible(prev => !prev), []);
  const toggleCustomizationPanel = useCallback(() => setCustomizationPanelVisible(prev => !prev), []);

  const renderActiveOverlay = (): JSX.Element | null => {
    switch (activeOverlay) {
      case 'marketplace':
        return <Marketplace />;
      case 'social':
        return <SocialHub />;
      case 'none':
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="relative h-screen w-screen overflow-hidden bg-[#1a1a2e] font-sans"
      variants={pageContainerVariants as Variants}
      initial="initial"
      animate="animate"
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* Main 3D World Viewer - Always in the background */}
        <motion.div
          className="absolute inset-0 z-[1] h-full w-full"
          variants={worldViewerVariants as Variants}
        >
          <WorldViewer />
        </motion.div>

        {/* HUD Elements - Overlays on top of the world view */}
        <motion.div
          className="pointer-events-none absolute right-[20px] top-[20px] z-10"
          variants={hudElementVariants as Variants}
        >
          <QuestLog />
        </motion.div>

        {/* --- DEMO CONTROLS --- */}
        <motion.div
          className="absolute bottom-5 left-5 z-50 flex flex-col gap-2 rounded-lg bg-black/50 p-2.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5 } }}
        >
          <p className="m-0 text-xs text-white">Dev Controls</p>
          <button className="cursor-pointer rounded border border-[#555] bg-[#333] px-3 py-2 text-xs text-gray-200 transition-colors hover:bg-[#444]" onClick={() => handleSetOverlay('none')}>World View</button>
          <button className="cursor-pointer rounded border border-[#555] bg-[#333] px-3 py-2 text-xs text-gray-200 transition-colors hover:bg-[#444]" onClick={() => handleSetOverlay('marketplace')}>Marketplace</button>
          <button className="cursor-pointer rounded border border-[#555] bg-[#333] px-3 py-2 text-xs text-gray-200 transition-colors hover:bg-[#444]" onClick={() => handleSetOverlay('social')}>Social Hub</button>
          <button className="cursor-pointer rounded border border-[#555] bg-[#333] px-3 py-2 text-xs text-gray-200 transition-colors hover:bg-[#444]" onClick={toggleToolbar}>Toggle Toolbar</button>
          <button className="cursor-pointer rounded border border-[#555] bg-[#333] px-3 py-2 text-xs text-gray-200 transition-colors hover:bg-[#444]" onClick={toggleCustomizationPanel}>Toggle Customizer</button>
        </motion.div>
        {/* --- END DEMO CONTROLS --- */}

        {/* Conditional Overlays and Panels */}
        <AnimatePresence>
          {isToolbarVisible && (
            <motion.div
              key="user-content-toolbar"
              className="absolute left-1/2 top-[20px] z-[15] -translate-x-1/2"
              variants={toolbarVariants as Variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <UserContentToolbar />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCustomizationPanelVisible && (
            <motion.div
              key="customization-panel"
              className="absolute right-0 top-0 z-[15] h-full"
              variants={panelVariants as Variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <CustomizationPanel />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeOverlay !== 'none' && (
            <motion.div
              key={activeOverlay}
              className="absolute inset-0 z-20 h-full w-full bg-[#0a0a14]/80 backdrop-blur-[10px]"
              variants={overlayBackdropVariants as Variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div
                key={`${activeOverlay}-content`}
                variants={overlayContentVariants as Variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-full w-full"
              >
                {renderActiveOverlay()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Futuristic Screen Transition Effect */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              key="screen-transition"
              className="absolute inset-0 z-[100] h-full w-full origin-top bg-[#0f0f18]"
              variants={screenWipeVariants as Variants}
              initial="initial"
              animate="animate"
              exit="exit"
            />
          )}
        </AnimatePresence>
      </ErrorBoundary>
    </motion.div>
  );
};

export default MetaversePlatformPage;