import React, { useState, useReducer, useMemo, useCallback, JSX } from 'react';
import { motion, AnimatePresence, useDragControls, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

//=============================================================================
// 1. CONSTANTS & CONFIGURATION
//=============================================================================

/**
 * Defines the dimensions and layout of the 3D quantum circuit grid.
 * All values are unitless and used for CSS calculations.
 */
const GRID_CONFIG = {
    /** Number of horizontal staves (qubits). */
    staves: 4,
    /** Number of vertical time slices (discrete time steps). */
    timeSlices: 12,
    /** Spacing between staves. */
    staveSpacing: 80,
    /** Spacing between time slices. */
    timeSliceSpacing: 100,
    /** Depth of the 3D scene. */
    depth: 1000,
    /** Size of a gate block. */
    gateSize: 40,
    /** Thickness of the stave lines. */
    staveThickness: 2,
};

/**
 * Defines the available quantum gates for the palette.
 * Each gate has a unique symbol, a descriptive name, and a color for visualization.
 */
const GATE_PALETTE_DATA = [
    { symbol: 'H', name: 'Hadamard', color: '#3b82f6' },
    { symbol: 'X', name: 'Pauli-X', color: '#ef4444' },
    { symbol: 'Y', name: 'Pauli-Y', color: '#22c55e' },
    { symbol: 'Z', name: 'Pauli-Z', color: '#eab308' },
    { symbol: 'T', name: 'T Gate', color: '#8b5cf6' },
    { symbol: 'CX', name: 'CNOT', color: '#ec4899', isControl: true },
];

/**
 * Initial rotation values for the 3D view.
 */
const INITIAL_VIEW_ROTATION = {
    x: -25,
    y: 35,
};

/**
 * Configuration for animations used throughout the component.
 */
const ANIMATION_CONFIG = {
    coherenceGlow: {
        animate: (i: number) => ({
            opacity: [0, 0.7, 0],
        }),
        transition: (i: number) => ({
            duration: 4,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: i * 0.2, // Stagger animations for a more dynamic effect
        }),
    },
};

/**
 * Defines Framer Motion variants for component animations.
 */
const ANIMATION_VARIANTS = {
    paletteContainer: {
        initial: { opacity: 0, y: -30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.07,
                delayChildren: 0.2,
                ease: "easeOut",
                duration: 0.3
            }
        },
    },
    paletteItem: {
        initial: { opacity: 0, y: -15, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
    },
    sceneContainer: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.04,
                duration: 0.5,
                ease: "easeOut"
            },
        },
    },
    staveLine: {
        hidden: { scaleX: 0 },
        visible: {
            scaleX: 1,
            transition: { duration: 0.7, ease: "circOut" },
        },
    },
    gridCell: {
        hover: {
            scale: 1.15,
            backgroundColor: 'rgba(55, 65, 81, 0.5)', // Corresponds to hover:bg-neutral-800/50
            transition: { type: 'spring', stiffness: 400, damping: 10 },
        },
    },
    gate: {
        initial: { scale: 0.5, opacity: 0, rotateY: -90 },
        animate: {
            scale: 1,
            opacity: 1,
            rotateY: 0,
            transition: { type: 'spring', stiffness: 350, damping: 25 },
        },
        exit: {
            scale: 0.5,
            opacity: 0,
            rotateY: 90,
            transition: { type: 'spring', stiffness: 300, damping: 30 },
        },
    },
};

//=============================================================================
// 2. TYPES
//=============================================================================

/**
 * Represents the type definition of a single quantum gate.
 */
type GateType = (typeof GATE_PALETTE_DATA)[number];

/**
 * Represents a position on the circuit grid.
 * @property {number} stave - The horizontal stave index (0-based).
 * @property {number} timeSlice - The vertical time slice index (0-based).
 */
type GridPosition = {
    stave: number;
    timeSlice: number;
};

/**
 * Represents an instance of a gate placed on the circuit grid.
 * @property {string} id - A unique identifier for the gate instance.
 * @property {string} symbol - The symbol of the gate (e.g., 'H', 'X').
 * @property {GridPosition} position - The position of the gate on the grid.
 */
type GateInstance = {
    id: string;
    symbol: GateType['symbol'];
    position: GridPosition;
};

/**
 * Represents the state of the entire quantum circuit.
 * @property {Map<string, GateInstance>} gates - A map of placed gates, keyed by "stave-timeSlice".
 */
type CircuitState = {
    gates: Map<string, GateInstance>;
};

