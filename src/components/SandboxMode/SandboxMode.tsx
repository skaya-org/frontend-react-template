import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  JSX,
  ReactNode,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';
import Gameboard from '../Gameboard/Gameboard';

// --- ANIMATION VARIANTS ---

const panelVariants: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const mainContentVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const errorFallbackVariants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// --- CONSTANTS & TYPES ---

/**
 * @typedef {object} PuzzlePiece
 * @property {string} id - A unique identifier for the puzzle piece.
 * @property {string} name - The display name of the puzzle piece.
 * @property {string} icon - A visual representation (e.g., emoji or character) for the piece.
 */
type PuzzlePiece = {
  id: string;
  name: string;
  icon: string;
};

/**
 * @typedef {object} SandboxContextType
 * @property {PuzzlePiece | null} selectedPiece - The currently selected puzzle piece for placement.
 * @property {(piece: PuzzlePiece) => void} selectPiece - Function to update the selected piece.
 */
type SandboxContextType = {
  selectedPiece: PuzzlePiece | null;
  selectPiece: (piece: PuzzlePiece) => void;
};

/**
 * A constant array of available puzzle pieces for the sandbox mode.
 * This data is self-contained and does not require props.
 * @const {PuzzlePiece[]} PUZZLE_PIECES
 */
const PUZZLE_PIECES: readonly PuzzlePiece[] = [
  { id: 'wire', name: 'Wire', icon: '─' },
  { id: 'bend', name: 'Bend', icon: '└' },
  { id: 't-junction', name: 'T-Junction', icon: '┴' },
  { id: 'cross', name: 'Cross', icon: '┼' },
  { id: 'power', name: 'Power Source', icon: '💡' },
  { id: 'lamp', name: 'Lamp', icon: '램' },
];

// --- CONTEXT ---

/**
 * Context for the Sandbox mode.
 * It provides the state of the selected puzzle piece to child components,
 * like the Gameboard, without prop drilling.
 * This allows Gameboard to know which piece to place on user interaction.
 * @type {React.Context<SandboxContextType | undefined>}
 */
const SandboxContext = createContext<SandboxContextType | undefined>(undefined);

/**
 * Custom hook to access the SandboxContext.
 * Provides a typed and safe way to consume the context.
 * @throws {Error} If used outside of a SandboxProvider.
 * @returns {SandboxContextType} The context value.
 */
export const useSandbox = (): SandboxContextType => {
  const context = useContext(SandboxContext);
  if (!context) {
    throw new Error('useSandbox must be used within a SandboxProvider');
  }
  return context;
};

// --- HELPER COMPONENTS ---

/**
 * A fallback component to display when the Gameboard encounters an error.
 * @returns {JSX.Element} A simple error message UI.
 */
const GameboardErrorFallback = (): JSX.Element => (
  <motion.div
    className="p-10 bg-red-950/50 border border-red-800 rounded-lg text-center text-red-200"
    variants={errorFallbackVariants as Variants}
    initial="initial"
    animate="animate"
  >
    <h2 className="text-xl font-bold mb-2">
      Something went wrong with the Gameboard.
    </h2>
    <p>Please try refreshing the page. The circuit could not be loaded.</p>
  </motion.div>
);

/**
 * A memoized control panel containing puzzle piece selectors and action buttons.
 * @param {object} props - The component props.
 * @param {PuzzlePiece | null} props.selectedPiece - The currently selected piece.
 * @param {(piece: PuzzlePiece) => void} props.onSelectPiece - Callback to select a piece.
 * @param {() => void} props.onSave - Callback for the save action.
 * @param {() => void} props.onLoad - Callback for the load action.
 * @param {() => void} props.onShare - Callback for the share action.
 * @returns {JSX.Element} The UI for the control panel.
 */
