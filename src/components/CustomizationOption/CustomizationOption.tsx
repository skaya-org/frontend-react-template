import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    JSX,
    ReactNode
} from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {object} CustomizationPart
 * @property {string} id - A unique identifier for the part (e.g., 'head-01').
 * @property {string} name - The display name of the part (e.g., 'Spiky Hair').
 * @property {string} iconUrl - The URL for the part's icon image.
 * @property {boolean} isUnlocked - Flag indicating if the part is available for selection.
 */
type CustomizationPart = {
    id: string;
    name: string;
    iconUrl: string;
    isUnlocked: boolean;
};

/**
 * @typedef {object} CustomizationContextType
 * @property {string | null} selectedPartId - The ID of the currently selected part.
 * @property {(id: string | null) => void} setSelectedPartId - Function to update the selected part.
 */
type CustomizationContextType = {
    selectedPartId: string | null;
    setSelectedPartId: (id: string | null) => void;
};

// --- STATIC DATA ---

/**
 * Static data for all available critter customization parts.
 * In a real-world application, this might come from an API endpoint.
 * For this component, it is treated as a static, internal constant to adhere
 * to the "no props" requirement.
 * @type {CustomizationPart[]}
 */
const CUSTOMIZATION_PARTS: readonly CustomizationPart[] = [
    { id: 'head-01', name: 'Standard Horns', iconUrl: 'https://picsum.photos/id/10/100/100.webp', isUnlocked: true },
    { id: 'head-02', name: 'Antennae', iconUrl: 'https://picsum.photos/id/25/100/100.webp', isUnlocked: true },
    { id: 'head-03', name: 'Leafy Crown', iconUrl: 'https://picsum.photos/id/55/100/100.webp', isUnlocked: false },
    { id: 'eyes-01', name: 'Googly Eyes', iconUrl: 'https://picsum.photos/id/30/100/100.webp', isUnlocked: true },
    { id: 'eyes-02', name: 'Laser Vision', iconUrl: 'https://picsum.photos/id/42/100/100.webp', isUnlocked: false },
    { id: 'body-01', name: 'Fuzzy Fur', iconUrl: 'https://picsum.photos/id/60/100/100.webp', isUnlocked: true },
    { id: 'body-02', name: 'Shiny Shell', iconUrl: 'https://picsum.photos/id/75/100/100.webp', isUnlocked: true },
    { id: 'body-03', name: 'Feathered Coat', iconUrl: 'https://picsum.photos/id/82/100/100.webp', isUnlocked: false },
];

// --- CONTEXT & PROVIDER ---

/**
 * Context for managing the state of critter customization.
 * It provides the currently selected part ID and a function to update it.
 * This allows sibling components (e.g., a critter previewer) to react to changes
 * without prop drilling, adhering to the design constraints.
 * @type {React.Context<CustomizationContextType | undefined>}
 */
const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

/**
 * Custom hook to safely access the CustomizationContext.
 * Throws an error if used outside of a CustomizationProvider.
 * @returns {CustomizationContextType} The customization context value.
 */
export const useCustomization = (): CustomizationContextType => {
    const context = useContext(CustomizationContext);
    if (!context) {
        throw new Error('useCustomization must be used within a CustomizationProvider');
    }
    return context;
};

/**
 * Provider component for the CustomizationContext.
 * It should wrap the parent component that contains both the
 * customization options and the critter preview to enable shared state.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components to render within the context.
 * @returns {JSX.Element} The provider component.
 */
export const CustomizationProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [selectedPartId, setSelectedPartId] = useState<string | null>('head-01');

    const contextValue = useMemo(() => ({
        selectedPartId,
        setSelectedPartId,
    }), [selectedPartId]);

    return (
        <CustomizationContext.Provider value={contextValue}>
            {children}
        </CustomizationContext.Provider>
    );
};


// --- ERROR FALLBACK COMPONENT ---

/**
 * A simple fallback component to display when an error is caught by an ErrorBoundary.
 * @param {object} props - The component props.
 * @param {Error} props.error - The error that was caught.
 * @returns {JSX.Element} The rendered error message.
 */
