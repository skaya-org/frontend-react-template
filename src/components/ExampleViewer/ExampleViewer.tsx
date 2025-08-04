import React, { JSX, useState, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion'; // Added Variants import

// --- Variants Definitions ---

// Variants for the error fallback UI in ErrorBoundary
const errorFallbackVariants: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2, ease: 'easeIn' } }, // Added exit for completeness
};

// Variants for the main grid container that holds example cards
const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger the animation of child items
      delayChildren: 0.2, // Delay the start of child animations
    },
  },
};

// Variants for each individual example card within the grid
const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 }, // More pronounced initial state for items
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring', // Use spring for a bouncier feel
      stiffness: 100,
      damping: 10,
      mass: 0.5,
      duration: 0.6, // Longer duration for spring effect
    },
  },
  exit: { // Exit animation when component is removed from the DOM (e.g., filtered out)
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

// --- Error Boundary Component ---

/**
 * @typedef {object} ErrorBoundaryProps
 * @property {ReactNode} children - The child components to be wrapped by the error boundary.
 */
interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * @typedef {object} ErrorBoundaryState
 * @property {boolean} hasError - Indicates if an error has occurred within the child tree.
 * @property {string | null} errorDetail - Detailed error message and component stack, if an error is caught.
 */
interface ErrorBoundaryState {
  hasError: boolean;
  errorDetail: string | null;
}

/**
 * ErrorBoundary is a React Class Component that catches JavaScript errors
 * anywhere in its child component tree, logs those errors, and displays a
 * fallback UI instead of the crashed component tree.
 * It implements the componentDidCatch and static getDerivedStateFromError lifecycle methods.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Initializes the state for the ErrorBoundary component.
   * @param {ErrorBoundaryProps} props - The props for the component.
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorDetail: null };
  }

  /**
   * Static method to update state when an error is caught.
   * This method is called after an error has been thrown by a descendant component.
   * It is used to render a fallback UI after an error has been thrown.
   * @param {Error} error - The error that was thrown.
   * @returns {ErrorBoundaryState} An object to update the component's state.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    console.error('Error caught by ErrorBoundary (getDerivedStateFromError):', error);
    return { hasError: true, errorDetail: error.message };
  }

  /**
   * This method is called after an error has been thrown by a descendant component.
   * It is used for side effects like logging errors.
   * @param {Error} error - The error that was thrown.
   * @param {ErrorInfo} errorInfo - An object with a componentStack key containing information about which component threw the error.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary (componentDidCatch):', error, errorInfo);
    // Include component stack in details for debugging
    this.setState({ errorDetail: `${error.message}\n\nComponent Stack:\n${errorInfo.componentStack}` });
  }

  /**
   * Renders the children components or a fallback UI if an error occurs.
   * @returns {JSX.Element} The rendered component, either children or error fallback.
   */
  render(): JSX.Element {
    if (this.state.hasError) {
      // Render custom fallback UI when an error is caught
      return (
        <motion.div
          className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md flex flex-col items-center justify-center gap-4 min-h-[150px] text-center"
          variants={errorFallbackVariants as Variants} // Apply variants here
          initial="initial"
          animate="animate"
          exit="exit" // `exit` will only trigger if ErrorBoundary is wrapped in AnimatePresence and unmounted
        >
          <p className="font-bold text-lg">Oops! Something went wrong.</p>
          <p className="text-sm">This example failed to render. Please check the console for more details.</p>
          {this.state.errorDetail && (
            <details className="mt-2 text-xs text-red-600 cursor-pointer max-w-full overflow-auto text-left">
              <summary className="font-semibold">Error Details (Click to expand)</summary>
              <pre className="mt-2 p-3 bg-red-50 rounded-md whitespace-pre-wrap break-words text-left">
                {this.state.errorDetail}
              </pre>
            </details>
          )}
        </motion.div>
      );
    }

    // Render children normally if no error occurred
    return this.props.children as JSX.Element;
  }
}

// --- Mock Components for Demonstration ---

/**
 * SimpleCardComponent is a self-contained React functional component
 * that demonstrates a basic interactive card layout. It does not accept any props
 * and manages its own state and presentation. It uses Framer Motion for animations
 * and displays a random image.
 *
 * @returns {JSX.Element} The rendered card component.
 */
const SimpleCardComponent = (): JSX.Element => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <motion.div
      className="relative p-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center gap-2 overflow-hidden w-full max-w-sm mx-auto"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <motion.img
        src="https://picsum.photos/200/150.webp?random=1"
        alt="A random scenic image"
        className="w-full h-auto rounded-md object-cover max-h-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <h3 className="text-xl font-semibold text-gray-800 mt-2">Example Card</h3>
      <p className="text-sm text-gray-600 text-center">
        This component showcases a simple card with a random image, text, and interactive hover effects using Framer Motion.
      </p>
      <motion.button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
        whileTap={{ scale: 0.95 }}
      >
        Explore
      </motion.button>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-blue-700 font-bold text-lg">Interactive!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * CounterHookDemo is a self-contained React functional component
 * that demonstrates the usage of the `useState` hook for a simple counter.
 * It does not accept any props and manages its own internal state.
 * Framer Motion is used for button click animations.
 *
 * @returns {JSX.Element} The rendered counter component.
 */
