import React, {
    JSX,
    useState,
    useMemo,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import {
    motion,
    PanInfo,
    useAnimate,
    AnimatePresence,
    Variants,
} from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import PuzzlePiece from '../PuzzlePiece/PuzzlePiece';

// --- CONSTANTS ---

/**
 * The URL for the full puzzle image. A square image is recommended.
 * @type {string}
 */
const PUZZLE_IMAGE_URL: string = 'https://picsum.photos/450/450.webp';

/**
 * The dimension of the puzzle grid (e.g., 3 for a 3x3 grid).
 * @type {number}
 */
const GRID_DIMENSION: number = 3;

/**
 * The size (width and height) of a single puzzle piece in pixels.
 * @type {number}
 */
const PIECE_SIZE: number = 150;

/**
 * The total size of the puzzle board (width and height) in pixels.
 * @type {number}
 */
const BOARD_SIZE: number = GRID_DIMENSION * PIECE_SIZE;

/**
 * The distance threshold in pixels for a piece to snap into a grid slot.
 * @type {number}
 */
const SNAP_THRESHOLD: number = 30;

// --- TYPES ---

/**
 * @typedef {object} PieceState
 * @property {number} id - A unique identifier for the piece (its original index).
 * @property {number} correctCol - The correct column index (0-indexed) in the grid.
 * @property {number} correctRow - The correct row index (0-indexed) in the grid.
 * @property {number} initialX - The initial horizontal position for the piece when scrambled.
 * @property {number} initialY - The initial vertical position for the piece when scrambled.
 * @property {boolean} isPlaced - A flag indicating if the piece has been correctly placed.
 */
type PieceState = {
    id: number;
    correctCol: number;
    correctRow: number;
    initialX: number;
    initialY: number;
    isPlaced: boolean;
};

// --- FRAMER MOTION VARIANTS ---

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const gridVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 20,
        },
    },
};

const pieceVariants: Variants = {
    unplaced: {
        opacity: 1,
        scale: 1,
        zIndex: 10,
        boxShadow: '0px 5px 15px rgba(0,0,0,0.25)',
        transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    placed: {
        zIndex: 1,
        boxShadow: 'none',
        transition: { duration: 0.2 },
    },
};

const completionOverlayVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 15,
        },
    },
    exit: { opacity: 0, scale: 0.8 },
};

// --- UTILITY FUNCTIONS ---

/**
 * Generates the initial state for all puzzle pieces.
 * It calculates their correct positions and scrambles their initial starting points.
 * @returns {PieceState[]} An array of piece state objects.
 */
const generatePieces = (): PieceState[] => {
    const pieces: PieceState[] = [];
    const pieceAreaWidth = BOARD_SIZE + PIECE_SIZE * 2;
    const pieceAreaHeight = BOARD_SIZE;

    for (let i = 0; i < GRID_DIMENSION * GRID_DIMENSION; i++) {
        const correctRow = Math.floor(i / GRID_DIMENSION);
        const correctCol = i % GRID_DIMENSION;

        // Place scrambled pieces to the right of the board
        const randomX =
            BOARD_SIZE + PIECE_SIZE / 2 + Math.random() * (PIECE_SIZE / 2);
        const randomY =
            Math.random() * (pieceAreaHeight - PIECE_SIZE);

        pieces.push({
            id: i,
            correctCol,
            correctRow,
            initialX: randomX,
            initialY: randomY,
            isPlaced: false,
        });
    }
    return pieces;
};

// --- UI COMPONENTS ---

/**
 * A simple fallback component to display when the puzzle encounters an error.
 * @param {object} props - The props object.
 * @param {Error} props.error - The error that was caught.
 * @returns {JSX.Element} The fallback UI.
 */
const ErrorFallback = ({ error }: { error: Error }): JSX.Element => (
    <div
        role="alert"
        className="p-5 bg-red-50 text-red-700 border border-red-700 rounded-lg"
    >
        <h2 className="text-lg font-bold mb-2">Something went wrong:</h2>
        <pre className="whitespace-pre-wrap">{error.message}</pre>
    </div>
);

/**
 * The core component containing the puzzle logic and state.
 * @returns {JSX.Element} The rendered puzzle game.
 */
