import React, { FC, JSX, Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';

// Import required child components.
// These components are self-contained and do not require any props.
import WorldViewer from '../WorldViewer/WorldViewer';
import ChatPanel from '../ChatPanel/ChatPanel';

/**
 * @component ErrorFallback
 * @description A standardized fallback component to display when a child component encounters an error.
 * It provides a user-friendly message and technical details for debugging.
 * @param {FallbackProps} props - Props provided by react-error-boundary, including the error object.
 * @returns {JSX.Element} The rendered error message UI.
 */
const ErrorFallback: FC<FallbackProps> = ({ error }): JSX.Element => (
  <div
    className="flex h-full w-full flex-col items-center justify-center bg-[#1f1f2b] p-5 text-center"
    role="alert"
  >
    <h2 className="mb-2.5 text-2xl text-[#ff4d4d]">
      Component Failed to Load
    </h2>
    <p>A critical error occurred in one of the modules.</p>
    <pre className="max-w-[80%] break-all font-mono text-[#a0a0b0]">
      {error.message}
    </pre>
  </div>
);

/**
 * @component LoadingSpinner
 * @description A simple loading indicator to be used with React.Suspense.
 * @returns {JSX.Element} The rendered loading message.
 */
const LoadingSpinner: FC = (): JSX.Element => (
  <div className="flex h-full w-full items-center justify-center text-xl text-[#a0a0b0]">
    Loading Module...
  </div>
);

// Animation variants for Framer Motion
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const worldViewerVariants: Variants = {
  hidden: { x: '-100vw', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 40,
      damping: 10,
      duration: 0.8,
    },
  },
};

const chatPanelVariants: Variants = {
  hidden: { x: '100vw', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 40,
      damping: 10,
      duration: 0.8,
    },
  },
};

/**
 * @component SocialHub
 * @description An immersive top-level layout component that orchestrates the main social experience.
 * It presents a split view featuring a `WorldViewer` for environmental immersion and a `ChatPanel`
 * for user communication. The component is designed to be resilient, using Error Boundaries
 * to isolate failures in child components and Suspense for handling lazy-loaded modules.
 * This component is self-contained and fetches its own data, requiring no props from its parent.
 *
 * @returns {JSX.Element} The fully rendered Social Hub layout.
 */
const SocialHub: FC = (): JSX.Element => {
  return (
    <motion.main
      className="flex h-screen w-screen flex-row overflow-hidden bg-[#0a0a0f] text-[#e0e0e0]"
      aria-label="Social Hub"
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingSpinner />}>
          <motion.section
            className="relative flex flex-1 basis-[65%] items-center justify-center bg-[#050508]"
            aria-label="World Viewer Section"
            variants={worldViewerVariants as Variants}
          >
            <WorldViewer />
          </motion.section>
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingSpinner />}>
          <motion.aside
            className="flex flex-1 shrink-0 basis-[35%] flex-col border-l border-[#2a2a3a] bg-[#101018] min-w-[320px] max-w-[500px]"
            aria-label="Chat Panel Section"
            variants={chatPanelVariants as Variants}
          >
            <ChatPanel />
          </motion.aside>
        </Suspense>
      </ErrorBoundary>
    </motion.main>
  );
};

export default SocialHub;