const CounterHookDemo = (): JSX.Element => {
  const [count, setCount] = useState<number>(0);

  /**
   * Increments the counter state by 1.
   */
  const increment = (): void => {
    setCount((prevCount: number) => prevCount + 1);
  };

  /**
   * Decrements the counter state by 1.
   */
  const decrement = (): void => {
    setCount((prevCount: number) => prevCount - 1);
  };

  return (
    <motion.div
      className="p-6 bg-purple-50 rounded-lg shadow-md flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold text-purple-800">Counter Hook Demo</h3>
      <p className="text-5xl font-extrabold text-purple-600">{count}</p>
      <div className="flex gap-4">
        <motion.button
          className="px-6 py-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-all duration-200 text-lg"
          onClick={decrement}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          Decrement
        </motion.button>
        <motion.button
          className="px-6 py-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-all duration-200 text-lg"
          onClick={increment}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          Increment
        </motion.button>
      </div>
      <p className="text-sm text-purple-700 text-center mt-2">
        This example demonstrates a basic counter using React's `useState` hook,
        managed entirely within the component.
      </p>
    </motion.div>
  );
};

// --- Example Data Configuration ---

/**
 * @typedef {object} ExampleConfig
 * @property {string} id - A unique identifier for the example.
 * @property {string} title - The title of the example, displayed in the viewer.
 * @property {string} description - A brief explanation of what the example demonstrates.
 * @property {() => JSX.Element} component - The React functional component to render for this example.
 *                                          It is expected to be self-contained and not require props.
 */
interface ExampleConfig {
  id: string;
  title: string;
  description: string;
  component: () => JSX.Element;
}

/**
 * An array of constant, pre-configured examples to be displayed by the ExampleViewer.
 * Each object in this array defines an example with its metadata and the component to render.
 * These components are self-fulfilled and do not require props from the ExampleViewer.
 */
const EXAMPLE_COMPONENTS: ExampleConfig[] = [
  {
    id: 'simple-card',
    title: 'Simple Card Component',
    description: 'A basic interactive card demonstrating a component with an image, text, and hover effects using Framer Motion.',
    component: SimpleCardComponent,
  },
  {
    id: 'counter-hook',
    title: 'Counter Hook Demo',
    description: 'An example showcasing the usage of the `useState` hook for a simple counter, demonstrating internal state management.',
    component: CounterHookDemo,
  },
  // Example for demonstrating the ErrorBoundary (uncomment to test):
  // {
  //   id: 'error-demonstration',
  //   title: 'Error-Prone Component',
  //   description: 'This component is intentionally designed to throw an error to demonstrate the functionality of the ErrorBoundary.',
  //   component: () => {
  //     // Simulate an error occurring during render
  //     throw new Error('Simulated runtime error within the component!');
  //     // This line will never be reached, but is here for type completeness
  //     // return <div>This text will not be visible if an error occurs.</div>;
  //   },
  // },
];

// --- Main ExampleViewer Component ---

/**
 * ExampleViewer is a core React component responsible for rendering live, interactive
 * examples of other React components or hook usages. It dynamically displays
 * constant, pre-configured component instances or hook usage demonstrations.
 *
 * This component itself does not accept any props, relying solely on its internal
 * `EXAMPLE_COMPONENTS` constant for content. It ensures each example is rendered
 * within its own `ErrorBoundary` to prevent a single example failure from crashing
 * the entire application. Styling is managed using Tailwind CSS classes, assuming
 * Tailwind is loaded via a browser CDN in the consuming HTML.
 *
 * @returns {JSX.Element} The rendered ExampleViewer component, showcasing various examples.
 */
const ExampleViewer = (): JSX.Element => {
  return (
    <div
      className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans antialiased text-gray-800"
    >
      <motion.h1
        className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', damping: 15, stiffness: 100 }}
      >
        Interactive Component Examples
      </motion.h1>

      <motion.div // Changed from `div` to `motion.div`
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
        variants={gridContainerVariants as Variants} // Apply container variants
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {EXAMPLE_COMPONENTS.map((example) => (
            <motion.div
              key={example.id}
              className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
              variants={gridItemVariants as Variants} // Apply item variants
              initial="hidden" // Redundant if parent controls, but explicit for clarity
              animate="show"   // Redundant if parent controls, but explicit for clarity
              exit="exit"      // Ensure exit animation is applied by AnimatePresence
              whileHover={{ translateY: -5, scale: 1.02, transition: { duration: 0.2 } }} // Enhanced whileHover
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 text-gray-900">{example.title}</h2>
                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                  {example.description}
                </p>
              </div>
              <div className="bg-gray-50 p-6 border-t border-gray-200 flex-grow flex items-center justify-center">
                <ErrorBoundary>
                  <example.component />
                </ErrorBoundary>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.footer
        className="mt-20 text-center text-gray-500 text-sm p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p>&copy; {new Date().getFullYear()} ExampleViewer. All rights reserved.</p>
        <p>Built with React, TypeScript, Framer Motion, and Tailwind CSS.</p>
      </motion.footer>
    </div>
  );
};

export default ExampleViewer;