import React, { useState, useEffect, useMemo, JSX } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, animate, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// #region TYPES AND CONSTANTS

/**
 * @type {Vector3D}
 * @description Represents a point in 3D space.
 */
type Vector3D = {
  x: number;
  y: number;
  z: number;
};

/**
 * @type {QubitData}
 * @description Defines the properties of a single qubit.
 * @property {string} id - A unique identifier for the qubit.
 * @property {Vector3D} position - The initial position of the qubit in the 3D scene.
 */
type QubitData = {
  id: string;
  position: Vector3D;
};

/**
 * @type {EntanglementData}
 * @description Defines an entanglement link between two qubits.
 * @property {string} id - A unique identifier for the entanglement.
 * @property {[string, string]} qubitIds - The IDs of the two qubits that are entangled.
 */
type EntanglementData = {
  id: string;
  qubitIds: [string, string];
};

/**
 * @type {QuantumSceneData}
 * @description Contains all the static data required to build the quantum visualization.
 * @property {QubitData[]} qubits - An array of qubit definitions.
 * @property {EntanglementData[]} entanglements - An array of entanglement definitions.
 */
type QuantumSceneData = {
  qubits: QubitData[];
  entanglements: EntanglementData[];
};

/**
 * @const {QuantumSceneData} QUANTUM_SCENE_DATA
 * @description Constant data defining the layout and elements of the quantum visualizer.
 * This self-contained data structure prevents the component from needing any props.
 */
const QUANTUM_SCENE_DATA: QuantumSceneData = {
  qubits: [
    { id: 'q1', position: { x: -150, y: -100, z: 50 } },
    { id: 'q2', position: { x: 150, y: -100, z: -50 } },
    { id: 'q3', position: { x: 0, y: 150, z: 0 } },
    { id: 'q4', position: { x: -50, y: -50, z: -150 } },
    { id: 'q5', position: { x: 100, y: 50, z: 150 } },
  ],
  entanglements: [
    { id: 'e1', qubitIds: ['q1', 'q3'] },
    { id: 'e2', qubitIds: ['q2', 'q3'] },
    { id: 'e3', qubitIds: ['q1', 'q4'] },
    { id: 'e4', qubitIds: ['q2', 'q5'] },
  ],
};

/**
 * @enum {string}
 * @description The different visualization states the component can be in.
 */
enum VisualizationState {
  SUPERPOSITION = 'SUPERPOSITION',
  ENTANGLEMENT = 'ENTANGLEMENT',
  ERROR_CORRECTION = 'ERROR_CORRECTION',
  STABLE = 'STABLE',
}

const STATE_CYCLE: VisualizationState[] = [
  VisualizationState.SUPERPOSITION,
  VisualizationState.ENTANGLEMENT,
  VisualizationState.STABLE,
  VisualizationState.ERROR_CORRECTION,
];

const STATE_DURATION_MS = 6000;
const SCENE_ROTATION_DURATION_S = 80;

// #endregion

// #region ANIMATION VARIANTS

const sceneVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1, // Stagger Qubit animations on initial load
    },
  },
};

const qubitVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

const entanglementLineVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.8, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    scaleX: 0,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

const superpositionContainerVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.4, ease: 'easeIn' } },
};


// #endregion

// #region HELPER FUNCTIONS

/**
 * Calculates the distance, midpoint, and rotation for a line connecting two 3D points.
 * @param {Vector3D} p1 - The starting point of the line.
 * @param {Vector3D} p2 - The ending point of the line.
 * @returns {{ length: number; midpoint: Vector3D; rotation: Vector3D }} The calculated properties for the line.
 */
const calculateLineTransform = (p1: Vector3D, p2: Vector3D) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;

  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const midpoint = { x: p1.x + dx / 2, y: p1.y + dy / 2, z: p1.z + dz / 2 };

  // Angle in the XY plane (like CSS rotateZ)
  const rotationZ = (Math.atan2(dy, dx) * 180) / Math.PI;
  // Angle to the Z axis (like CSS rotateY)
  const rotationY = (Math.atan2(Math.sqrt(dx * dx + dy * dy), dz) * 180) / Math.PI - 90;

  return { length, midpoint, rotation: { x: 0, y: rotationY, z: rotationZ } };
};

// #endregion

// #region INTERNAL COMPONENTS