const CustomizationErrorFallback = ({ error }: { error: Error }): JSX.Element => (
    <div
        role="alert"
        className="rounded-lg border border-red-600 bg-red-950 p-5 font-mono text-red-200"
    >
        <p><strong className="font-bold">Critter Workshop Malfunction!</strong></p>
        <p className="mt-1">Could not display customization options.</p>
        <pre className="mt-2.5 whitespace-pre-wrap rounded bg-black/20 p-2.5">
            {error.message}
        </pre>
    </div>
);

// --- MAIN COMPONENT ---

/**
 * Represents a single unlockable part in the Critter Workshop.
 * This component displays the icon of the part and a visual indicator for its
 * lock status. Clicking an unlocked option updates a shared context, allowing
 * a separate preview component to reflect the change.
 * @param {object} props - The component props.
 * @param {CustomizationPart} props.part - The customization part data to render.
 * @returns {JSX.Element} A single customization option item.
 */
const PartOption = ({ part }: { part: CustomizationPart }): JSX.Element => {
    const { selectedPartId, setSelectedPartId } = useCustomization();
    const isSelected = selectedPartId === part.id;

    const handleClick = useCallback(() => {
        if (part.isUnlocked) {
            setSelectedPartId(part.id);
        }
    }, [part.isUnlocked, part.id, setSelectedPartId]);

    const itemVariants: Variants = {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 20 }
        },
    };

    const lockOverlayVariants: Variants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            variants={itemVariants as Variants}
            onClick={handleClick}
            className={`
                relative flex w-full aspect-square items-center justify-center
                overflow-hidden rounded-xl bg-zinc-800 select-none border-2 border-transparent
                transition-colors duration-200
                ${part.isUnlocked
                    ? 'cursor-pointer hover:bg-zinc-700'
                    : 'cursor-not-allowed'
                }
            `}
            whileHover={part.isUnlocked ? { scale: 1.08, y: -5 } : {}}
            whileTap={part.isUnlocked ? { scale: 0.95 } : {}}
            aria-label={part.name}
            aria-disabled={!part.isUnlocked}
            role="button"
            tabIndex={part.isUnlocked ? 0 : -1}
        >
            {isSelected && part.isUnlocked && (
                <motion.div
                    className="pointer-events-none absolute inset-0 z-10 rounded-xl border-2 border-sky-500"
                    style={{ boxShadow: '0 0 12px 3px rgba(56, 189, 248, 0.5)' }}
                    layoutId="critter-part-selection"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            )}

            <motion.img
                src={part.iconUrl}
                alt={part.name}
                className="h-[70%] w-[70%] object-contain"
                draggable="false"
            />
            {!part.isUnlocked && (
                <motion.div
                    variants={lockOverlayVariants as Variants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 flex items-center justify-center bg-black/60"
                >
                    <svg
                        className="h-[40%] w-[40%] text-white/70"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M12 1.5A5.25 5.25 0 006.75 6.75v3H6a2.25 2.25 0 00-2.25 2.25v8.25A2.25 2.25 0 006 22.5h12a2.25 2.25 0 002.25-2.25v-8.25A2.25 2.25 0 0018 9.75h-.75v-3A5.25 5.25 0 0012 1.5zM8.25 6.75a3.75 3.75 0 017.5 0v3H8.25v-3z"></path>
                    </svg>
                </motion.div>
            )}
        </motion.div>
    );
};

/**
 * The CustomizationOption component renders a grid of all available critter parts.
 * It manages its own data source internally and relies on the CustomizationProvider
 * context for state management, thus requiring no props.
 *
 * It is designed to be used within a `CustomizationProvider` to enable interaction
 * with other components like a critter previewer.
 * @returns {JSX.Element} A component that renders a list of customization options.
 */
const CustomizationOption = (): JSX.Element => {
    const listVariants: Variants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.07,
                delayChildren: 0.1,
            },
        },
    };

    return (
        <ErrorBoundary FallbackComponent={CustomizationErrorFallback}>
            <div className="w-full max-w-[420px] rounded-2xl bg-zinc-900 p-6 font-sans text-zinc-100">
                <h2 className="mb-5 text-center text-2xl font-semibold tracking-wide">Critter Parts</h2>
                <motion.div
                    className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4"
                    variants={listVariants as Variants}
                    initial="initial"
                    animate="animate"
                >
                    {CUSTOMIZATION_PARTS.map((part) => (
                        <PartOption key={part.id} part={part} />
                    ))}
                </motion.div>
            </div>
        </ErrorBoundary>
    );
};

export default CustomizationOption;