/**
 * Represents the actions that can be dispatched to modify the circuit state.
 */
type CircuitAction =
    | { type: 'ADD_GATE'; payload: { symbol: GateType['symbol']; position: GridPosition } }
    | { type: 'REMOVE_GATE'; payload: { position: GridPosition } }
    | { type: 'RESET_CIRCUIT' };

//=============================================================================
// 3. STATE MANAGEMENT (Reducer)
//=============================================================================

/**
 * Creates a unique string key for a given grid position.
 * @param {GridPosition} position - The position on the grid.
 * @returns {string} A unique key string.
 */
const positionToKey = ({ stave, timeSlice }: GridPosition): string => `${stave}-${timeSlice}`;

/**
 * The initial state for the quantum circuit.
 * @type {CircuitState}
 */
const INITIAL_CIRCUIT_STATE: CircuitState = {
    gates: new Map(),
};

/**
 * Reducer function to manage the state of the quantum circuit.
 * @param {CircuitState} state - The current state.
 * @param {CircuitAction} action - The action to perform.
 * @returns {CircuitState} The new state.
 */
const circuitReducer = (state: CircuitState, action: CircuitAction): CircuitState => {
    const newState = { ...state, gates: new Map(state.gates) };
    switch (action.type) {
        case 'ADD_GATE': {
            const key = positionToKey(action.payload.position);
            const newGate: GateInstance = {
                id: `${action.payload.symbol}-${key}-${Date.now()}`,
                symbol: action.payload.symbol,
                position: action.payload.position,
            };
            newState.gates.set(key, newGate);
            return newState;
        }
        case 'REMOVE_GATE': {
            const key = positionToKey(action.payload.position);
            newState.gates.delete(key);
            return newState;
        }
        case 'RESET_CIRCUIT':
            return INITIAL_CIRCUIT_STATE;
        default:
            return state;
    }
};

//=============================================================================
// 4. HELPER & VISUAL COMPONENTS
//=============================================================================

/**
 * Renders the palette for selecting a quantum gate.
 * @param {{
 *  selectedSymbol: GateType['symbol'] | null;
 *  onSelect: (symbol: GateType['symbol']) => void;
 *  onReset: () => void;
 * }} props - Component props.
 * @returns {JSX.Element} The rendered gate palette.
 */
