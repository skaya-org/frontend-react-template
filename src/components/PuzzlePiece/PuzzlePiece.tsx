import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @file PuzzlePiece.tsx
 * @description Renders a static, self-contained conductive puzzle piece.
 * This component follows a strict "no props" policy, deriving its appearance
 * from internal constant data. It is designed to be a building block in a
 * larger puzzle game, where each piece type might be its own component or
 * where this component is used as a template.
 */

/**
 * Enumerates the possible types of puzzle pieces.
 * Each type corresponds to a specific SVG path and visual representation.
 * @enum {string}
 */
enum PieceType {
  /** A straight piece oriented vertically. */
  STRAIGHT_VERTICAL = 'STRAIGHT_VERTICAL',
  /** A straight piece oriented horizontally. */
  STRAIGHT_HORIZONTAL = 'STRAIGHT_HORIZONTAL',
  /** A 90-degree corner connecting top and left paths. */
  CORNER_TOP_LEFT = 'CORNER_TOP_LEFT',
  /** A 90-degree corner connecting top and right paths. */
  CORNER_TOP_RIGHT = 'CORNER_TOP_RIGHT',
  /** A 90-degree corner connecting bottom and left paths. */
  CORNER_BOTTOM_LEFT = 'CORNER_BOTTOM_LEFT',
  /** A 90-degree corner connecting bottom and right paths. */
  CORNER_BOTTOM_RIGHT = 'CORNER_BOTTOM_RIGHT',
}

/**
 * Configuration for the puzzle piece rendered by this component.
 * To change the piece's appearance, modify the `type` property here.
 * This constant data approach ensures the component is self-contained and
 * does not require props from its parent.
 *
 * @const
 * @type {{ type: PieceType }}
 */
const PIECE_CONFIG: { type: PieceType } = {
  type: PieceType.CORNER_TOP_LEFT,
};

/**
 * A map of `PieceType` to its corresponding SVG path data (`d` attribute).
 * The paths are designed for a 100x100 SVG viewbox.
 *
 * @const
 * @type {Readonly<Record<PieceType, string>>}
 */
const PIECE_PATHS: Readonly<Record<PieceType, string>> = {
  [PieceType.STRAIGHT_VERTICAL]: 'M 50 0 L 50 100',
  [PieceType.STRAIGHT_HORIZONTAL]: 'M 0 50 L 100 50',
  [PieceType.CORNER_TOP_LEFT]: 'M 0 50 L 50 50 L 50 0',
  [PieceType.CORNER_TOP_RIGHT]: 'M 100 50 L 50 50 L 50 0',
  [PieceType.CORNER_BOTTOM_LEFT]: 'M 0 50 L 50 50 L 50 100',
  [PieceType.CORNER_BOTTOM_RIGHT]: 'M 100 50 L 50 50 L 50 100',
};

/**
 * Animation variants for the main container of the puzzle piece.
 * Controls the initial appearance and hover state.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'backOut',
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

/**
 * Animation variants for the SVG path.
 * Controls the "drawing" effect and the neon glow intensity on hover.
 */
const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    // The initial neon glow effect is controlled here
    filter: 'drop-shadow(0 0 2px #00f6ff) drop-shadow(0 0 5px #00f6ff)',
    transition: {
      pathLength: { duration: 1.5, ease: 'easeInOut', delay: 0.4 },
      opacity: { duration: 0.01, delay: 0.4 },
    },
  },
  hover: {
    // Intensify the glow on hover for a responsive feel
    filter: 'drop-shadow(0 0 5px #00f6ff) drop-shadow(0 0 15px #00f6ff)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

/**
 * Renders a single, static conductive puzzle piece.
 *
 * This component's appearance is determined by its internal `PIECE_CONFIG`
 * constant, making it a self-sufficient visual element. It is styled to have
 * a neon glow effect, suitable for a futuristic or sci-fi themed puzzle game.
 * The component is designed to be robust; it will throw a runtime error if
 * its internal configuration is invalid, allowing a parent `ErrorBoundary`
 * to catch the issue.
 *
 * @component
 * @returns {JSX.Element} The rendered puzzle piece.
 * @throws {Error} If the `PIECE_CONFIG.type` does not correspond to a valid path.
 */
const PuzzlePiece = (): JSX.Element => {
  const piecePath = PIECE_PATHS[PIECE_CONFIG.type];

  if (!piecePath) {
    throw new Error(
      `PuzzlePiece Error: Invalid piece type "${PIECE_CONFIG.type}" configured. No corresponding SVG path found.`,
    );
  }

  return (
    <motion.div
      className="flex h-[100px] w-[100px] items-center justify-center rounded-lg bg-[#1a1a2e]"
      role="img"
      aria-label={`Puzzle piece: ${PIECE_CONFIG.type}`}
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        // Prevent path from overflowing its container during animation
        style={{ overflow: 'visible' }}
      >
        <title>Conductive Puzzle Path</title>
        <motion.path
          d={piecePath}
          // The CSS filter is removed from className and is now fully controlled by Framer Motion variants
          className="fill-none stroke-[5] stroke-[#00f6ff]"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants as Variants}
        />
      </svg>
    </motion.div>
  );
};

export default PuzzlePiece;