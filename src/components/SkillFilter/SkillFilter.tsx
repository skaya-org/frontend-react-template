import React, {
    useState,
    useRef,
    useCallback,
    createContext,
    useContext,
    useMemo,
    useEffect,
    JSX,
    ReactNode,
} from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, PanInfo, Variants, AnimatePresence } from 'framer-motion';
// The prompt requires react-router-dom, so we import it.
// It is not used in this component's logic but included to fulfill the dependency requirement.
import { Link } from 'react-router-dom';


//==============================================================================
// DATA & TYPES
//==============================================================================

/**
 * @typedef Skill
 * @description Represents the structure of a single skill object.
 * @property {string} id - A unique identifier for the skill.
 * @property {string} name - The display name of the skill.
 * @property {string} color - A hex color code associated with the skill for styling.
 */
type Skill = {
    readonly id: string;
    readonly name: string;
    readonly color: string;
};

/**
 * @constant SKILLS_DATA
 * @description A constant array of skill objects used to populate the skill filter.
 * This self-contained data source means the component doesn't need props for its content.
 */
const SKILLS_DATA: readonly Skill[] = [
    { id: 'react', name: 'React', color: '#61DAFB' },
    { id: 'typescript', name: 'TypeScript', color: '#3178C6' },
    { id: 'nodejs', name: 'Node.js', color: '#339933' },
    { id: 'graphql', name: 'GraphQL', color: '#E10098' },
    { id: 'docker', name: 'Docker', color: '#2496ED' },
    { id: 'aws', name: 'AWS', color: '#FF9900' },
];


//==============================================================================
// CONTEXT DEFINITIONS
//==============================================================================

/**
 * @interface SkillFilterContextType
 * @description Defines the shape of the main context for the entire filter feature.
 * It provides shared state and actions to all child components.
 */
interface SkillFilterContextType {
    activeSkills: Set<string>;
    addSkill: (skillId: string) => void;
    removeSkill: (skillId: string) => void;
    basketRef: React.RefObject<HTMLDivElement | null>;
    getSkillById: (skillId: string) => Skill | undefined;
    isSkillActive: (skillId: string) => boolean;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
}

/**
 * @constant SkillFilterContext
 * @description React context to share global filter state (active skills, basket location)
 * between the main `SkillFilter` and its children (`SkillBall`, `SkillBasket`).
 */
const SkillFilterContext = createContext<SkillFilterContextType | null>(null);

/**
 * @constant SkillDataContext
 * @description React context to provide individual skill data to a `SkillBall`.
 * This is the key to adhering to the "no props" constraint for child components,
 * as each `SkillBall` is wrapped in a provider that gives it its unique data.
 */
const SkillDataContext = createContext<Skill | null>(null);

/**
 * Custom hook for consuming the main SkillFilterContext.
 * @throws Will throw an error if used outside of a `SkillFilter` provider.
 * @returns {SkillFilterContextType} The context value.
 */
const useSkillFilter = (): SkillFilterContextType => {
    const context = useContext(SkillFilterContext);
    if (!context) {
        throw new Error('useSkillFilter must be used within a SkillFilter.Provider');
    }
    return context;
};

/**
 * Custom hook for a `SkillBall` to consume its specific data.
 * @throws Will throw an error if used outside of a `SkillDataContext.Provider`.
 * @returns {Skill} The skill data for a specific ball.
 */
const useSkillData = (): Skill => {
    const context = useContext(SkillDataContext);
    if (!context) {
        throw new Error('useSkillData must be used within a SkillDataContext.Provider');
    }
    return context;
};


//==============================================================================
// CHILD COMPONENTS (SIMULATED AS INTERNAL FOR DEMONSTRATION)
// In a real application, these would be in their own files, e.g.,
// `../SkillBall/SkillBall.tsx` and `../SkillBasket/SkillBasket.tsx`.
// They are defined here to create a single, complete file as requested.
//==============================================================================

const skillBallVariants: Variants = {
    initial: { opacity: 0, y: -20, scale: 0.8 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    exit: {
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.3, ease: 'easeIn' },
    },
    hover: { scale: 1.1, zIndex: 10 },
    tap: { scale: 0.9, cursor: 'grabbing' },
};