const ProjectPuzzleCore = (): JSX.Element => {
    const [pieces, setPieces] = useState<PieceState[]>(generatePieces);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [scope, animate] = useAnimate();

    useEffect(() => {
        const allPlaced = pieces.every((p) => p.isPlaced);
        if (allPlaced) {
            setIsComplete(true);
        }
    }, [pieces]);

    /**
     * Handles the end of a drag event for a puzzle piece.
     * It checks if the piece is dropped near its correct slot and snaps it into place if so.
     * @param {PieceState} piece - The piece that was dragged.
     * @param {PanInfo} info - Information about the drag event.
     */
    const handleDragEnd = useCallback(
        (piece: PieceState, info: PanInfo) => {
            if (piece.isPlaced) return;

            const correctX = piece.correctCol * PIECE_SIZE;
            const correctY = piece.correctRow * PIECE_SIZE;

            const distance = Math.sqrt(
                Math.pow(info.point.x - correctX, 2) +
                Math.pow(info.point.y - correctY, 2)
            );

            if (distance < SNAP_THRESHOLD) {
                // Snap to correct position
                setPieces((prev) =>
                    prev.map((p) =>
                        p.id === piece.id ? { ...p, isPlaced: true } : p
                    )
                );
                // Animate the snap using the piece's unique ID as a selector
                animate(
                    `#piece-${piece.id}`,
                    { x: correctX, y: correctY },
                    { type: 'spring', stiffness: 300, damping: 25 }
                );
            }
        },
        [animate]
    );

    /**
     * Renders the grid slots for the puzzle board.
     * @returns {JSX.Element[]} An array of JSX elements representing grid cells.
     */
    const renderGridSlots = (): JSX.Element[] => {
        return Array.from({ length: GRID_DIMENSION * GRID_DIMENSION }).map(
            (_, index) => (
                <div
                    key={index}
                    className="box-border border border-dashed border-slate-400"
                    style={{
                        width: `${PIECE_SIZE}px`,
                        height: `${PIECE_SIZE}px`,
                    }}
                />
            )
        );
    };

    return (
        <motion.div
            className="flex items-center justify-center p-10 font-sans bg-slate-100 rounded-2xl shadow-xl"
            variants={containerVariants as Variants}
            initial="hidden"
            animate="visible"
        >
            <div ref={scope}>
                <div
                    ref={constraintsRef}
                    className="relative"
                    style={{
                        width: `${BOARD_SIZE + PIECE_SIZE * 2}px`,
                        height: `${BOARD_SIZE}px`,
                    }}
                >
                    <motion.div
                        className="relative grid border-2 border-slate-300 bg-slate-200 shadow-inner"
                        variants={gridVariants as Variants}
                        style={{
                            width: `${BOARD_SIZE}px`,
                            height: `${BOARD_SIZE}px`,
                            gridTemplateColumns: `repeat(${GRID_DIMENSION}, 1fr)`,
                            gridTemplateRows: `repeat(${GRID_DIMENSION}, 1fr)`,
                        }}
                    >
                        {renderGridSlots()}
                        <AnimatePresence>
                            {isComplete && (
                                <motion.div
                                    variants={
                                        completionOverlayVariants as Variants
                                    }
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="absolute inset-0 z-[100] flex items-center justify-center bg-green-600/85 text-3xl font-bold text-white backdrop-blur-sm"
                                >
                                    Project Complete!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {pieces.map((piece) => {
                        const backgroundPosition = `-${piece.correctCol * PIECE_SIZE}px -${piece.correctRow * PIECE_SIZE}px`;
                        return (
                            <motion.div
                                id={`piece-${piece.id}`}
                                key={piece.id}
                                variants={pieceVariants as Variants}
                                initial={{
                                    x: piece.initialX,
                                    y: piece.initialY,
                                    opacity: 0,
                                    scale: 0.5,
                                }}
                                animate={
                                    piece.isPlaced ? 'placed' : 'unplaced'
                                }
                                onDragEnd={(_event, info) =>
                                    handleDragEnd(piece, info)
                                }
                                drag={!piece.isPlaced}
                                dragConstraints={constraintsRef}
                                dragElastic={0.2}
                                whileHover={{
                                    scale: piece.isPlaced ? 1 : 1.05,
                                    cursor: piece.isPlaced ? 'default' : 'grab',
                                }}
                                whileTap={{
                                    scale: 1.1,
                                    cursor: 'grabbing',
                                    zIndex: 20,
                                }}
                                className={`absolute top-0 left-0 ${
                                    isComplete ? 'rounded-none' : 'rounded'
                                }`}
                                style={{
                                    width: PIECE_SIZE,
                                    height: PIECE_SIZE,
                                    backgroundImage: `url(${PUZZLE_IMAGE_URL})`,
                                    backgroundSize: `${BOARD_SIZE}px ${BOARD_SIZE}px`,
                                    backgroundPosition,
                                }}
                            >
                                {/* PuzzlePiece component is used as a visual overlay/skin */}
                                {/* It doesn't receive props, adhering to the design constraint */}
                                <PuzzlePiece />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

/**
 * A playful micro-interaction component that presents a drag-and-drop puzzle.
 * It contains a grid and a collection of PuzzlePiece components that the user
 * must assemble correctly to reveal a full project image.
 * This component is self-contained and uses internal constant data, requiring no props.
 * It includes an error boundary for robust rendering.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import ProjectPuzzle from './components/ProjectPuzzle/ProjectPuzzle';
 *
 * const App = () => (
 *   <main>
 *     <h1>My Awesome Project</h1>
 *     <ProjectPuzzle />
 *   </main>
 * );
 * ```
 * @returns {JSX.Element} The fully functional ProjectPuzzle component.
 */
const ProjectPuzzle = (): JSX.Element => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ProjectPuzzleCore />
    </ErrorBoundary>
);

export default ProjectPuzzle;