import React, { JSX, CSSProperties, useMemo } from 'react';
import { motion, PanInfo, Variants } from 'framer-motion';
import { withErrorBoundary, FallbackProps } from 'react-error-boundary';

/**
 * @file Defines the PuzzlePiece component, a single draggable element of a larger image puzzle.
 * @author Senior Fullstack/TypeScript Developer
 * @version 1.1.0
 */

// --- CONSTANT DATA ---
// In a typical application, this data would be passed via props.
// Per the requirements, we use constants to make the component self-contained.

/**
 * Represents the configuration for a single puzzle piece.
 * This constant defines the piece's appearance and its correct placement within the larger puzzle.
 * @property {string} imageUrl - The URL of the full image for the puzzle.
 * @property {{width: number, height: number}} imageSize - The dimensions of the full source image.
 * @property {{width: number, height: number}} pieceSize - The dimensions of this individual puzzle piece.
 * @property {{row: number, col: number}} gridPosition - The 0-indexed row and column of this piece in the solved puzzle grid.
 * @property {{x: number, y: number}} initialOffset - The initial position of the piece on the canvas, relative to the top-left corner.
 */
const PUZZLE_PIECE_DATA = {
  imageUrl: 'https://picsum.photos/400/400.webp',
  imageSize: { width: 400, height: 400 },
  pieceSize: { width: 100, height: 100 },
  gridPosition: { row: 1, col: 2 }, // Example: 2nd row, 3rd column
  initialOffset: { x: 50, y: 150 },
};

/**
 * Defines the bounding box for dragging the puzzle piece.
 * In a real component, this might be a ref to the puzzle board container.
 * @property {number} top - The maximum negative y-offset.
 * @property {number} left - The maximum negative x-offset.
 * @property {number} right - The maximum positive x-offset.
 * @property {number} bottom - The maximum positive y-offset.
 */
const DRAG_CONSTRAINTS = {
  top: -250,
  left: -300,
  right: 300,
  bottom: 250,
};

// --- ANIMATION VARIANTS ---

/**
 * Defines the animation states for the puzzle piece.
 * Using variants centralizes animation logic and keeps the JSX clean.
 */
const pieceVariants: Variants = {
  // Initial state before the component mounts
  initial: {
    opacity: 0,
    scale: 0.7,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  // State once the component is visible
  visible: {
    opacity: 1,
    scale: 1,
    // Corresponds to Tailwind's shadow-lg
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      // A small, random delay adds a more organic feel if multiple pieces animate in
      delay: 0.1 + Math.random() * 0.2,
    },
  },
  // State when the user hovers over the piece
  hover: {
    scale: 1.05,
    zIndex: 50,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
    transition: { type: 'tween', duration: 0.2 },
  },
  // State while the piece is being actively dragged
  dragging: {
    scale: 1.1,
    zIndex: 100, // Ensure the dragged piece is always on top
    cursor: 'grabbing',
    // A more pronounced shadow to lift it off the "board"
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
  },
};


// --- ERROR BOUNDARY FALLBACK ---

/**
 * A fallback component to render if the PuzzlePiece encounters a critical error.
 * This provides a graceful degradation of the UI.
 * @param {FallbackProps} props - Props provided by react-error-boundary, including the error object.
 * @returns {JSX.Element} A simple UI element indicating an error.
 */
const PuzzlePieceErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div
    role="alert"
    className="flex items-center justify-center p-2 text-center text-xs bg-red-200 text-red-800 border border-red-800 rounded-lg"
    style={{
      width: `${PUZZLE_PIECE_DATA.pieceSize.width}px`,
      height: `${PUZZLE_PIECE_DATA.pieceSize.height}px`,
    }}
  >
    <p>
      <strong>Piece Error:</strong>
      <br />
      <span className="block whitespace-nowrap overflow-hidden text-ellipsis">
        {error.message}
      </span>
    </p>
  </div>
);


// --- CORE COMPONENT ---

/**
 * A single, draggable piece of a larger image puzzle.
 *
 * This component is designed to be a self-contained, interactive element.
 * It uses `framer-motion` to handle drag-and-drop functionality with smooth animations.
 * The piece's appearance, representing a cropped section of a larger image,
 * is determined by constant data, adhering to the project's specific architectural constraints.
 * It is wrapped in an Error Boundary to ensure robustness.
 *
 * @component
 * @returns {JSX.Element} The rendered draggable puzzle piece.
 */
const PuzzlePiece = (): JSX.Element => {
  /**
   * Memoizes the calculation of the piece's CSS style properties.
   * This prevents recalculation on every render unless the source data changes.
   *
   * The `backgroundPosition` is calculated to show the correct part of the master image,
   * effectively "cutting" the piece from the source.
   */
  const pieceStyle = useMemo((): CSSProperties => {
    const backgroundPositionX = -PUZZLE_PIECE_DATA.gridPosition.col * PUZZLE_PIECE_DATA.pieceSize.width;
    const backgroundPositionY = -PUZZLE_PIECE_DATA.gridPosition.row * PUZZLE_PIECE_DATA.pieceSize.height;

    return {
      width: `${PUZZLE_PIECE_DATA.pieceSize.width}px`,
      height: `${PUZZLE_PIECE_DATA.pieceSize.height}px`,
      backgroundImage: `url(${PUZZLE_PIECE_DATA.imageUrl})`,
      backgroundSize: `${PUZZLE_PIECE_DATA.imageSize.width}px ${PUZZLE_PIECE_DATA.imageSize.height}px`,
      backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
      // position, cursor, boxShadow, borderRadius are now Tailwind classes.
      willChange: 'transform', // Performance optimization for animations
      // Initial position is set via motion props `x` and `y` for better animation control.
    };
  }, []);

  /**
   * A handler for the onDragEnd event.
   * This could be used in the future to implement snap-to-grid logic or
   * communicate the final position to a state manager.
   * @param {MouseEvent | TouchEvent | PointerEvent} _event - The input event.
   * @param {PanInfo} info - Information about the drag gesture.
   */
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    console.log(`Piece dropped at: x=${info.point.x}, y=${info.point.y}`);
    // Future logic: check if position is correct, snap to grid, etc.
  };

  return (
    <motion.div
      aria-label="Draggable puzzle piece"
      className="absolute cursor-grab rounded-lg shadow-lg"
      style={{
        ...pieceStyle,
        x: PUZZLE_PIECE_DATA.initialOffset.x,
        y: PUZZLE_PIECE_DATA.initialOffset.y,
      }}
      // Animation props using variants
      variants={pieceVariants as Variants}
      initial="initial"
      animate="visible"
      whileHover="hover"
      whileTap="dragging" // Use 'dragging' variant for tap for immediate grabbing feedback
      whileDrag="dragging"
      // Drag functionality props (unchanged)
      drag
      dragConstraints={DRAG_CONSTRAINTS}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
    />
  );
};

// --- HOC WRAPPER & EXPORT ---

/**
 * The PuzzlePiece component wrapped with a React Error Boundary.
 * This ensures that if the component fails to render for any reason,
 * it won't crash the entire application, and a fallback UI will be displayed instead.
 */
const PuzzlePieceWithBoundary = withErrorBoundary(PuzzlePiece, {
  FallbackComponent: PuzzlePieceErrorFallback,
  onError: (error, info) => {
    // In a production environment, log this error to a monitoring service.
    console.error("PuzzlePiece failed to render:", error, info.componentStack);
  },
});

export default PuzzlePieceWithBoundary;