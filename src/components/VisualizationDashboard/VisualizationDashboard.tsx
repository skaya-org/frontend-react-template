import React, { JSX } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';

// Import child components as per the specified structure.
// These components are self-contained and do not require any props.
import QuantumVisualizer from '../QuantumVisualizer/QuantumVisualizer';
import ControlPanel from '../ControlPanel/ControlPanel';

/**
 * @namespace FallbackComponents
 * @description A collection of fallback components for error boundaries.
 */

/**
 * A simple fallback component to be displayed when a rendering error occurs
 * within the VisualizationDashboard's children.
 * @memberof FallbackComponents
 * @returns {JSX.Element} A React element displaying an error message.
 */
const ErrorFallback = (): JSX.Element => (
    <div className="flex h-full w-full flex-col items-center justify-center bg-red-950 p-5 text-red-200">
        <h2 className="m-0 text-2xl font-semibold">Oops! Something went wrong.</h2>
        <p className="mt-2.5 text-base">
            There was an error rendering the visualization dashboard. Please try refreshing the page.
        </p>
    </div>
);

/**
 * Animation variants for the dashboard container.
 * This orchestrates the staggered animation of its children.
 */
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.2,
        },
    },
};

/**
 * Animation variants for the main visualizer section.
 * It will fade in while sliding from the left.
 */
const visualizerVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
};

/**
 * Animation variants for the control panel aside.
 * It will fade in while sliding from the right.
 */
const panelVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
};


/**
 * @component VisualizationDashboard
 * @description
 * The `VisualizationDashboard` serves as the primary layout container for the application's
 * main feature. It orchestrates the arrangement of the `QuantumVisualizer` and the
 * `ControlPanel` components in a fixed, side-by-side view.
 *
 * This component is designed to be self-contained, requiring no props. It establishes a
 * consistent structure where the visualization is the main focus, and the controls are
 * presented alongside it for intuitive user interaction.
 * An ErrorBoundary is included to ensure that if either child component fails to render,
 * the entire application does not crash, providing a graceful fallback.
 *
 * @returns {JSX.Element} A React element that renders the main dashboard layout.
 */
const VisualizationDashboard = (): JSX.Element => {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <motion.main
                className="flex h-screen w-screen flex-row overflow-hidden bg-gray-900 text-gray-100"
                aria-label="Visualization Dashboard"
                variants={containerVariants as Variants}
                initial="hidden"
                animate="visible"
            >
                <motion.section
                    className="relative flex flex-[3] items-center justify-center p-5"
                    aria-label="Main Visualization Area"
                    variants={visualizerVariants as Variants}
                >
                    <QuantumVisualizer />
                </motion.section>
                <motion.aside
                    className="flex flex-1 flex-col border-l border-gray-700 bg-gray-800 min-w-[300px] max-w-[400px]"
                    aria-label="Control Panel"
                    variants={panelVariants as Variants}
                >
                    <ControlPanel />
                </motion.aside>
            </motion.main>
        </ErrorBoundary>
    );
};

export default VisualizationDashboard;