/**
 * Renders a single qubit as a glowing point of light.
 * @param {{ qubit: QubitData }} props - The qubit data.
 * @returns {JSX.Element} A motion div representing the qubit.
 */
const Qubit = ({ qubit }: { qubit: QubitData }): JSX.Element => (
  <motion.div
    variants={qubitVariants as Variants}
    className="absolute h-3 w-3 rounded-full"
    style={{
      background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(150,220,255,0.8) 50%, rgba(100,180,255,0) 70%)',
      boxShadow: '0 0 10px 2px rgba(173, 216, 230, 0.7), 0 0 20px 5px rgba(173, 216, 230, 0.5) inset',
      transform: `translate3d(${qubit.position.x}px, ${qubit.position.y}px, ${qubit.position.z}px)`,
    }}
    whileHover={{ scale: 2.5 }}
    transition={{ type: 'spring', stiffness: 300 }}
  />
);

/**
 * Renders an entanglement link as a glowing line between two qubits.
 * @param {{ entanglement: EntanglementData; qubitMap: Map<string, QubitData> }} props - The entanglement data and a map for quick qubit lookup.
 * @returns {JSX.Element | null} A motion div representing the line, or null if qubits are not found.
 */
const EntanglementLine = ({
  entanglement,
  qubitMap,
}: {
  entanglement: EntanglementData;
  qubitMap: Map<string, QubitData>;
}): JSX.Element | null => {
  const qubit1 = qubitMap.get(entanglement.qubitIds[0]);
  const qubit2 = qubitMap.get(entanglement.qubitIds[1]);

  if (!qubit1 || !qubit2) return null;

  const { length, midpoint, rotation } = calculateLineTransform(qubit1.position, qubit2.position);

  return (
    <motion.div
      variants={entanglementLineVariants as Variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute h-0.5 origin-left"
      style={{
        width: `${length}px`,
        background: 'linear-gradient(90deg, rgba(148,0,211,0) 0%, rgba(148,0,211,0.8) 50%, rgba(148,0,211,0) 100%)',
        boxShadow: '0 0 8px 1px rgba(238, 130, 238, 0.7)',
        transform: `
          translate3d(${midpoint.x - length / 2}px, ${midpoint.y}px, ${midpoint.z}px)
          rotateY(${rotation.y}deg)
          rotateZ(${rotation.z}deg)
        `,
      }}
    />
  );
};

/**
 * Renders the superposition effect as animated waves expanding from a qubit.
 * @param {{ qubit: QubitData }} props - The qubit from which the waves originate.
 * @returns {JSX.Element} A group of motion divs representing the waves.
 */
const SuperpositionWave = ({ qubit }: { qubit: QubitData }): JSX.Element => (
  <motion.div
    className="absolute [transform-style:preserve-3d]"
    variants={superpositionContainerVariants as Variants}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{
      transform: `translate3d(${qubit.position.x}px, ${qubit.position.y}px, ${qubit.position.z}px) rotateX(90deg)`,
    }}
  >
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute h-2.5 w-2.5 origin-center rounded-full border border-white/50"
        initial={{ scale: 0, opacity: 0.7 }}
        animate={{ scale: 30, opacity: 0 }}
        transition={{
          duration: 3,
          ease: 'linear',
          repeat: Infinity,
          delay: i * 1,
        }}
      />
    ))}
  </motion.div>
);

/**
 * Renders the error correction event as a 'black hole' visual effect.
 * @param {{ onComplete: () => void }} props - Callback to run when the animation finishes.
 * @returns {JSX.Element} A motion div representing the black hole.
 */
const BlackHoleEffect = ({ onComplete }: { onComplete: () => void }): JSX.Element => {
  const progress = useSpring(0, { stiffness: 100, damping: 30 });
  const scale = useTransform(progress, [0, 1], [0, 50]);
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const animation = animate(progress, 1, {
      duration: 2.5,
      ease: 'easeInOut',
      onComplete,
    });
    return () => animation.stop();
  }, [progress, onComplete]);

  return (
    <motion.div
      className="absolute h-2.5 w-2.5 rounded-full"
      style={{
        background: 'radial-gradient(circle, #000 0%, #1a001a 50%, rgba(26,0,26,0) 70%)',
        boxShadow: '0 0 40px 20px #1a001a, inset 0 0 20px 10px #000',
        scale,
        opacity,
      }}
    />
  );
};

/**
 * Fallback component for the error boundary.
 * @returns {JSX.Element} A simple error message.
 */
