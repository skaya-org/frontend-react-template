import React, { useState, JSX, useCallback } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- Component Imports ---
// These components are self-contained and use their own constant data.
import QuestDashboard from '../QuestDashboard/QuestDashboard';
import ProgressBar from '../ProgressBar/ProgressBar';
import BadgeGallery from '../BadgeGallery/BadgeGallery';
import SharedTeamMap from '../SharedTeamMap/SharedTeamMap';
import TimeManagementGame from '../TimeManagementGame/TimeManagementGame';

// --- Constants and Mock Data ---

/**
 * @constant STUDENT_PROFILE
 * @description Constant data for the student's profile information.
 * In a real-world application, this would come from a data store or API.
 * As per the requirements, we use constant data to avoid prop drilling.
 */
const STUDENT_PROFILE = {
    name: 'Alex Morgan',
    avatarUrl: 'https://picsum.photos/100/100.webp?grayscale',
};

// --- Animation Variants ---

/**
 * @constant pageVariants
 * @description Variants for the main container to orchestrate staggered animations for its children.
 */
const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

/**
 * @constant itemVariants
 * @description A generic variant for child elements to fade and slide in.
 */
const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 120 },
    },
};

/**
 * @constant fabVariants
 * @description Animation for the floating action button to make it pop.
 */
const fabVariants: Variants = {
    hidden: { scale: 0, y: 20, opacity: 0 },
    visible: {
        scale: 1,
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.5, // Appears after the main layout has animated in.
        },
    },
};

/**
 * @constant modalBackdropVariants
 * @description Controls the fade-in/out of the modal's overlay.
 */
const modalBackdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
};

/**
 * @constant modalContentVariants
 * @description Controls the appearance and disappearance of the modal's content.
 */
const modalContentVariants: Variants = {
    hidden: { scale: 0.9, y: -50, opacity: 0 },
    visible: {
        scale: 1,
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
        scale: 0.9,
        y: -50,
        opacity: 0,
        transition: { duration: 0.2 },
    },
};

// --- Helper Components ---

/**
 * A standardized error fallback component to be displayed when a child component fails.
 * @param {FallbackProps} props - Props provided by React Error Boundary.
 * @returns {JSX.Element} A user-friendly error message.
 */
const WidgetErrorFallback = ({ error, resetErrorBoundary }: FallbackProps): JSX.Element => (
    <div className="bg-red-50 text-red-700 border border-red-700 rounded-lg p-4 text-center">
        <h4 className="font-bold text-lg mb-2">Oops! Something went wrong.</h4>
        <p className="text-sm mb-4">We encountered an issue loading this section.</p>
        <pre className="bg-red-100 rounded p-2 text-xs whitespace-pre-wrap break-all text-left max-h-24 overflow-y-auto">
            {error.message}
        </pre>
        <button
            className="mt-4 px-4 py-2 bg-red-700 text-white border-none rounded cursor-pointer hover:bg-red-800 transition-colors"
            onClick={resetErrorBoundary}
        >
            Try Again
        </button>
    </div>
);

// --- Main Component ---

/**
 * @component StudentDashboard
 * @description
 * The StudentDashboard is the primary interface for a student user.
 * It provides a consolidated view of their progress, quests, achievements, and access to interactive elements.
 * This component is self-contained and manages its own state and data, requiring no props.
 * It aggregates several key widgets: QuestDashboard, ProgressBar, BadgeGallery, and SharedTeamMap,
 * each wrapped in an ErrorBoundary for resilience. It also includes a modal to launch a TimeManagementGame.
 *
 * @returns {JSX.Element} The rendered StudentDashboard component.
 */