const GatePalette = React.memo(({ selectedSymbol, onSelect, onReset }: {
    selectedSymbol: GateType['symbol'] | null;
    onSelect: (symbol: GateType['symbol']) => void;
    onReset: () => void;
}): JSX.Element => (
    <motion.div
        variants={ANIMATION_VARIANTS.paletteContainer as Variants}
        initial="initial"
        animate="animate"
        className="mb-8 flex w-[clamp(300px,80%,800px)] flex-col items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4 shadow-lg shadow-black/50"
    >
        <h3 className="m-0 text-lg text-neutral-400">Quantum Gate Palette</h3>
        <div className="flex flex-wrap justify-center gap-3">
            {GATE_PALETTE_DATA.map((gate) => (
                <motion.button
                    key={gate.symbol}
                    variants={ANIMATION_VARIANTS.paletteItem as Variants}
                    onClick={() => onSelect(gate.symbol)}
                    className={`h-[50px] w-[50px] cursor-pointer rounded-lg border-none text-xl font-bold text-white focus:outline-none ${
                        selectedSymbol === gate.symbol ? 'ring-3 ring-offset-2 ring-offset-neutral-900' : ''
                    }`}
                    whileHover={{ scale: 1.1, boxShadow: `0px 0px 12px ${gate.color}` }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    style={{
                        backgroundColor: gate.color,
                        '--tw-ring-color': gate.color,
                    }}
                    title={gate.name}
                >
                    {gate.symbol}
                </motion.button>
            ))}
        </div>
        <motion.button
            variants={ANIMATION_VARIANTS.paletteItem as Variants}
            onClick={onReset}
            className="cursor-pointer rounded-md border border-red-500 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400"
            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'rgb(252, 165, 165)', scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Reset Circuit
        </motion.button>
    </motion.div>
));
GatePalette.displayName = 'GatePalette';


/**
 * Renders a single placed quantum gate on the grid.
 * @param {{ gate: GateInstance }} props - Component props.
 * @returns {JSX.Element} The rendered quantum gate.
 */
const QuantumGate = React.memo(({ gate }: { gate: GateInstance }): JSX.Element => {
    const gateType = GATE_PALETTE_DATA.find(g => g.symbol === gate.symbol);
    if (!gateType) return <></>;

    return (
        <motion.div
            layoutId={`gate-${gate.id}`}
            className="flex h-full w-full select-none items-center justify-center rounded-lg text-lg font-bold text-white"
            style={{
                width: GRID_CONFIG.gateSize,
                height: GRID_CONFIG.gateSize,
                backgroundColor: gateType.color,
                boxShadow: `0 0 20px 5px ${gateType.color}55`,
                transformStyle: 'preserve-3d',
            }}
            variants={ANIMATION_VARIANTS.gate as Variants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {gate.symbol}
        </motion.div>
    );
});
QuantumGate.displayName = 'QuantumGate';


/**
 * Renders the glowing path representing coherence between gates on a stave.
 * @param {{
 *  gatesOnStave: GateInstance[];
 *  staveIndex: number;
 * }} props - Component props.
 * @returns {JSX.Element} The rendered coherence path.
 */
const CoherencePath = React.memo(({ gatesOnStave, staveIndex }: {
    gatesOnStave: GateInstance[];
    staveIndex: number;
}): JSX.Element => {
    if (gatesOnStave.length < 2) return <></>;

    return (
        <>
            {gatesOnStave.slice(0, -1).map((gate, i) => {
                const nextGate = gatesOnStave[i + 1];
                const startX = gate.position.timeSlice * GRID_CONFIG.timeSliceSpacing + GRID_CONFIG.gateSize / 2;
                const endX = nextGate.position.timeSlice * GRID_CONFIG.timeSliceSpacing + GRID_CONFIG.gateSize / 2;
                const gateType = GATE_PALETTE_DATA.find(g => g.symbol === gate.symbol);
                const color = gateType?.color || '#ffffff';
                const width = endX - startX;

                return (
                    <motion.div
                        key={`path-${gate.id}-${nextGate.id}`}
                        className="absolute top-1/2 -translate-y-1/2 rounded-full blur-lg"
                        style={{
                            left: startX,
                            width: width,
                            height: GRID_CONFIG.gateSize * 1.5,
                            backgroundImage: `linear-gradient(to right, ${color}33, ${color}aa, ${color}33)`,
                        }}
                        custom={i}
                        animate={ANIMATION_CONFIG.coherenceGlow.animate}
                        transition={ANIMATION_CONFIG.coherenceGlow.transition(i)}
                    />
                );
            })}
        </>
    );
});
CoherencePath.displayName = 'CoherencePath';

//=============================================================================
// 5. MAIN COMPONENT: CircuitBuilder3D
//=============================================================================

/**
 * A complex interactive 3D component for building quantum circuits.
 * It renders a 3D grid where quantum gates can be placed and visualizes
 * real-time coherence decay as a fading glow along circuit pathways.
 * @returns {JSX.Element} The rendered 3D circuit builder component.
 */
const CircuitBuilder3D = (): JSX.Element => {
    const [circuitState, dispatch] = useReducer(circuitReducer, INITIAL_CIRCUIT_STATE);
    const [selectedGateSymbol, setSelectedGateSymbol] = useState<GateType['symbol'] | null>('H');
    const [rotation, setRotation] = useState(INITIAL_VIEW_ROTATION);
    const dragControls = useDragControls();

    const handleCellClick = useCallback((position: GridPosition) => {
        const key = positionToKey(position);
        if (circuitState.gates.has(key)) {
            dispatch({ type: 'REMOVE_GATE', payload: { position } });
        } else if (selectedGateSymbol) {
            dispatch({ type: 'ADD_GATE', payload: { symbol: selectedGateSymbol, position } });
        }
    }, [selectedGateSymbol, circuitState.gates]);

    const handleReset = useCallback(() => {
        dispatch({ type: 'RESET_CIRCUIT' });
    }, []);

    const gatesByStave = useMemo(() => {
        const byStave: GateInstance[][] = Array.from({ length: GRID_CONFIG.staves }, () => []);
        for (const gate of circuitState.gates.values()) {
            byStave[gate.position.stave]?.push(gate);
        }
        // Sort gates on each stave by time slice for correct path rendering
        byStave.forEach(stave => stave.sort((a, b) => a.position.timeSlice - b.position.timeSlice));
        return byStave;
    }, [circuitState.gates]);
    
    const onPan = (_event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
        setRotation(prev => ({
            x: prev.x - info.delta.y * 0.2,
            y: prev.y + info.delta.x * 0.2,
        }));
    };

    const sceneWidth = GRID_CONFIG.timeSlices * GRID_CONFIG.timeSliceSpacing;
    const sceneHeight = GRID_CONFIG.staves * GRID_CONFIG.staveSpacing;

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 font-mono text-neutral-200">
            <GatePalette
                selectedSymbol={selectedGateSymbol}
                onSelect={setSelectedGateSymbol}
                onReset={handleReset}
            />
            <motion.div
                className="flex h-4/5 w-full cursor-grab items-center justify-center active:cursor-grabbing"
                onPan={onPan}
                onPanStart={(event) => dragControls.start(event)}
            >
                <div className="flex h-full w-full items-center justify-center" style={{ perspective: GRID_CONFIG.depth }}>
                    <motion.div
                        className="relative"
                        variants={ANIMATION_VARIANTS.sceneContainer as Variants}
                        initial="hidden"
                        animate={{
                            rotateX: rotation.x,
                            rotateY: rotation.y,
                        }}
                        whileInView="visible"
                        viewport={{ once: true }}
                        style={{
                            width: sceneWidth,
                            height: sceneHeight,
                            transformStyle: 'preserve-3d'
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {/* Render Staves and Coherence Paths */}
                        {Array.from({ length: GRID_CONFIG.staves }).map((_, staveIndex) => (
                            <div
                                key={`stave-group-${staveIndex}`}
                                className="absolute flex w-full items-center"
                                style={{
                                    top: staveIndex * GRID_CONFIG.staveSpacing,
                                    height: GRID_CONFIG.gateSize,
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                <motion.div
                                    className="absolute w-full origin-left bg-neutral-700"
                                    variants={ANIMATION_VARIANTS.staveLine as Variants}
                                    style={{
                                        height: GRID_CONFIG.staveThickness,
                                        transform: `translateZ(-${GRID_CONFIG.gateSize / 2}px)`
                                    }}
                                />
                                <CoherencePath
                                    gatesOnStave={gatesByStave[staveIndex] || []}
                                    staveIndex={staveIndex}
                                />
                            </div>
                        ))}

                        {/* Render Grid Cells and Gates */}
                        {Array.from({ length: GRID_CONFIG.staves }).map((_, staveIndex) =>
                            Array.from({ length: GRID_CONFIG.timeSlices }).map((_, timeSliceIndex) => {
                                const position = { stave: staveIndex, timeSlice: timeSliceIndex };
                                const key = positionToKey(position);
                                const gate = circuitState.gates.get(key);

                                return (
                                    <motion.div
                                        key={key}
                                        className="absolute flex cursor-pointer items-center justify-center rounded-full"
                                        variants={ANIMATION_VARIANTS.gridCell as Variants}
                                        whileHover="hover"
                                        style={{
                                            left: timeSliceIndex * GRID_CONFIG.timeSliceSpacing,
                                            top: staveIndex * GRID_CONFIG.staveSpacing,
                                            width: GRID_CONFIG.gateSize,
                                            height: GRID_CONFIG.gateSize,
                                            transformStyle: 'preserve-3d',
                                        }}
                                        onClick={() => handleCellClick(position)}
                                    >
                                        <AnimatePresence>
                                            {gate && <QuantumGate gate={gate} />}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

//=============================================================================
// 6. STYLES (REMOVED)
//=============================================================================

// The styles object has been removed and its properties have been
// translated into Tailwind CSS classes and inline styles where necessary.

//=============================================================================
// 7. DEFAULT EXPORT WITH ERROR BOUNDARY
//=============================================================================

/**
 * A fallback component to display when an error occurs within the CircuitBuilder3D.
 * @returns {JSX.Element} The rendered error message.
 */
const ErrorFallback = (): JSX.Element => (
    <div className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 font-mono text-neutral-200">
        <div className="rounded-lg bg-neutral-800 p-8 text-center">
            <h2 className="text-xl font-bold text-red-500">Circuit Overload!</h2>
            <p className="mt-2 text-neutral-300">Something went wrong while rendering the quantum circuit.</p>
            <p className="mt-2 text-neutral-300">Please refresh the page to try again.</p>
        </div>
    </div>
);

/**
 * The main exportable component, wrapping the CircuitBuilder3D in a React Error Boundary
 * to ensure application stability in case of rendering errors.
 * @returns {JSX.Element} The CircuitBuilder3D component with an error boundary.
 */
const CircuitBuilder3DWithErrorBoundary = (): JSX.Element => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <CircuitBuilder3D />
    </ErrorBoundary>
);

export default CircuitBuilder3DWithErrorBoundary;