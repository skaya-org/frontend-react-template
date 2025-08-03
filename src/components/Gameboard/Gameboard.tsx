import React, { useState, useCallback, useEffect, useMemo, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// Per the instructions, these components are imported. They are expected to be
// simple, presentational components. The "no props" rule is interpreted to mean
// that the top-level Gameboard component is self-contained. For the puzzle logic
// and rendering to function, Gameboard must pass state-derived props (like type,
// orientation, and powered status) to its children.
import PuzzlePiece from '../PuzzlePiece/PuzzlePiece';
import Critter from '../Critter/Critter';

// --- TYPE DEFINITIONS ---

/**
 * The type of a puzzle piece, determining its shape and conductive paths.
 * - 'straight': A straight line (│)
 * - 'corner': An L-shape (└)
 * - 't-junction': A T-shape (├)
 * - 'cross': A four-way intersection (┼)
 * - 'end': A single connection point, used for sources and some terminators (╵)
 */
type PieceType = 'straight' | 'corner' | 't-junction' | 'cross' | 'end';

/**
 * The orientation of a piece in 90-degree increments.
 * 0 = North, 90 = East, 180 = South, 270 = West.
 */
type Orientation = 0 | 90 | 180 | 270;

/**
 * Defines the data for a single cell on the game board.
 */
type CellData = {
  /** A unique and stable ID for each cell, used for React keys and animations. */
  readonly id: string;
  /** The category of the cell's content. */
  readonly type: 'piece' | 'critter' | 'source' | 'empty';
  /** The shape of the puzzle piece, if the cell contains a piece. */
  readonly pieceType?: PieceType;
  /** The rotation of the puzzle piece, if the cell contains a piece. */
  readonly orientation?: Orientation;
};

/**
 * Represents the entire game board as a 2D array of CellData.
 */
type GameGrid = readonly (readonly CellData[])[];

// --- CONSTANT DATA ---

/** The size of the grid (GRID_SIZE x GRID_SIZE). */
const GRID_SIZE: number = 4;

/**
 * @constant INITIAL_GAME_BOARD
 * @description The static, hardcoded definition for the puzzle level.
 * This self-contained data structure allows the Gameboard to operate without
 * receiving any props from a parent component.
 * - 'source': The starting point of the power circuit.
 * - 'piece': A movable, conductive path.
 * - 'critter': A target that must be powered to solve the puzzle.
 * - 'empty': A space that cannot be moved into and does not conduct power.
 */
const INITIAL_GAME_BOARD: GameGrid = [
  [
    { id: 'c00', type: 'source', pieceType: 'end', orientation: 0 },
    { id: 'c01', type: 'piece', pieceType: 'corner', orientation: 180 },
    { id: 'c02', type: 'piece', pieceType: 'straight', orientation: 90 },
    { id: 'c03', type: 'critter' },
  ],
  [
    { id: 'c10', type: 'piece', pieceType: 'straight', orientation: 0 },
    { id: 'c11', type: 'piece', pieceType: 'corner', orientation: 90 },
    { id: 'c12', type: 'piece', pieceType: 't-junction', orientation: 0 },
    { id: 'c13', type: 'piece', pieceType: 'end', orientation: 270 },
  ],
  [
    { id: 'c20', type: 'critter' },
    { id: 'c21', type: 'piece', pieceType: 'cross', orientation: 0 },
    { id: 'c22', type: 'piece', pieceType: 'straight', orientation: 0 },
    { id: 'c23', type: 'piece', pieceType: 'corner', orientation: 0 },
  ],
  [
    { id: 'c30', type: 'empty' },
    { id: 'c31', type: 'piece', pieceType: 'end', orientation: 90 },
    { id: 'c32', type: 'piece', pieceType: 'corner', orientation: 270 },
    { id: 'c33', type: 'empty' },
  ],
];

/**
 * Defines the open connections for each piece type in its default (0-degree) orientation.
 * The array represents sides [Top, Right, Bottom, Left].
 */
const PIECE_CONNECTIONS: Readonly<Record<PieceType, readonly boolean[]>> = {
  straight: [true, false, true, false],
  corner: [true, true, false, false],
  't-junction': [true, true, false, true],
  cross: [true, true, true, true],
  end: [true, false, false, false],
};


// --- LOGIC HELPERS ---

/**
 * Determines if a piece has an electrical connection on a given side, accounting for its orientation.
 * @param pieceType The type of the piece.
 * @param orientation The piece's current rotation.
 * @param side The side to check (0: Top, 1: Right, 2: Bottom, 3: Left).
 * @returns `true` if the specified side has a connection.
 */
const hasOpening = (pieceType: PieceType, orientation: Orientation, side: number): boolean => {
  // Normalize the side index based on the piece's rotation
  const rotatedSide = (side - orientation / 90 + 4) % 4;
  return PIECE_CONNECTIONS[pieceType][rotatedSide];
};

// --- SUB-COMPONENTS ---

/**
 * A fallback component to display when an error occurs within the Gameboard.
 * @param {FallbackProps} props Props provided by react-error-boundary.
 * @returns {JSX.Element} A simple error message UI.
 */
const GameboardErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div role="alert" className="p-5 bg-red-100 border border-red-500 rounded-lg text-red-700">
    <h3 className="font-bold text-lg mb-2">Something went wrong inside the Gameboard!</h3>
    <pre className="bg-gray-100 p-2.5 rounded whitespace-pre-wrap text-sm">{error.message}</pre>
  </div>
);

