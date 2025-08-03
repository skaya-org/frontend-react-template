import React, { useState, useCallback, JSX } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';

// #region --- ICONS ---

/**
 * Renders an SVG icon for the 'Add Block' action.
 * @returns {JSX.Element} The SVG icon.
 */
const AddBlockIcon = (): JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

/**
 * Renders an SVG icon for the 'Place Tree' action.
 * @returns {JSX.Element} The SVG icon.
 */
const PlaceTreeIcon = (): JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V10M12 10C12 7.79086 10.2091 6 8 6C5.79086 6 4 7.79086 4 10C4 12.2091 5.79086 14 8 14M12 10C12 7.79086 13.7909 6 16 6C18.2091 6 20 7.79086 20 10C20 12.2091 18.2091 14 16 14M8 14H16"></path>
    </svg>
);

/**
 * Renders an SVG icon for the 'Paint Ground' action.
 * @returns {JSX.Element} The SVG icon.
 */
const PaintGroundIcon = (): JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C12 18.6863 9.31371 16 6 16C2.68629 16 0 18.6863 0 22H12Z" transform="translate(6, -2)"></path>
        <path d="M7 11.5L9.5 9L14.5 14L17 11.5"></path>
        <rect x="2" y="2" width="20" height="20" rx="2"></rect>
    </svg>
);

/**
 * Renders an SVG icon for the 'Save World' action.
 * @returns {JSX.Element} The SVG icon.
 */
const SaveWorldIcon = (): JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);

// #endregion --- ICONS ---


// #region --- TYPES AND CONSTANTS ---

/**
 * Defines the structure for a toolbar action item.
 * @typedef {object} ToolbarAction
 * @property {string} id - A unique identifier for the action.
 * @property {string} label - The accessible label and tooltip text for the button.
 * @property {JSX.Element} icon - The icon component for the button.
 */
type ToolbarAction = {
  readonly id: string;
  readonly label: string;
  readonly icon: JSX.Element;
};

/**
 * Constant data for the toolbar actions.
 * This array is declared as `readonly` to enforce immutability, ensuring that
 * the component's core data source is stable and predictable.
 * @type {readonly ToolbarAction[]}
 */
const TOOLBAR_ACTIONS: readonly ToolbarAction[] = [
  { id: 'add-block', label: 'Add Block', icon: <AddBlockIcon /> },
  { id: 'place-tree', label: 'Place Tree', icon: <PlaceTreeIcon /> },
  { id: 'paint-ground', label: 'Paint Ground', icon: <PaintGroundIcon /> },
  { id: 'save-world', label: 'Save World', icon: <SaveWorldIcon /> },
];


// #endregion --- TYPES AND CONSTANTS ---


// #region --- SUB-COMPONENTS ---

/**
 * A single button for the toolbar.
 * @param {object} props - The component props.
 * @param {JSX.Element} props.icon - The icon to display.
 * @param {string} props.label - The accessible label for the button.
 * @param {boolean} props.isActive - Whether the button is currently active.
 * @param {() => void} props.onClick - The function to call when the button is clicked.
 * @returns {JSX.Element} A motion-enhanced button component.
 */
const ToolbarButton = ({ icon, label, isActive, onClick }: {
  icon: JSX.Element;
  label: string;
  isActive: boolean;
  onClick: () => void;
}): JSX.Element => (
    <motion.button
        title={label}
        aria-label={label}
        onClick={onClick}
        className={`
            flex justify-center items-center w-12 h-12 rounded-lg cursor-pointer 
            outline-none transition-colors duration-200 ease-in-out border-2
            focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
            ${
                isActive
                ? 'bg-blue-100 text-blue-500 border-blue-500'
                : 'bg-neutral-100 text-neutral-700 border-transparent hover:bg-neutral-200'
            }
        `}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
        {icon}
    </motion.button>
);


/**
 * A fallback component to display when an error occurs within the toolbar.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @param {Error} props.error - The error that was caught.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const ToolbarErrorFallback = ({ error }: FallbackProps): JSX.Element => (
    <div
        role="alert"
        className="flex flex-col items-center justify-center h-full w-full text-red-700 bg-red-100 border border-red-300 rounded-lg p-4 text-center"
    >
        <p><strong>Toolbar Error:</strong></p>
        <pre className="m-0 text-sm">{error.message}</pre>
    </div>
);


// #endregion --- SUB-COMPONENTS ---


// #region --- MAIN COMPONENT ---

/**
 * Animation variants for the main toolbar container.
 * Defines the `hidden` and `visible` states for the mount animation.
 * The `visible` state includes `staggerChildren` to orchestrate item animations.
 */
const toolbarVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * Animation variants for each individual toolbar item.
 * Defines how each button appears, controlled by the parent's stagger properties.
 */
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};


/**
 * UserContentToolbar provides a set of tools for user-generated content.
 * It is a self-contained, horizontal bar with icon-based buttons for various actions.
 * The component manages its own state and uses constant data, requiring no props.
 * @component
 * @returns {JSX.Element} The rendered UserContentToolbar component.
 */
const UserContentToolbar = (): JSX.Element => {
    // State to track the currently selected tool. Initialized to the first tool or null.
    const [activeTool, setActiveTool] = useState<string | null>(TOOLBAR_ACTIONS[0]?.id ?? null);

    /**
     * Handles the selection of a tool.
     * Uses useCallback to memoize the function, preventing unnecessary re-renders of child components.
     * It simulates an action log for demonstration purposes.
     * The 'Save World' action is treated as a one-off action and does not stay 'active'.
     */
    const handleToolSelect = useCallback((toolId: string) => {
        if (toolId === 'save-world') {
            console.log('Action: Save World initiated.');
            // We don't set 'save-world' as active, as it's a momentary action.
            // The previously active tool remains selected.
        } else {
            setActiveTool(prevTool => {
                const newTool = prevTool === toolId ? null : toolId;
                console.log(`Tool selected: ${newTool ? TOOLBAR_ACTIONS.find(t => t.id === newTool)?.label : 'None'}`);
                return newTool;
            });
        }
    }, []);

    return (
        <motion.nav
            className="fixed bottom-5 left-1/2 z-[1000] flex -translate-x-1/2 gap-2 rounded-xl border border-neutral-200/50 bg-white/80 p-2 shadow-lg backdrop-blur-sm"
            aria-label="Content Tools"
            variants={toolbarVariants as Variants}
            initial="hidden"
            animate="visible"
        >
            {TOOLBAR_ACTIONS.map((action) => (
                <motion.div key={action.id} variants={itemVariants as Variants}>
                    <ToolbarButton
                        icon={action.icon}
                        label={action.label}
                        isActive={activeTool === action.id}
                        onClick={() => handleToolSelect(action.id)}
                    />
                </motion.div>
            ))}
        </motion.nav>
    );
};


/**
 * This is the final exported component.
 * It wraps the core UserContentToolbar component with an ErrorBoundary.
 * This ensures that if any unexpected error occurs within the toolbar,
 * it won't crash the entire application, and a graceful fallback UI is shown instead.
 */
const UserContentToolbarWithBoundary = (): JSX.Element => (
    <ErrorBoundary FallbackComponent={ToolbarErrorFallback}>
        <UserContentToolbar />
    </ErrorBoundary>
);

export default UserContentToolbarWithBoundary;