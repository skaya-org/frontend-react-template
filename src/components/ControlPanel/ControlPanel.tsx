import React, { useState, useCallback, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {object} ButtonConfig
 * @property {string} id - A unique identifier for the button.
 * @property {string} label - The text displayed on the button.
 */
type ButtonConfig = {
  id: string;
  label: string;
};

/**
 * @typedef {object} SliderConfig
 * @property {string} id - A unique identifier for the slider.
 * @property {string} label - The text label for the slider.
 * @property {number} min - The minimum value of the slider.
 * @property {number} max - The maximum value of the slider.
 * @property {number} step - The increment step of the slider.
 * @property {number} initialValue - The default starting value of the slider.
 */
type SliderConfig = {
  id: 'decoherenceRate'; // Using a literal type for type safety in state
  label: string;
  min: number;
  max: number;
  step: number;
  initialValue: number;
};

/**
 * @typedef {object} SimulationState
 * @property {number} decoherenceRate - The current value for the decoherence rate slider.
 * @property {string | null} lastAction - A message describing the last action taken.
 */
type SimulationState = {
  decoherenceRate: number;
  lastAction: string | null;
};


// --- CONSTANT DATA ---

/**
 * Configuration for the control buttons.
 * This constant data drives the rendering and logic of the buttons.
 * @const {ButtonConfig[]} BUTTON_CONFIGS
 */
const BUTTON_CONFIGS: readonly ButtonConfig[] = [
  { id: 'entangle', label: 'Entangle Qubits' },
  { id: 'superposition', label: 'Trigger Superposition' },
  { id: 'error', label: 'Simulate Error' },
];

/**
 * Configuration for the control sliders.
 * This constant data drives the rendering and logic of the sliders.
 * @const {SliderConfig} SLIDER_CONFIG
 */
const SLIDER_CONFIG: SliderConfig = {
  id: 'decoherenceRate',
  label: 'Decoherence Rate',
  min: 0,
  max: 100,
  step: 1,
  initialValue: 20,
};


// --- ERROR BOUNDARY FALLBACK COMPONENT ---

/**
 * A fallback component to display when an error is caught by the ErrorBoundary.
 * @param {object} props - The props object.
 * @param {Error} props.error - The error that was caught.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const ControlPanelErrorFallback = ({ error }: { error: Error }): JSX.Element => (
  <div
    className="w-80 rounded-xl border border-[#4e2a2a] bg-[#2e1a1a] p-6 font-mono text-[#e0a0a0]"
    role="alert"
  >
    <h4 className="mb-2 text-lg font-bold">Control Panel Error:</h4>
    <pre className="whitespace-pre-wrap text-[#ffb3b3]">{error.message}</pre>
  </div>
);

// --- ANIMATION VARIANTS ---

/**
 * Variants for the main panel container.
 * Controls the overall entry animation and staggers its children.
 */
const panelContainerVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

/**
 * Variants for individual items within the panel.
 * Controls the fade-in and slide-up animation for each control section.
 */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};


// --- MAIN COMPONENT ---

/**
 * ControlPanel is a self-contained component for managing simulation settings.
 * It includes buttons for triggering discrete actions and sliders for adjusting
 * continuous parameters. All configurations and state are managed internally
 * without requiring any props.
 *
 * @component
 * @returns {JSX.Element} The rendered ControlPanel component wrapped in an ErrorBoundary.
 */
const ControlPanel = (): JSX.Element => {
  /**
   * State for the simulation controls.
   * Initialized from the constant configuration data.
   */
  const [simulationState, setSimulationState] = useState<SimulationState>({
    decoherenceRate: SLIDER_CONFIG.initialValue,
    lastAction: 'Panel initialized.',
  });

  /**
   * Handles button click events.
   * Updates the 'lastAction' state to reflect the button that was pressed.
   * Memoized with useCallback for performance optimization.
   * @param {string} actionLabel - The label of the action performed.
   */
  const handleButtonClick = useCallback((actionLabel: string): void => {
    console.log(`Action Triggered: ${actionLabel}`);
    setSimulationState(prevState => ({ ...prevState, lastAction: `Action: ${actionLabel}` }));
  }, []);

  /**
   * Handles changes to the slider value.
   * Updates the corresponding value in the simulation state.
   * Memoized with useCallback for performance optimization.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseFloat(event.target.value);
    setSimulationState(prevState => ({
      ...prevState,
      decoherenceRate: value,
      lastAction: `Adjusted ${SLIDER_CONFIG.label} to ${value}%`,
    }));
  }, []);

  return (
    <motion.aside
      className="font-sans w-80 rounded-xl border border-[#2a2d4e] bg-[#1a1d2e] p-6 text-gray-200 shadow-xl"
      variants={panelContainerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="mb-6 border-b border-[#2a2d4e] pb-3 text-xl font-semibold text-white"
        variants={itemVariants as Variants}
      >
        Simulation Control Panel
      </motion.h2>

      <motion.div
        className="mb-6 space-y-[10px]"
        variants={itemVariants as Variants}
      >
        {BUTTON_CONFIGS.map(({ id, label }) => (
          <motion.button
            key={id}
            className="w-full cursor-pointer rounded-lg bg-[#3a3d6b] py-3 px-4 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-[#4a4d8b] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1d2e]"
            onClick={() => handleButtonClick(label)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {label}
          </motion.button>
        ))}
      </motion.div>

      <motion.div className="mb-6" variants={itemVariants as Variants}>
        <div className="flex flex-col">
          <label htmlFor={SLIDER_CONFIG.id} className="mb-2 flex justify-between text-sm text-[#a0a0c0]">
            <span>{SLIDER_CONFIG.label}</span>
            <motion.span
              key={simulationState.decoherenceRate}
              className="font-semibold text-white"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {simulationState.decoherenceRate}%
            </motion.span>
          </label>
          <input
            type="range"
            id={SLIDER_CONFIG.id}
            min={SLIDER_CONFIG.min}
            max={SLIDER_CONFIG.max}
            step={SLIDER_CONFIG.step}
            value={simulationState.decoherenceRate}
            onChange={handleSliderChange}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#2a2d4e] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-500"
          />
        </div>
      </motion.div>

      <motion.div
        className="mt-5 flex min-h-[40px] items-center justify-center rounded-lg bg-black/20 p-3 text-[13px] italic text-[#8f9eff]"
        variants={itemVariants as Variants}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={simulationState.lastAction}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {simulationState.lastAction || 'Awaiting command...'}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </motion.aside>
  );
};

/**
 * A wrapper component that provides an error boundary for the main ControlPanel.
 * This ensures that if the ControlPanel crashes, it won't take down the entire application.
 *
 * @returns {JSX.Element} The ControlPanel component wrapped in an ErrorBoundary.
 */
const ControlPanelWithBoundary = (): JSX.Element => (
  <ErrorBoundary FallbackComponent={ControlPanelErrorFallback}>
    <ControlPanel />
  </ErrorBoundary>
);

export default ControlPanelWithBoundary;