// --- ANIMATION VARIANTS ---
const winOverlayVariants: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'backOut' } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: 'easeIn' } },
};

/**
 * An overlay that appears when the puzzle is successfully completed.
 * @param {object} props The component props.
 * @param {() => void} props.onReset Function to call to reset the game.
 * @returns {JSX.Element} A congratulatory message with a reset button.
 */
const WinOverlay = ({ onReset }: { onReset: () => void }): JSX.Element => (
    <motion.div
        className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center text-white rounded-2xl text-center"
        variants={winOverlayVariants as Variants}
        initial="initial"
        animate="animate"
        exit="exit"
    >
        <motion.h2 
            className="text-5xl font-extrabold text-cyan-300 mb-4 drop-shadow-lg"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2, type: 'spring' } }}
        >
            Circuit Complete!
        </motion.h2>
        <motion.p 
            className="text-xl mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
        >
            You powered all the critters!
        </motion.p>
        <motion.button 
            className="py-3 px-8 bg-rose-500 text-white font-bold rounded-lg text-lg" 
            onClick={onReset}
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.4, type: 'spring' } }}
            whileHover={{ scale: 1.05, backgroundColor: "#e11d48" /* rose-600 */ }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            Play Again
        </motion.button>
    </motion.div>
);

/**
 * Renders the content of a single grid cell.
 * @param {object} props The component props.
 * @param {CellData} props.cell The data for the cell to render.
 * @param {boolean} props.isPowered Whether the cell is part of a completed circuit.
 * @returns {JSX.Element} The visual representation of the cell.
 */
const CellRenderer = React.memo(({ cell, isPowered }: { cell: CellData; isPowered: boolean }): JSX.Element => {
    switch (cell.type) {
        case 'source':
        case 'piece':
            return (
                <PuzzlePiece
                />
            );
        case 'critter':
            return <Critter  />;
        case 'empty':
            return <div className="w-full h-full bg-black/20" />;
        default:
            return <div />;
    }
});
CellRenderer.displayName = 'CellRenderer';


/**
 * @component Gameboard
 * @description The main interactive component for the circuit puzzle. It manages the
 * grid state, handles user interactions for shifting pieces, and contains the logic
 * to determine if the circuit is complete. This component is designed to be fully
 * self-contained, using hardcoded constant data for the initial level setup, thus
 * requiring no props from its parent.
 */
