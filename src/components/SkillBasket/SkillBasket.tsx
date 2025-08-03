import React, {
  JSX,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { motion, AnimatePresence, useAnimation, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// --- CONTEXT DEFINITION ---
// To enable communication without props, we use a shared context.
// A parent component in the application tree must provide this context.

/**
 * @typedef SkillFilterContextType
 * @property {string | null} selectedSkill - The name of the skill currently selected (e.g., 'React'). Null if no skill is selected.
 * @property {React.Dispatch<React.SetStateAction<string | null>>} setSelectedSkill - Function to update the selected skill.
 */
interface SkillFilterContextType {
  selectedSkill: string | null;
  setSelectedSkill: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * Context for managing the state of the selected skill filter.
 * The SkillBasket component consumes this context to react to changes and to clear the filter.
 * SkillBall components (or others) would use this context to set the active filter.
 */
const SkillFilterContext = createContext<SkillFilterContextType | undefined>(
  undefined,
);

/**
 * A custom hook for accessing the SkillFilterContext.
 * It ensures the hook is used within a component wrapped by SkillFilterProvider.
 * @returns {SkillFilterContextType} The context value.
 * @throws {Error} If used outside of a SkillFilterProvider.
 */
const useSkillFilter = (): SkillFilterContextType => {
  const context = useContext(SkillFilterContext);
  if (!context) {
    throw new Error('useSkillFilter must be used within a SkillFilterProvider.');
  }
  return context;
};

// --- CONSTANT DATA ---

/**
 * Constant data mapping skill names to their visual properties.
 * This ensures the component is self-contained and does not need this data passed as props.
 * @const
 */
const SKILL_VISUALS: Record<string, { color: string; label: string }> = {
  React: { color: '#61DAFB', label: 'R' },
  TypeScript: { color: '#3178C6', label: 'TS' },
  'Node.js': { color: '#68A063', label: 'N' },
  GraphQL: { color: '#E10098', label: 'G' },
  'Framer Motion': { color: '#0055FF', label: 'M' },
  CSS: { color: '#2965f1', label: 'C' },
  HTML: { color: '#e34f26', label: 'H' },
  JavaScript: { color: '#f7df1e', label: 'JS' },
};

// --- CHILD COMPONENTS ---

/**
 * A fallback component to display when the SkillBasket encounters a rendering error.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} The fallback UI.
 */
const SkillBasketErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div
    role="alert"
    className="flex h-[200px] w-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#ff4757] bg-[#ff475711] p-4 text-[#ff4757]"
  >
    <p>SkillBasket Failed</p>
    <pre className="text-[0.7rem]">{error.message}</pre>
  </div>
);

// --- ANIMATION VARIANTS ---

/** Variants for the main container to fade and scale in on load. */
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/** Variants for the 3D basket, controlling its assembly, hover, and jiggle states. */
const basketContainerVariants: Variants = {
  hidden: { rotateX: -25, rotateY: 30 },
  visible: {
    rotateX: -25,
    rotateY: 30,
    transition: {
      staggerChildren: 0.08, // Animate panels sequentially.
    },
  },
  hover: {
    scale: 1.1,
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  },
  jiggle: {
    scale: [1, 1.1, 0.95, 1.05, 1],
    rotateX: [-25, -30, -20, -25],
    rotateY: [30, 35, 25, 30],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

/** Variants for the individual panels of the basket to fade and scale in. */
const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/** Variants for the skill indicator inside the basket. */
const skillIndicatorVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    y: -40,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// --- MAIN COMPONENT ---

/**
 * SkillBasket is a 3D component that acts as a visual target for selected skills.
 * It consumes a SkillFilterContext to know which skill (if any) is currently selected.
 * When a skill is selected, it displays a visual representation of that skill.
 * Clicking the basket when a skill is "inside" clears the filter.
 * This component is self-contained and receives no props.
 * @returns {JSX.Element} The rendered SkillBasket component.
 */
const SkillBasket = (): JSX.Element => {
  const { selectedSkill, setSelectedSkill } = useSkillFilter();
  const controls = useAnimation();

  const visual = useMemo(
    () => (selectedSkill ? SKILL_VISUALS[selectedSkill] : null),
    [selectedSkill],
  );

  useEffect(() => {
    if (selectedSkill) {
      // A skill is selected, so trigger the jiggle animation.
      controls.start('jiggle');
    } else {
      // No skill is selected (or it was just cleared), so run the 'visible' state.
      // This also handles the initial assembly animation on mount.
      controls.start('visible');
    }
  }, [selectedSkill, controls]);

  const handleClearFilter = (): void => {
    if (selectedSkill) {
      setSelectedSkill(null);
    }
  };

  const basketPanelBaseClasses =
    'absolute box-border h-[100px] w-[100px] border-2 bg-[rgba(0,50,100,0.1)] transition-colors duration-300 ease-in-out';

  return (
    <motion.div
      className="flex h-[200px] w-[200px] items-center justify-center [perspective:1000px]"
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className={`relative h-[100px] w-[100px] transform-preserve-3d ${
          selectedSkill ? 'cursor-pointer' : 'cursor-default'
        }`}
        variants={basketContainerVariants as Variants}
        initial="hidden"
        animate={controls}
        whileHover="hover"
        onClick={handleClearFilter}
        title={selectedSkill ? 'Click to clear filter' : 'Skill basket'}
      >
        {/* Bottom Panel */}
        <motion.div
          className={`${basketPanelBaseClasses} [transform:rotateX(90deg)_translateZ(-50px)]`}
          style={{
            borderColor: visual
              ? visual.color
              : 'rgba(100, 200, 255, 0.5)',
          }}
          variants={panelVariants as Variants}
        />
        {/* Back Panel */}
        <motion.div
          className={`${basketPanelBaseClasses} [transform:translateZ(-50px)]`}
          style={{
            borderColor: visual
              ? visual.color
              : 'rgba(100, 200, 255, 0.5)',
          }}
          variants={panelVariants as Variants}
        />
        {/* Front Panel (invisible) */}
        <motion.div
          className={`${basketPanelBaseClasses} border-transparent bg-transparent [transform:translateZ(50px)]`}
          variants={panelVariants as Variants}
        />
        {/* Left Panel */}
        <motion.div
          className={`${basketPanelBaseClasses} [transform:rotateY(90deg)_translateZ(-50px)]`}
          style={{
            borderColor: visual
              ? visual.color
              : 'rgba(100, 200, 255, 0.5)',
          }}
          variants={panelVariants as Variants}
        />
        {/* Right Panel */}
        <motion.div
          className={`${basketPanelBaseClasses} [transform:rotateY(-90deg)_translateZ(-50px)]`}
          style={{
            borderColor: visual
              ? visual.color
              : 'rgba(100, 200, 255, 0.5)',
          }}
          variants={panelVariants as Variants}
        />

        <AnimatePresence>
          {selectedSkill && visual && (
            <motion.div
              className="absolute left-1/2 top-1/2 flex h-[50px] w-[50px] items-center justify-center rounded-full font-bold text-white text-2xl [text-shadow:0_0_10px_rgba(255,255,255,0.8)]"
              style={{
                backgroundColor: visual.color,
                boxShadow: `0 0 20px ${visual.color}, 0 0 30px ${visual.color}`,
                transform: 'translateZ(25px) translateX(-50%) translateY(-50%)',
              }}
              key={selectedSkill}
              variants={skillIndicatorVariants as Variants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {visual.label}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// --- PROVIDER AND WRAPPER FOR EXPORT ---

/**
 * A simple demonstration Provider for the SkillFilterContext.
 * In a real application, this would likely live in a higher-level file
 * and wrap the parts of the app that need access to the filter state.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} A context provider.
 */
const SkillFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const value = useMemo(
    () => ({ selectedSkill, setSelectedSkill }),
    [selectedSkill],
  );
  return (
    <SkillFilterContext.Provider value={value}>
      {children}
    </SkillFilterContext.Provider>
  );
};

/**
 * This wrapper component provides the required context and error boundary
 * for the SkillBasket, making it a complete, safe, and self-contained unit.
 * In a real application, the Provider might be placed higher in the component tree.
 * @returns {JSX.Element} The SkillBasket component wrapped with necessary providers.
 */
const SkillBasketWithProvider = (): JSX.Element => {
  return (
    <ErrorBoundary FallbackComponent={SkillBasketErrorFallback}>
      <SkillFilterProvider>
        <SkillBasket />
      </SkillFilterProvider>
    </ErrorBoundary>
  );
};

export default SkillBasketWithProvider;