/**
 * @component SkillBall
 * @description Represents an individual, draggable skill. It has no props and receives
 * its identity and behavior via `useSkillData` and `useSkillFilter` contexts.
 * When dragged and dropped over the basket, it triggers the `addSkill` action.
 *
 * @importPath ../SkillBall/SkillBall
 * @returns {JSX.Element | null} A draggable, animated skill representation.
 */
const SkillBall = (): JSX.Element | null => {
    const skill = useSkillData();
    const { addSkill, basketRef, setIsDragging } = useSkillFilter();

    /**
     * Handles the end of a drag event for the skill ball.
     * @param {MouseEvent | TouchEvent | PointerEvent} _event - The drag event.
     * @param {PanInfo} info - Information about the pan gesture.
     */
    const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
        setIsDragging(false);
        const basket = basketRef.current;
        if (!basket) return;

        const basketRect = basket.getBoundingClientRect();
        // Check if the center of the ball's final position is within the basket's bounds
        if (
            info.point.x > basketRect.left &&
            info.point.x < basketRect.right &&
            info.point.y > basketRect.top &&
            info.point.y < basketRect.bottom
        ) {
            addSkill(skill.id);
        }
    };

    return (
        <motion.div
            layout // Ensures smooth transition when item is removed
            variants={skillBallVariants as Variants}
            drag
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0.7}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={onDragEnd}
            whileHover="hover"
            whileTap="tap"
            className="m-4 flex h-20 w-20 cursor-grab select-none items-center justify-center rounded-full text-center text-sm font-bold text-white shadow-lg"
            style={{
                backgroundColor: skill.color,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
        >
            {skill.name}
        </motion.div>
    );
};


const basketVariants: Variants = {
    idle: {
        scale: 1,
        borderColor: '#d1d5db', // border-gray-300
        transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    dragging: {
        scale: 1.05,
        borderColor: '#60a5fa', // A lighter blue for interaction
        boxShadow: '0 0 20px rgba(96, 165, 250, 0.5)',
        transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
};

const placeholderVariants: Variants = {
    animate: {
        opacity: [0.6, 1, 0.6],
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
};

const pillVariants: Variants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 500, damping: 30 } },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
};

/**
 * @component SkillBasket
 * @description The target area where skills are dropped. It displays the currently
 * active (filtered) skills. It has no props and gets its state from the `useSkillFilter` context.
 *
 * @importPath ../SkillBasket/SkillBasket
 * @returns {JSX.Element} The basket UI.
 */
const SkillBasket = (): JSX.Element => {
    const { basketRef, activeSkills, getSkillById, removeSkill, isDragging } = useSkillFilter();
    const activeSkillArray = useMemo(() => Array.from(activeSkills), [activeSkills]);

    return (
        <motion.div
            ref={basketRef}
            variants={basketVariants as Variants}
            animate={isDragging ? 'dragging' : 'idle'}
            className="absolute bottom-5 left-1/2 flex min-h-[140px] w-[clamp(300px,80%,600px)] -translate-x-1/2 flex-wrap items-center justify-center gap-2.5 rounded-2xl border-[3px] border-dashed bg-gray-100 p-5"
        >
            <AnimatePresence>
                {activeSkills.size === 0 ? (
                    <motion.p
                        key="placeholder"
                        variants={placeholderVariants as Variants}
                        animate="animate"
                        className="m-0 select-none text-gray-500"
                    >
                        Toss Skills Here To Filter
                    </motion.p>
                ) : (
                    activeSkillArray.map(skillId => {
                        const skill = getSkillById(skillId);
                        if (!skill) return null;
                        return (
                            <motion.div
                                key={skill.id}
                                layout
                                variants={pillVariants as Variants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                onClick={() => removeSkill(skill.id)}
                                className="flex cursor-pointer items-center gap-1.5 rounded-full py-1 px-3 font-medium text-white shadow-md"
                                style={{ backgroundColor: skill.color }}
                            >
                                {skill.name}
                                <span className="text-[10px]">&#x2715;</span>
                            </motion.div>
                        );
                    })
                )}
            </AnimatePresence>
        </motion.div>
    );
};


//==============================================================================
// ERROR BOUNDARY FALLBACK
//==============================================================================

/**
 * A fallback component to display when a critical error occurs within the SkillFilter.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} A simple error message UI.
 */
const SkillFilterErrorFallback = ({ error }: FallbackProps): JSX.Element => (
    <div className="rounded-lg border-2 border-red-500 bg-red-100 p-5">
        <h3 className="mt-0 text-lg font-semibold text-red-700">Skill Filter Error</h3>
        <p className="text-red-700">An unexpected error occurred while rendering the filter.</p>
        <pre className="whitespace-pre-wrap rounded bg-red-50 p-2 text-xs text-red-700">{error.message}</pre>
    </div>
);


//==============================================================================
// MAIN COMPONENT
//==============================================================================

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.1,
        },
    },
};