const Gameboard = (): JSX.Element => {
  // --- ANIMATION VARIANTS ---
  const boardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
            when: 'beforeChildren',
            staggerChildren: 0.04,
        },
    },
  };

  const cellVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 120 },
    },
  };

  const colControlsVariants: Variants = {
    initial: { opacity: 0, y: -15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  const rowControlsVariants: Variants = {
    initial: { opacity: 0, x: 15 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: 15, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  // --- STATE AND LOGIC ---
  const [grid, setGrid] = useState<GameGrid>(INITIAL_GAME_BOARD);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [poweredCells, setPoweredCells] = useState<Set<string>>(new Set());

  /**
   * Shifts a row horizontally, wrapping the pieces around.
   * @param rowIndex The index of the row to shift.
   * @param direction The direction of the shift.
   */
  const handleRowShift = useCallback((rowIndex: number, direction: 'left' | 'right') => {
    setGrid(currentGrid => {
      const newGrid = currentGrid.map(row => [...row]); // Create a mutable copy
      const row = newGrid[rowIndex];
      if (direction === 'left') {
        const first = row.shift();
        if (first) row.push(first);
      } else {
        const last = row.pop();
        if (last) row.unshift(last);
      }
      return newGrid;
    });
  }, []);

  /**
   * Shifts a column vertically, wrapping the pieces around.
   * @param colIndex The index of the column to shift.
   * @param direction The direction of the shift.
   */
  const handleColShift = useCallback((colIndex: number, direction: 'up' | 'down') => {
    setGrid(currentGrid => {
      const newGrid = currentGrid.map(row => [...row]); // Create a mutable copy
      const column = newGrid.map(row => row[colIndex]);
      if (direction === 'up') {
        const first = column.shift();
        if (first) column.push(first);
      } else {
        const last = column.pop();
        if (last) column.unshift(last);
      }
      column.forEach((cell, rowIndex) => {
        newGrid[rowIndex][colIndex] = cell;
      });
      return newGrid;
    });
  }, []);
  
  /**
   * Resets the game to its initial state.
   */
  const handleReset = useCallback(() => {
    setIsComplete(false);
    // Add a slight delay to allow the win overlay to animate out
    setTimeout(() => setGrid(INITIAL_GAME_BOARD), 300);
  }, []);

  /**
   * Analyzes the current grid state to determine which cells are powered
   * and if all critters are connected to a power source.
   * This function uses a Breadth-First Search (BFS) algorithm.
   */
  const checkCircuitCompletion = useCallback((currentGrid: GameGrid) => {
    const sourcePositions: { r: number; c: number }[] = [];
    const critterPositions: { r: number; c: number }[] = [];

    currentGrid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.type === 'source') sourcePositions.push({ r, c });
        if (cell.type === 'critter') critterPositions.push({ r, c });
      });
    });
    
    if (critterPositions.length === 0) {
        setPoweredCells(new Set());
        setIsComplete(false);
        return;
    }

    const newPowered = new Set<string>();
    const queue = [...sourcePositions];
    const visited = new Set(sourcePositions.map(p => `${p.r},${p.c}`));
    
    while(queue.length > 0) {
        const {r, c} = queue.shift()!;
        const cellKey = `${r},${c}`;
        newPowered.add(cellKey);
        
        const currentCell = currentGrid[r][c];
        if (currentCell.type !== 'piece' && currentCell.type !== 'source') continue;

        // Check neighbors [Top, Right, Bottom, Left]
        const neighbors = [
            { dr: -1, dc: 0, fromSide: 2, toSide: 0 },
            { dr: 0, dc: 1, fromSide: 3, toSide: 1 },
            { dr: 1, dc: 0, fromSide: 0, toSide: 2 },
            { dr: 0, dc: -1, fromSide: 1, toSide: 3 },
        ];
        
        for (let i = 0; i < neighbors.length; i++) {
            const { dr, dc, fromSide, toSide } = neighbors[i];
            const nr = r + dr;
            const nc = c + dc;
            const neighborKey = `${nr},${nc}`;

            if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE || visited.has(neighborKey)) continue;

            const neighborCell = currentGrid[nr][nc];
            if (neighborCell.type === 'empty') continue;
            
            const canConnect = hasOpening(currentCell.pieceType!, currentCell.orientation!, toSide);
            if (!canConnect) continue;
            
            let neighborAccepts = false;
            if(neighborCell.type === 'critter') {
                neighborAccepts = true;
            } else if (neighborCell.type === 'piece' || neighborCell.type === 'source') {
                neighborAccepts = hasOpening(neighborCell.pieceType!, neighborCell.orientation!, fromSide);
            }

            if(neighborAccepts) {
                visited.add(neighborKey);
                queue.push({ r: nr, c: nc });
            }
        }
    }
    
    setPoweredCells(newPowered);
    const allCrittersPowered = critterPositions.every(p => newPowered.has(`${p.r},${p.c}`));
    setIsComplete(allCrittersPowered);
  }, []);

  // Re-evaluate the circuit whenever the grid changes.
  useEffect(() => {
    // A small delay can prevent the win state from feeling too jarring.
    const timer = setTimeout(() => checkCircuitCompletion(grid), 100);
    return () => clearTimeout(timer);
  }, [grid, checkCircuitCompletion]);

  const memoizedGrid = useMemo(() => (
    grid.map((row, rIndex) => (
        <motion.div key={`row-${rIndex}`} className="flex items-center" variants={cellVariants as Variants}>
            {row.map((cell, cIndex) => {
                 const isPowered = poweredCells.has(`${rIndex},${cIndex}`);
                 return (
                    <motion.div 
                        key={cell.id} 
                        layout 
                        transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                        className="w-20 h-20 m-1 bg-slate-700 rounded flex items-center justify-center box-border overflow-hidden shadow-inner"
                    >
                       <CellRenderer cell={cell} isPowered={isPowered} />
                    </motion.div>
                );
            })}
            <AnimatePresence>
                {!isComplete && (
                    <motion.div 
                        className="flex flex-col ml-2"
                        variants={rowControlsVariants as Variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <button className="flex items-center justify-center w-9 h-9 m-0.5 rounded bg-sky-900 text-rose-400 font-black text-xl transition-colors hover:bg-sky-800 active:bg-sky-700" onClick={() => handleRowShift(rIndex, 'left')}>‹</button>
                        <button className="flex items-center justify-center w-9 h-9 m-0.5 rounded bg-sky-900 text-rose-400 font-black text-xl transition-colors hover:bg-sky-800 active:bg-sky-700" onClick={() => handleRowShift(rIndex, 'right')}>›</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    ))
  ), [grid, poweredCells, handleRowShift, isComplete, rowControlsVariants]);

  return (
    <ErrorBoundary FallbackComponent={GameboardErrorFallback}>
      <motion.div 
        className="flex flex-col items-center justify-center font-sans bg-slate-900 p-8 rounded-2xl relative shadow-2xl"
        variants={boardVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center">
          <AnimatePresence>
            {!isComplete && (
              <motion.div 
                className="flex ml-[-48px]"
                variants={colControlsVariants as Variants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                  {Array.from({ length: GRID_SIZE }).map((_, cIndex) => (
                      <div key={`col-control-${cIndex}`} className="flex flex-col w-22 items-center mb-2">
                          <button className="flex items-center justify-center w-9 h-9 m-0.5 rounded bg-sky-900 text-rose-400 font-black text-xl transition-colors hover:bg-sky-800 active:bg-sky-700" onClick={() => handleColShift(cIndex, 'up')}>˄</button>
                          <button className="flex items-center justify-center w-9 h-9 m-0.5 rounded bg-sky-900 text-rose-400 font-black text-xl transition-colors hover:bg-sky-800 active:bg-sky-700" onClick={() => handleColShift(cIndex, 'down')}>˅</button>
                      </div>
                  ))}
              </motion.div>
            )}
           </AnimatePresence>
          <motion.div className="flex flex-col border-2 border-slate-600 rounded-lg p-2 bg-slate-800 shadow-lg">{memoizedGrid}</motion.div>
        </div>
        <AnimatePresence>
            {isComplete && <WinOverlay onReset={handleReset} />}
        </AnimatePresence>
      </motion.div>
    </ErrorBoundary>
  );
};

export default Gameboard;