const ErrorFallback = (): JSX.Element => (
    <div className="flex h-full w-full items-center justify-center bg-gray-900 font-mono text-red-500">
        <p>An error occurred in the Quantum Visualizer.</p>
    </div>
);

// #endregion

/**
 * @component QuantumVisualizer
 * @description
 * A self-contained, production-grade component for visualizing quantum phenomena.
 * It operates without any external props, using a predefined constant data set
 * to render a 3D scene. The component cycles through various states to showcase
 * different quantum effects like superposition and entanglement, and includes a
 * visual for error correction events. All logic, data, and state are encapsulated
 * within this single file, following clean code and React best practices.
 *
 * The visualization includes:
 * - **Qubits**: Rendered as glowing star-like points.
 * - **Entanglement**: Shown as glowing lines connecting entangled qubits.
 * - **Superposition**: Visualized as animated, expanding waves.
 * - **Error Correction**: Represented by a dramatic "black hole" effect.
 *
 * @returns {JSX.Element} The rendered QuantumVisualizer component.
 */
const QuantumVisualizer = (): JSX.Element => {
  const [currentState, setCurrentState] = useState<VisualizationState>(STATE_CYCLE[0]);
  const [errorCorrectionKey, setErrorCorrectionKey] = useState(0);

  const qubitMap = useMemo(
    () => new Map(QUANTUM_SCENE_DATA.qubits.map((q) => [q.id, q])),
    []
  );

  useEffect(() => {
    let stateIndex = 0;
    const cycleStates = () => {
      // Don't auto-trigger the error correction state.
      // It will be triggered on its own and then transition away.
      const nextState = STATE_CYCLE[stateIndex % STATE_CYCLE.length];
      if (nextState !== VisualizationState.ERROR_CORRECTION) {
        setCurrentState(nextState);
      }
      stateIndex++;
    };
    
    cycleStates(); // Initial call
    const intervalId = setInterval(cycleStates, STATE_DURATION_MS);

    return () => clearInterval(intervalId);
  }, []);

  const handleBlackHoleComplete = () => {
    // Increment the key to re-mount the component if needed again
    setErrorCorrectionKey(prev => prev + 1);
    // Transition to a stable state after error correction
    setCurrentState(VisualizationState.STABLE);
  };
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div 
        className="flex h-screen w-full min-h-[600px] flex-col items-center justify-center overflow-hidden font-mono text-white"
        style={{ background: 'radial-gradient(circle, #1a1a2a 0%, #0c0c14 100%)' }}
      >
        <div className="absolute top-5 rounded-lg border border-white/20 bg-black/30 px-4 py-2">
          Current State: <span className="font-bold text-sky-300">{currentState}</span>
        </div>
        <div className="h-4/5 w-4/5" style={{ perspective: '1000px' }}>
          <motion.div
            className="relative h-full w-full [transform-style:preserve-3d]"
            variants={sceneVariants as Variants}
            initial="initial"
            animate="animate"
            // This separate animate prop handles the continuous rotation
            // while the variants handle the initial staggered entrance.
            custom={{ rotateY: 360, rotateX: 20 }}
            transition={{
                duration: SCENE_ROTATION_DURATION_S,
                ease: 'linear',
                repeat: Infinity,
            }}
          >
            {/* Render all qubits */}
            {QUANTUM_SCENE_DATA.qubits.map((qubit) => (
              <Qubit key={qubit.id} qubit={qubit} />
            ))}

            <AnimatePresence>
              {/* Render superposition waves */}
              {currentState === VisualizationState.SUPERPOSITION &&
                QUANTUM_SCENE_DATA.qubits.map((qubit) => (
                  <SuperpositionWave key={`sw-${qubit.id}`} qubit={qubit} />
                ))}

              {/* Render entanglement lines */}
              {currentState === VisualizationState.ENTANGLEMENT &&
                QUANTUM_SCENE_DATA.entanglements.map((entanglement) => (
                  <EntanglementLine
                    key={entanglement.id}
                    entanglement={entanglement}
                    qubitMap={qubitMap}
                  />
                ))}

              {/* Render error correction black hole */}
              {currentState === VisualizationState.ERROR_CORRECTION && (
                <BlackHoleEffect
                  key={errorCorrectionKey}
                  onComplete={handleBlackHoleComplete}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default QuantumVisualizer;