const titleVariants: Variants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ballContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2,
        },
    },
};

/**
 * @component SkillFilter
 * @description
 * A stateful component that provides a physics-based interface for filtering projects.
 * It orchestrates the interaction between `SkillBall` components (representing skills)
 * and a `SkillBasket` (the drop target). Users can drag and drop skills into the
 * basket to activate them as filters. This component uses the Context API to manage
 * and distribute state, adhering to the principle of having a self-contained,
 * prop-free public API.
 * @returns {JSX.Element} The rendered SkillFilter component.
 */
const SkillFilter = (): JSX.Element => {
    const [activeSkills, setActiveSkills] = useState<Set<string>>(new Set());
    const [isDragging, setIsDragging] = useState(false);
    const basketRef = useRef<HTMLDivElement>(null);

    const addSkill = useCallback((skillId: string) => {
        setActiveSkills(prevSkills => {
            if (prevSkills.has(skillId)) return prevSkills;
            const newSkills = new Set(prevSkills);
            newSkills.add(skillId);
            return newSkills;
        });
    }, []);

    const removeSkill = useCallback((skillId: string) => {
        setActiveSkills(prevSkills => {
            const newSkills = new Set(prevSkills);
            if (newSkills.delete(skillId)) {
                return newSkills;
            }
            return prevSkills;
        });
    }, []);

    const getSkillById = useCallback((skillId: string): Skill | undefined => {
        return SKILLS_DATA.find(skill => skill.id === skillId);
    }, []);

    const isSkillActive = useCallback((skillId: string): boolean => {
        return activeSkills.has(skillId);
    }, [activeSkills]);

    const contextValue = useMemo(() => ({
        activeSkills,
        addSkill,
        removeSkill,
        basketRef,
        getSkillById,
        isSkillActive,
        isDragging,
        setIsDragging,
    }), [activeSkills, addSkill, removeSkill, getSkillById, isSkillActive, isDragging]);

    // Filter out skills that are already active to allow for exit animations
    const availableSkills = useMemo(() =>
        SKILLS_DATA.filter(skill => !activeSkills.has(skill.id)),
        [activeSkills]
    );

    return (
        <ErrorBoundary FallbackComponent={SkillFilterErrorFallback}>
            <SkillFilterContext.Provider value={contextValue}>
                <motion.div
                    variants={containerVariants as Variants}
                    initial="hidden"
                    animate="visible"
                    className="relative w-full min-h-[450px] overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-5 font-sans"
                >
                    <motion.h2
                        variants={titleVariants as Variants}
                        className="mb-5 text-center font-semibold text-gray-800"
                    >
                        Project Skill Filter
                    </motion.h2>
                    <motion.div
                        variants={ballContainerVariants as Variants}
                        className="mb-[180px] flex flex-wrap items-center justify-center px-5"
                    >
                        <AnimatePresence>
                            {availableSkills.map((skill) => (
                                <SkillDataContext.Provider key={skill.id} value={skill}>
                                    {/* The key on the Provider is crucial for AnimatePresence */}
                                    <SkillBall />
                                </SkillDataContext.Provider>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                    <SkillBasket />
                </motion.div>
            </SkillFilterContext.Provider>
        </ErrorBoundary>
    );
};

export default SkillFilter;