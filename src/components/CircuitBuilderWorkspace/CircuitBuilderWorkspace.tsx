import React, { JSX } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';

// Child component imports as per the requirements.
// These components are assumed to be self-contained and manage their own state.
import CircuitBuilder3D from '../CircuitBuilder3D/CircuitBuilder3D';
import GateSelector from '../GateSelector/GateSelector';
import ControlPanel from '../ControlPanel/ControlPanel';

/**
 * @interface ErrorFallbackProps
 * @description Props for the ErrorFallback component.
 * @property {Error} error - The error that was caught.
 */
interface ErrorFallbackProps {
  error: Error;
}

/**
 * A fallback component to render when a critical error occurs in a child component.
 * It provides a user-friendly message instead of a crashed application screen.
 * @param {ErrorFallbackProps} props - The props for the component.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const ErrorFallback = ({ error }: ErrorFallbackProps): JSX.Element => {
  return (
    <div
      role="alert"
      className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-red-500 bg-zinc-800 p-8 text-center font-mono text-red-200"
    >
      <h2 className="mb-4 text-2xl">Component Error</h2>
      <p>A critical error occurred in the circuit builder canvas:</p>
      <pre className="max-w-xl whitespace-pre-wrap text-base">{error.message}</pre>
    </div>
  );
};

// Animation Variants for Framer Motion

/**
 * The main container variant orchestrates the animations of its children.
 * It staggers their appearance for a smooth, sequential effect.
 */
const workspaceContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/**
 * Variant for the left-side panel (GateSelector).
 * It animates in by sliding from the left.
 */
const asideVariants: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 20 },
  },
};

/**
 * Variant for the central 3D canvas (CircuitBuilder3D).
 * It animates in by fading and scaling up gently.
 */
const mainCanvasVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/**
 * Variant for the bottom panel (ControlPanel).
 * It animates in by sliding up from the bottom.
 */
const controlPanelVariants: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 20 },
  },
};

/**
 * @component CircuitBuilderWorkspace
 * @description A container component that establishes the environment for the quantum circuit builder.
 * It statically arranges the primary UI components: the `GateSelector` for choosing quantum gates,
 * the `CircuitBuilder3D` for the interactive 3D canvas, and the `ControlPanel` for circuit operations.
 * This component is self-contained and does not accept any props, adhering to a "no props" architecture
 * where child components manage their own state or use a shared context.
 *
 * @returns {JSX.Element} The fully composed quantum circuit builder workspace.
 */
const CircuitBuilderWorkspace = (): JSX.Element => {
  return (
    <motion.div
      className="flex h-screen w-screen overflow-hidden bg-zinc-900 font-sans text-zinc-200"
      variants={workspaceContainerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <motion.aside
        className="flex w-[280px] flex-none flex-col overflow-y-auto border-r border-zinc-700 bg-zinc-800 p-4"
        variants={asideVariants as Variants}
      >
        <GateSelector />
      </motion.aside>

      <main className="relative flex flex-1 flex-col">
        <motion.div
          className="relative min-h-0 flex-1"
          variants={mainCanvasVariants as Variants}
        >
          {/*
           * The CircuitBuilder3D is the most complex and interactive part,
           * making it a prime candidate for an ErrorBoundary. This prevents an
           * error within the 3D canvas from crashing the entire application.
           */}
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <CircuitBuilder3D />
          </ErrorBoundary>
        </motion.div>

        <motion.div
          className="flex-none border-t border-zinc-700 bg-zinc-800 p-4"
          variants={controlPanelVariants as Variants}
        >
          <ControlPanel />
        </motion.div>
      </main>
    </motion.div>
  );
};

export default CircuitBuilderWorkspace;