const ControlPanel = React.memo(
  ({
    selectedPiece,
    onSelectPiece,
    onSave,
    onLoad,
    onShare,
  }: {
    selectedPiece: PuzzlePiece | null;
    onSelectPiece: (piece: PuzzlePiece) => void;
    onSave: () => void;
    onLoad: () => void;
    onShare: () => void;
  }): JSX.Element => (
    <motion.aside
      className="w-72 bg-zinc-800 p-5 flex flex-col border-r border-zinc-700 overflow-y-auto"
      variants={panelVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-lg text-zinc-300 mb-4 border-b border-zinc-600 pb-2.5"
        variants={itemVariants as Variants}
      >
        Circuit Pieces
      </motion.h2>
      <motion.div
        className="grid grid-cols-2 gap-2.5 mb-5"
        variants={itemVariants as Variants} // This container also staggers in
      >
        {PUZZLE_PIECES.map(piece => {
          const isSelected = selectedPiece?.id === piece.id;
          return (
            <motion.button
              key={piece.id}
              onClick={() => onSelectPiece(piece)}
              className={`flex flex-col items-center justify-center p-2.5 border-2 rounded-lg cursor-pointer text-zinc-100 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-800
                ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400'
                    : 'bg-zinc-700 border-zinc-500 hover:bg-zinc-600 hover:border-zinc-400'
                }`}
              aria-pressed={isSelected}
              title={`Select ${piece.name}`}
              variants={itemVariants as Variants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: isSelected ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <span className="text-3xl leading-none">{piece.icon}</span>
              <span className="mt-1.5 text-xs">{piece.name}</span>
            </motion.button>
          );
        })}
      </motion.div>
      <motion.div
        className="border-b border-zinc-600 my-5"
        variants={itemVariants as Variants}
      />
      <motion.h2
        className="text-lg text-zinc-300 mb-4 border-b border-zinc-600 pb-2.5"
        variants={itemVariants as Variants}
      >
        Actions
      </motion.h2>
      <motion.div
        className="flex flex-col gap-2.5"
        variants={itemVariants as Variants}
      >
        <motion.button
          className="p-3 text-base bg-blue-600 text-white rounded-md cursor-pointer transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-800"
          onClick={onSave}
          variants={itemVariants as Variants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Save
        </motion.button>
        <motion.button
          className="p-3 text-base bg-blue-600 text-white rounded-md cursor-pointer transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-800"
          onClick={onLoad}
          variants={itemVariants as Variants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Load
        </motion.button>
        <motion.button
          className="p-3 text-base bg-blue-600 text-white rounded-md cursor-pointer transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-800"
          onClick={onShare}
          variants={itemVariants as Variants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Share
        </motion.button>
      </motion.div>
    </motion.aside>
  ),
);

// --- MAIN COMPONENT ---

/**
 * SandboxMode provides a creative environment for players to design, build,
 * and test their own electrical circuits. It features a control panel for
 * selecting components and a main gameboard area for construction.
 * The component manages its own state and provides it to children
 * via React Context, adhering to the no-props design principle for child components.
 *
 * @returns {JSX.Element} The fully functional SandboxMode screen.
 */
const SandboxMode = (): JSX.Element => {
  /**
   * State to keep track of the currently selected puzzle piece from the panel.
   * @type {[PuzzlePiece | null, React.Dispatch<React.SetStateAction<PuzzlePiece | null>>]}
   */
  const [selectedPiece, setSelectedPiece] = useState<PuzzlePiece | null>(null);

  /**
   * Handles the selection of a new puzzle piece.
   * Memoized to prevent unnecessary re-renders of the control panel.
   * @type {(piece: PuzzlePiece) => void}
   */
  const handleSelectPiece = useCallback((piece: PuzzlePiece) => {
    setSelectedPiece(prev => (prev?.id === piece.id ? null : piece));
  }, []);

  /**
   * Placeholder function for the 'Save' action.
   * In a real application, this would serialize the board state and save it.
   * @type {() => void}
   */
  const handleSave = useCallback(() => {
    console.log('--- SAVE ACTION TRIGGERED ---');
    // In a real implementation:
    // 1. Get circuit data from Gameboard (e.g., via a context function).
    // 2. Serialize data to JSON.
    // 3. Save to localStorage, a database, or a file.
    alert('Circuit saved to console!');
  }, []);

  /**
   * Placeholder function for the 'Load' action.
   * In a real application, this would load a previously saved circuit.
   * @type {() => void}
   */
  const handleLoad = useCallback(() => {
    console.log('--- LOAD ACTION TRIGGERED ---');
    // In a real implementation:
    // 1. Open a file picker or a modal with saved circuits.
    // 2. Load and parse the circuit data.
    // 3. Update the Gameboard state (e.g., via a context function).
    alert('Load functionality is not implemented.');
  }, []);

  /**
   * Placeholder function for the 'Share' action.
   * In a real application, this would generate a shareable link or data string.
   * @type {() => void}
   */
  const handleShare = useCallback(() => {
    console.log('--- SHARE ACTION TRIGGERED ---');
    // In a real implementation:
    // 1. Serialize the current circuit data into a compact string.
    // 2. Encode it in a URL parameter.
    // 3. Copy the URL to the clipboard.
    alert('Share functionality is not implemented.');
  }, []);

  const contextValue: SandboxContextType = {
    selectedPiece,
    selectPiece: handleSelectPiece,
  };

  return (
    <SandboxContext.Provider value={contextValue}>
      <div className="flex flex-row h-screen w-full bg-zinc-900 text-zinc-100 font-sans">
        <ControlPanel
          selectedPiece={selectedPiece}
          onSelectPiece={handleSelectPiece}
          onSave={handleSave}
          onLoad={handleLoad}
          onShare={handleShare}
        />
        <motion.main
          className="flex-1 flex items-center justify-center p-5 overflow-hidden"
          variants={mainContentVariants as Variants}
          initial="hidden"
          animate="visible"
        >
          <ErrorBoundary FallbackComponent={GameboardErrorFallback}>
            <Gameboard />
          </ErrorBoundary>
        </motion.main>
      </div>
    </SandboxContext.Provider>
  );
};

export default SandboxMode;