const StudentDashboard = (): JSX.Element => {
    /**
     * @state {boolean} isGameModalOpen - Manages the visibility of the TimeManagementGame modal.
     */
    const [isGameModalOpen, setGameModalOpen] = useState<boolean>(false);

    /**
     * @function handleOpenGameModal
     * @description Opens the time management game modal.
     * Uses useCallback to prevent unnecessary re-renders of the launch button.
     */
    const handleOpenGameModal = useCallback(() => {
        setGameModalOpen(true);
    }, []);

    /**
     * @function handleCloseGameModal
     * @description Closes the time management game modal.
     * Uses useCallback for memoization.
     */
    const handleCloseGameModal = useCallback(() => {
        setGameModalOpen(false);
    }, []);

    return (
        <motion.div
            className="font-sans bg-gray-100 text-gray-800 min-h-screen p-8 box-border"
            variants={pageVariants as Variants}
            initial="hidden"
            animate="visible"
        >
            <motion.header
                className="flex justify-between items-center bg-white px-8 py-6 rounded-xl shadow-md mb-8"
                variants={itemVariants as Variants}
            >
                <div className="flex items-center gap-6">
                    <motion.img
                        src={STUDENT_PROFILE.avatarUrl}
                        alt={`${STUDENT_PROFILE.name}'s avatar`}
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <div>
                        <h1 className="m-0 text-3xl font-semibold text-gray-800">
                            Welcome, {STUDENT_PROFILE.name}!
                        </h1>
                        <p className="m-0 text-base text-gray-500">Ready to conquer your day?</p>
                    </div>
                </div>
                <div className="w-[35%] min-w-[300px]">
                    <ErrorBoundary FallbackComponent={WidgetErrorFallback}>
                        <ProgressBar />
                    </ErrorBoundary>
                </div>
            </motion.header>

            <motion.main
                className="grid grid-cols-[2fr_1fr] gap-8"
                variants={pageVariants as Variants} // Nested stagger for main content
            >
                <motion.section className="col-span-1" variants={itemVariants as Variants}>
                    <ErrorBoundary FallbackComponent={WidgetErrorFallback}>
                        <QuestDashboard />
                    </ErrorBoundary>
                </motion.section>

                <motion.aside
                    className="flex flex-col gap-8"
                    variants={pageVariants as Variants} // Nested stagger for aside cards
                >
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-md"
                        variants={itemVariants as Variants}
                    >
                        <h2 className="mt-0 mb-4 text-xl font-semibold text-gray-800 border-b-2 border-gray-100 pb-2">
                            My Badge Collection
                        </h2>
                        <ErrorBoundary FallbackComponent={WidgetErrorFallback}>
                            <BadgeGallery />
                        </ErrorBoundary>
                    </motion.div>
                    <motion.div
                        className="bg-white p-6 rounded-xl shadow-md"
                        variants={itemVariants as Variants}
                    >
                        <h2 className="mt-0 mb-4 text-xl font-semibold text-gray-800 border-b-2 border-gray-100 pb-2">
                            Team World Map
                        </h2>
                        <ErrorBoundary FallbackComponent={WidgetErrorFallback}>
                            <SharedTeamMap />
                        </ErrorBoundary>
                    </motion.div>
                </motion.aside>
            </motion.main>

            <motion.div
                className="fixed bottom-8 right-8 z-40"
                variants={fabVariants as Variants}
                // initial and animate are inherited from the parent `pageVariants` container
            >
                <button
                    className="flex items-center gap-2 px-6 py-4 text-base font-semibold text-white bg-blue-500 border-none rounded-full cursor-pointer shadow-lg shadow-blue-500/40 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-blue-600"
                    onClick={handleOpenGameModal}
                >
                    <span role="img" aria-label="Game Controller">
                        🎮
                    </span>
                    Launch Focus Game
                </button>
            </motion.div>

            <AnimatePresence>
                {isGameModalOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
                        variants={modalBackdropVariants as Variants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={handleCloseGameModal}
                    >
                        <motion.div
                            className="relative bg-white p-8 rounded-2xl shadow-2xl max-w-[90vw] max-h-[90vh] overflow-auto"
                            variants={modalContentVariants as Variants}
                            exit="exit"
                            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
                        >
                            <ErrorBoundary FallbackComponent={WidgetErrorFallback} onReset={handleCloseGameModal}>
                                <TimeManagementGame />
                            </ErrorBoundary>
                            <button
                                className="absolute top-4 right-4 bg-transparent border-none text-3xl leading-none cursor-pointer text-gray-500 p-2 hover:text-gray-800 transition-colors"
                                onClick={handleCloseGameModal}
                                aria-label="Close Game"
                            >
                                &times;
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StudentDashboard;