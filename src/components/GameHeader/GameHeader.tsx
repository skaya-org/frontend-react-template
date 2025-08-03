import React, { useState, useCallback, JSX } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';

// --- Animation Variants ---

/**
 * Variants for the main header container.
 * Animates the header sliding down and fading in. It also orchestrates
 * the animation of its children with a stagger effect.
 */
const headerVariants: Variants = {
    hidden: {
        y: -50,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
            when: 'beforeChildren',
            staggerChildren: 0.2,
        },
    },
};

/**
 * Variants for the individual items within the header (Level, Score, Button).
 * Animates each item fading in and moving up into place.
 */
const itemVariants: Variants = {
    hidden: {
        y: 20,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

/**
 * Variants for the Play/Pause icons.
 * Controls the enter and exit animations for the icon swap.
 */
const iconVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.5,
        rotate: -90,
    },
    animate: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        scale: 0.5,
        rotate: 90,
        transition: {
            duration: 0.2,
            ease: 'easeIn',
        },
    },
};

// --- Constants ---

/**
 * @constant CURRENT_LEVEL
 * @description The current level to be displayed. This is static data to ensure
 * the component is self-contained and does not require props from a parent.
 * @type {number}
 */
const CURRENT_LEVEL: number = 5;

/**
 * @constant INITIAL_SCORE
 * @description The initial score to be displayed. This is static data, making
 * the component independent. The score is formatted with `toLocaleString` for readability.
 * @type {number}
 */
const INITIAL_SCORE: number = 12500;


// --- Child Components / Icons ---

/**
 * Renders the SVG for the pause symbol.
 * @returns {JSX.Element} The SVG element for the pause icon.
 */
const PauseIcon = (): JSX.Element => (
    <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

/**
 * Renders the SVG for the play/resume symbol.
 * @returns {JSX.Element} The SVG element for the play icon.
 */
const PlayIcon = (): JSX.Element => (
     <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path d="M8 5v14l11-7z" />
    </svg>
);


// --- Main Component ---

/**
 * GameHeader is a self-contained component that displays game-related information
 * such as the current level and score. It also includes a pause button with its
 * own internal state management.
 *
 * This component is designed to be fully independent and does not require any props.
 * All data is provided by internal constants. It is expected to be wrapped in an
 * ErrorBoundary in the application's layout to handle any potential rendering errors gracefully.
 *
 * @component
 * @returns {JSX.Element} The rendered game header component.
 */
const GameHeader = (): JSX.Element => {
    /**
     * @state {boolean} isPaused - Manages the pause state of the game internally.
     * `true` if the game is considered paused, `false` otherwise.
     */
    const [isPaused, setIsPaused] = useState<boolean>(false);

    /**
     * Toggles the internal pause state. This is a self-contained action and does not
     * affect any parent component's state, adhering to the component's design principles.
     * It is memoized with `useCallback` for performance optimization, preventing
     * re-creation on re-renders.
     *
     * @function handlePauseToggle
     */
    const handlePauseToggle = useCallback(() => {
        setIsPaused(prevState => !prevState);
        // In a real application, this callback might dispatch a global state change,
        // emit an event, or call a game engine API. For this component, it only
        // toggles the icon to demonstrate internal state management.
    }, []);

    return (
        <motion.header
            className="flex justify-between items-center py-4 px-8 bg-gray-800 text-gray-200 font-sans border-b-2 border-gray-700 select-none shadow-lg"
            role="banner"
            variants={headerVariants as Variants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="text-xl font-bold"
                variants={itemVariants as Variants}
            >
                Level {CURRENT_LEVEL}
            </motion.div>
            <motion.div
                className="text-xl font-bold tabular-nums"
                variants={itemVariants as Variants}
            >
                Score: {INITIAL_SCORE.toLocaleString()}
            </motion.div>
            <motion.button
                className="p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 hover:bg-white/10"
                onClick={handlePauseToggle}
                aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
                title={isPaused ? 'Resume Game' : 'Pause Game'}
                variants={itemVariants as Variants}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isPaused ? (
                        <motion.span
                            key="play"
                            variants={iconVariants as Variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <PlayIcon />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="pause"
                            variants={iconVariants as Variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <PauseIcon />
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </motion.header>
    );
};

export default GameHeader;