import React, { useState, JSX, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {object} QuantumGate
 * @property {string} id - A unique identifier for the gate.
 * @property {string} name - The full name of the quantum gate.
 * @property {string} symbol - The standard symbol for the gate (e.g., 'H', 'X').
 * @property {string} description - A brief explanation of the gate's function.
 * @property {string} color - A representative color for the gate's UI element.
 */
type QuantumGate = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  color: string;
};

// --- CONSTANT DATA ---

/**
 * A hardcoded list of available quantum gates.
 * This constant array serves as the single source of truth for the component,
 * eliminating the need for props.
 * @const {QuantumGate[]} QUANTUM_GATES
 */
const QUANTUM_GATES: readonly QuantumGate[] = [
  {
    id: 'hadamard',
    name: 'Hadamard Gate',
    symbol: 'H',
    description: 'Creates a superposition of |0⟩ and |1⟩ states from a basis state.',
    color: '#3498db',
  },
  {
    id: 'pauli-x',
    name: 'Pauli-X Gate',
    symbol: 'X',
    description: 'Performs a bit-flip (equivalent to a classical NOT gate).',
    color: '#e74c3c',
  },
  {
    id: 'pauli-y',
    name: 'Pauli-Y Gate',
    symbol: 'Y',
    description: 'Performs a bit-flip and phase-flip combined.',
    color: '#f1c40f',
  },
  {
    id: 'pauli-z',
    name: 'Pauli-Z Gate',
    symbol: 'Z',
    description: 'Performs a phase-flip of the |1⟩ state.',
    color: '#9b59b6',
  },
  {
    id: 'cnot',
    name: 'CNOT Gate',
    symbol: 'CX',
    description: 'Controlled-NOT: flips the target qubit if the control qubit is |1⟩.',
    color: '#2ecc71',
  },
  {
    id: 'phase',
    name: 'Phase Gate (S)',
    symbol: 'S',
    description: 'Applies a phase of i to the |1⟩ state. It is a sqrt(Z) gate.',
    color: '#e67e22',
  },
  {
    id: 't-gate',
    name: 'T Gate',
    symbol: 'T',
    description: 'Applies a π/4 phase. It is a sqrt(S) gate.',
    color: '#1abc9c',
  },
];

// --- ANIMATION VARIANTS ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.15,
    },
  },
};

const titleVariants: Variants = {
  hidden: { y: -30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const gateGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const gateItemVariants: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.8 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  selected: {
    scale: 1.15,
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

const detailsPanelVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeInOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeInOut' } },
};

// --- CORE COMPONENT ---

/**
 * GateSelector displays a palette of quantum gates for selection.
 * It manages its own state and uses a hardcoded constant for the gate data,
 * requiring no props from parent components.
 *
 * @component
 * @returns {JSX.Element} The rendered GateSelector component.
 */
const GateSelector = (): JSX.Element => {
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);

  /**
   * Handles the selection of a quantum gate.
   * Memoized to prevent unnecessary re-renders of child components.
   * @param {string} gateId - The ID of the gate to select.
   */
  const handleGateSelect = useCallback((gateId: string): void => {
    setSelectedGateId(prevId => (prevId === gateId ? null : gateId));
  }, []);

  const selectedGate = QUANTUM_GATES.find(gate => gate.id === selectedGateId);

  return (
    <motion.div
      className="flex flex-col font-sans bg-[#1e1e2f] text-[#e0e0e0] p-8 rounded-xl w-full max-w-[700px] my-8 mx-auto shadow-2xl shadow-black/30 border border-[#333652]"
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-[1.75rem] font-bold mb-6 text-white text-center border-b border-[#333652] pb-4"
        variants={titleVariants as Variants}
      >
        Quantum Gate Palette
      </motion.h2>

      <motion.div
        className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 mb-8"
        variants={gateGridVariants as Variants}
      >
        {QUANTUM_GATES.map(gate => (
          <motion.div
            key={gate.id}
            role="button"
            aria-pressed={selectedGateId === gate.id}
            tabIndex={0}
            onClick={() => handleGateSelect(gate.id)}
            onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && handleGateSelect(gate.id)}
            className={`flex justify-center items-center w-20 h-20 cursor-pointer rounded-lg text-4xl font-bold select-none border-2
              bg-[${gate.color}]
              ${selectedGateId === gate.id ? `border-[${gate.color}]` : 'border-transparent'}`}
            variants={gateItemVariants as Variants}
            animate={selectedGateId === gate.id ? 'selected' : 'visible'}
            whileHover={{ scale: 1.1, zIndex: 1, boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            {gate.symbol}
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedGate ? selectedGate.id : 'empty'}
          className="bg-[#282a36] p-6 rounded-lg min-h-[120px] border-l-[5px] flex flex-col justify-center overflow-hidden"
          style={{ borderColor: selectedGate ? selectedGate.color : '#44475a' }}
          variants={detailsPanelVariants as Variants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {selectedGate ? (
            <>
              <h3 className={`text-2xl font-bold mb-2 text-[${selectedGate.color}]`}>
                {selectedGate.name} ({selectedGate.symbol})
              </h3>
              <p className="text-base leading-relaxed text-[#c0c0c0]">{selectedGate.description}</p>
            </>
          ) : (
            <p className="text-center text-zinc-500 italic">Select a gate to see its description.</p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// --- ERROR BOUNDARY WRAPPER ---

/**
 * A simple fallback component to be rendered if an error occurs within GateSelector.
 * @returns {JSX.Element} The error fallback UI.
 */
const ErrorFallback = (): JSX.Element => (
  <div className="flex justify-center items-center bg-red-500 text-white p-8 rounded-lg font-sans text-lg">
    <p>Error: The Quantum Gate Selector failed to load. Please try refreshing the page.</p>
  </div>
);

/**
 * A wrapper component that provides a safety net for the GateSelector.
 * It uses React's ErrorBoundary to catch and handle any runtime errors gracefully,
 * preventing the entire application from crashing.
 * This is the component that should be imported and used in the application.
 *
 * @component
 * @returns {JSX.Element} The GateSelector component wrapped in an ErrorBoundary.
 */
const GateSelectorWithErrorBoundary = (): JSX.Element => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <GateSelector />
  </ErrorBoundary>
);

export default GateSelectorWithErrorBoundary;