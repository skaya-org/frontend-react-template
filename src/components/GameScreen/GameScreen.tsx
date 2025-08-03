import React, {
	useState,
	useCallback,
	createContext,
	useMemo,
	JSX,
} from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import GameHeader from '../GameHeader/GameHeader';
import Gameboard from '../Gameboard/Gameboard';

/**
 * @typedef {object} GameContextType
 * @property {() => void} onLevelComplete - A callback function to be invoked when the level is successfully completed.
 * This is consumed by child components like Gameboard.
 */
type GameContextType = {
	onLevelComplete: () => void;
};

/**
 * Provides a default no-op function for `onLevelComplete`.
 * This prevents runtime errors if a component consuming this context is rendered
 * outside of the `GameContext.Provider`. It also provides a helpful warning.
 * This context is exported so that child components (e.g., Gameboard) can import
 * and use it to signal game events to the parent GameScreen.
 * @type {React.Context<GameContextType>}
 */
export const GameContext = createContext<GameContextType>({
	onLevelComplete: () => {
		// This warning helps developers identify if a component is misplaced in the tree.
		console.warn(
			'onLevelComplete was called outside of a GameContext.Provider.',
		);
	},
});

/**
 * A simple, styled fallback component to display when a critical error occurs
 * within the game screen.
 *
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @param {Error} props.error - The error that was caught.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const GameErrorFallback = ({ error }: FallbackProps): JSX.Element => (
	<div
		className="flex h-screen flex-col items-center justify-center bg-red-50 p-8 text-center text-red-800"
		role="alert"
	>
		<h2 className="mb-2 text-2xl font-bold">Something went wrong.</h2>
		<p className="mb-4">We encountered an error while loading the game.</p>
		<pre className="mt-4 max-w-[80%] overflow-x-auto rounded-lg bg-red-100 p-4 font-mono">
			{error.message}
		</pre>
	</div>
);

// Animation Variants
const screenContainerVariants: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const screenItemVariants: Variants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: 'spring',
			stiffness: 120,
		},
	},
};

const modalBackdropVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.3 } },
};

const modalContentVariants: Variants = {
	hidden: { scale: 0.7, opacity: 0 },
	visible: {
		scale: 1,
		opacity: 1,
		transition: { type: 'spring', damping: 15, stiffness: 300 },
	},
};

/**
 * The GameScreen component serves as the primary view for an active game level.
 * It orchestrates the display of the header, the interactive game board, and
 * a "Level Complete" modal. This component is self-contained and manages its
 * own state, requiring no props. It uses a React Context (`GameContext`) to allow
 * child components, like `Gameboard`, to signal completion events without direct prop passing,
 * adhering to the strict component design.
 *
 * @returns {JSX.Element} The fully functional game screen.
 */
const GameScreen = (): JSX.Element => {
	const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);

	/**
	 * Callback function to set the level completion state to true.
	 * This function is memoized with `useCallback` to ensure it maintains a stable
	 * reference across re-renders, which is a best practice when passing callbacks
	 * through context.
	 */
	const handleLevelComplete = useCallback((): void => {
		setIsLevelComplete(true);
	}, []);

	/**
	 * Callback to close the level completion modal and reset the state.
	 * This allows the user to dismiss the modal. In a real-world scenario,
	 * this might also trigger navigation to the next level or a level selection screen.
	 */
	const handleCloseModal = useCallback((): void => {
		setIsLevelComplete(false);
	}, []);

	/**
	 * Memoized context value to be passed to the `GameContext.Provider`.
	 * `useMemo` prevents the context value object from being recreated on every render,
	 * thus optimizing performance by preventing unnecessary re-renders of consumer components.
	 */
	const contextValue = useMemo(
		() => ({
			onLevelComplete: handleLevelComplete,
		}),
		[handleLevelComplete],
	);

	return (
		<ErrorBoundary FallbackComponent={GameErrorFallback}>
			<GameContext.Provider value={contextValue}>
				<motion.div
					className="flex h-screen w-screen flex-col bg-slate-100 font-sans text-slate-800"
					variants={screenContainerVariants as Variants}
					initial="hidden"
					animate="visible"
				>
					<motion.div variants={screenItemVariants as Variants}>
						<GameHeader />
					</motion.div>
					<motion.main
						className="flex flex-1 items-center justify-center p-8"
						variants={screenItemVariants as Variants}
					>
						<Gameboard />
					</motion.main>

					<AnimatePresence>
						{isLevelComplete && (
							<motion.div
								key="modal-backdrop"
								className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
								variants={modalBackdropVariants as Variants}
								initial="hidden"
								animate="visible"
								exit="hidden"
							>
								<motion.div
									key="modal-content"
									className="w-[90%] max-w-sm rounded-xl bg-white p-8 px-12 text-center shadow-xl"
									variants={modalContentVariants as Variants}
									initial="hidden"
									animate="visible"
									exit="hidden"
									role="dialog"
									aria-modal="true"
									aria-labelledby="modal-title"
								>
									<h2
										id="modal-title"
										className="mb-2 text-3xl font-bold text-slate-700"
									>
										Level Complete!
									</h2>
									<p className="mb-6 text-base text-slate-600">
										Congratulations, you have mastered the challenge!
									</p>
									<button
										className="cursor-pointer rounded-lg bg-blue-500 px-6 py-3 text-base font-semibold text-white transition-colors duration-200 ease-in-out hover:bg-blue-600"
										onClick={handleCloseModal}
									>
										Continue
									</button>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</GameContext.Provider>
		</ErrorBoundary>
	);
};

export default GameScreen;