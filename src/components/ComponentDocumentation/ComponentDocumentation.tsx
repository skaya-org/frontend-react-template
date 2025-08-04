import React, { JSX, ErrorInfo, ReactNode } from 'react';
// Correct Framer Motion import as per instruction
import { motion, Variants } from 'framer-motion';
import DocItemCard from '../DocItemCard/DocItemCard';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Card from '../Card/Card';

/**
 * @interface ErrorBoundaryProps
 * @description Defines the props for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  /**
   * @property {ReactNode} children - The child components that the ErrorBoundary will wrap and protect.
   */
  children: ReactNode;
}

/**
 * @interface ErrorBoundaryState
 * @description Defines the state for the ErrorBoundary component.
 */
interface ErrorBoundaryState {
  /**
   * @property {boolean} hasError - Indicates whether an error has been caught by the boundary.
   */
  hasError: boolean;
}

/**
 * @class ErrorBoundary
 * @extends React.Component
 * @description A generic error boundary component to catch JavaScript errors anywhere in its child component tree,
 * log those errors, and display a fallback UI. This prevents the entire application from crashing.
 * It's implemented as a class component as per React's standard for error boundaries using `getDerivedStateFromError` and `componentDidCatch`.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * @property {ErrorBoundaryState} state - The initial state of the ErrorBoundary component.
   */
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  /**
   * @static
   * @method getDerivedStateFromError
   * @param {Error} _error - The error that was thrown.
   * @returns {ErrorBoundaryState} An object to update the state.
   * @description This static method is called after an error has been thrown by a descendant component.
   * It receives the error that was thrown as a parameter and should return a value to update state,
   * specifically setting `hasError` to `true` to trigger the fallback UI.
   */
  public static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  /**
   * @method componentDidCatch
   * @param {Error} error - The error that was caught.
   * @param {ErrorInfo} errorInfo - An object with a `componentStack` property, which holds information about the component that threw the error.
   * @description This method is called after an error has been thrown by a descendant component.
   * It's a good place to log error information to an error reporting service or the console.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
    // In a production application, you would send this error to a logging service (e.g., Sentry, Bugsnag).
  }

  /**
   * @method render
   * @returns {JSX.Element} The fallback UI if an error occurred, otherwise the children components.
   * @description Renders the component. If an error has been caught (`hasError` is `true`),
   * it displays a user-friendly fallback message. Otherwise, it renders its children.
   */
  public render(): JSX.Element {
    if (this.state.hasError) {
      // Custom fallback UI for when an error occurs
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md flex flex-col items-center justify-center">
          <p className="text-xl font-semibold mb-2">Oops! Something went wrong.</p>
          <p className="text-sm">We're sorry for the inconvenience. Please try refreshing the page or contact support.</p>
        </div>
      );
    }

    // Render children if no error
    return this.props.children as JSX.Element;
  }
}

// --- Constant Data for Documentation Content ---

/**
 * @constant {string} COMPONENT_NAME - The human-readable name of the component being documented.
 */
const COMPONENT_NAME: string = "Showcase Component";

/**
 * @constant {string} COMPONENT_DESCRIPTION - A comprehensive description of the component's purpose and functionality.
 * This multiline string provides an overview for users.
 */
const COMPONENT_DESCRIPTION: string = `
The \`${COMPONENT_NAME}\` is a versatile React component designed to showcase various UI elements and their integration.
It serves as a playground for demonstrating common UI patterns, including interactive buttons, input fields, and structured cards.
This component aims to provide clear examples of how to combine basic building blocks into a functional and aesthetically pleasing interface.
It is built with a focus on reusability, modularity, and adherence to modern React best practices.
`;

/**
 * @constant {string} COMPONENT_USAGE - Detailed instructions on how to integrate and use the component within a React application.
 * Includes a code snippet for clarity.
 */
const COMPONENT_USAGE: string = `
To use the \`${COMPONENT_NAME}\`, simply import it into your React application.
As this component is primarily for demonstration, it does not accept any props and renders a predefined set of examples.

\`\`\`tsx
import React from 'react';
import ComponentDocumentation from './path/to/ComponentDocumentation'; // Adjust path as needed

function App() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">My Application Overview</h1>
      {/* The ComponentDocumentation displays a full documentation page */}
      <ComponentDocumentation />
    </div>
  );
}

export default App;
\`\`\`
`;

/**
 * @constant {JSX.Element} EXAMPLE_BASIC_BUTTON - A self-contained documentation section for the `Button` component.
 * It includes a live demo, a description, and a code snippet.
 * Note: `Button` is imported and used without props as it's a self-fulfilled component.
 */
const EXAMPLE_BASIC_BUTTON: JSX.Element = (
  <div title="Basic Button Usage" className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm dark:bg-gray-700 dark:border-gray-600">
    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">A simple, clickable button displaying its default text. This demonstrates basic interaction without custom properties.</p>
    <div className="flex justify-center items-center p-4 bg-gray-50 rounded-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <Button />
    </div>
    <pre className="mt-4 p-3 bg-gray-800 text-white rounded-md text-xs overflow-auto dark:bg-gray-900">
      <code>
{`import Button from '../Button/Button';

// The Button component is self-contained and requires no props.
<Button />`}
      </code>
    </pre>
  </div>
);

/**
 * @constant {JSX.Element} EXAMPLE_BASIC_INPUT - A self-contained documentation section for the `Input` component.
 * It includes a live demo, a description, and a code snippet.
 * Note: `Input` is imported and used without props as it's a self-fulfilled component.
 */
const EXAMPLE_BASIC_INPUT: JSX.Element = (
  <div title="Basic Input Field" className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm dark:bg-gray-700 dark:border-gray-600">
    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">A standard input field for text entry, showcasing default placeholder text. It provides a basic interactive element for data input.</p>
    <div className="flex justify-center items-center p-4 bg-gray-50 rounded-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <Input />
    </div>
    <pre className="mt-4 p-3 bg-gray-800 text-white rounded-md text-xs overflow-auto dark:bg-gray-900">
      <code>
{`import Input from '../Input/Input';

// The Input component is self-contained and requires no props.
<Input />`}
      </code>
    </pre>
  </div>
);

/**
 * @constant {JSX.Element} EXAMPLE_BASIC_CARD - A self-contained documentation section for the `Card` component.
 * It includes a live demo, a description, and a code snippet.
 * Note: `Card` is imported and used without props as it's a self-fulfilled component. It is assumed to use
 * `https://picsum.photos/200/300` or similar for its internal image content.
 */
const EXAMPLE_BASIC_CARD: JSX.Element = (
  <div title="Basic Card Display" className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm dark:bg-gray-700 dark:border-gray-600">
    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">A simple card component displaying predefined content and an image. This is ideal for showcasing information blocks or article previews.</p>
    <div className="flex justify-center items-center p-4 bg-gray-50 rounded-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <Card />
    </div>
    <pre className="mt-4 p-3 bg-gray-800 text-white rounded-md text-xs overflow-auto dark:bg-gray-900">
      <code>
{`import Card from '../Card/Card';

// The Card component is self-contained and requires no props.
<Card />`}
      </code>
    </pre>
  </div>
);

/**
 * @constant {JSX.Element} EXAMPLE_COMBINED_UI - A self-contained documentation section demonstrating a combination
 * of `Button`, `Input`, and `Card` components to form a small UI segment.
 */
const EXAMPLE_COMBINED_UI: JSX.Element = (
  <div title="Combined UI Example" className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm dark:bg-gray-700 dark:border-gray-600">
    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">This example showcases how multiple basic components can be arranged to form a small, interactive UI segment, demonstrating typical layout patterns.</p>
    <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-gray-50 rounded-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <Input />
      <Button />
      <Card />
    </div>
    <pre className="mt-4 p-3 bg-gray-800 text-white rounded-md text-xs overflow-auto dark:bg-gray-900">
      <code>
{`import Button from '../Button/Button';
import Input from '../Input/Input';
import Card from '../Card/Card';

// A simple vertical stack of the basic components.
<div className="flex flex-col space-y-4">
  <Input />
  <Button />
  <Card />
</div>`}
      </code>
    </pre>
  </div>
);

// --- Framer Motion Variants Definitions ---

// Variants for the main container to orchestrate child animations
const mainContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren", // Children start animating after the parent
      staggerChildren: 0.1,   // Stagger direct children by 0.1 seconds
      delayChildren: 0.2,     // Delay start of children animations by 0.2 seconds
    },
  },
};

// Variants for individual section items (DocItemCards)
const sectionItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

// Variants for the main title
const headingVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Variants for the footer
const footerVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};


/**
 * @function ComponentDocumentation
 * @description A React functional component designed to display comprehensive documentation for a single React component.
 * It presents constant descriptions, usage guidelines, and multiple examples using predefined internal data.
 * This component does not accept any props, ensuring it is entirely self-contained and consistent in its presentation.
 * It integrates with `framer-motion` for subtle entrance animations on the main content container and
 * includes an `ErrorBoundary` for robust error handling, preventing application crashes from unexpected issues within its children.
 *
 * The documentation is structured into distinct sections using `DocItemCard` components for clarity:
 * - **Overview:** A detailed description of the component's purpose.
 * - **Usage:** Instructions and code snippets on how to integrate the component.
 * - **Examples:** Live demonstrations and code snippets for various component uses and combinations,
 *   featuring `Button`, `Input`, and `Card` components.
 *
 * @returns {JSX.Element} A React element representing the complete documentation page for the example component.
 */
const ComponentDocumentation = (): JSX.Element => {
  return (
    <ErrorBoundary>
      {/* Main container with framer-motion animation for a smooth entrance */}
      {/* It orchestrates the entrance of its direct children (title, section cards, footer) */}
      <motion.div
        variants={mainContainerVariants as Variants}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-6 md:p-8 lg:p-10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen font-sans shadow-xl rounded-lg"
      >
        {/* Page Title with animation */}
        <motion.h1
          variants={headingVariants as Variants}
          className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-8 pb-4 border-b-2 border-blue-200 dark:border-blue-700 text-center"
        >
          Component Documentation: <span className="text-gray-800 dark:text-gray-200">{COMPONENT_NAME}</span>
        </motion.h1>

        {/* Overview Section - wrapped for animation */}
        <motion.div variants={sectionItemVariants as Variants}>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line p-4">
              {COMPONENT_DESCRIPTION}
            </p>
          <DocItemCard/>
        </motion.div>

        {/* Usage Guidelines Section - wrapped for animation */}
        <motion.div variants={sectionItemVariants as Variants}>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 px-4 pt-4">How to use</h3>
            <pre className="bg-gray-800 dark:bg-gray-900 text-white p-4 rounded-b-lg shadow-inner overflow-auto text-sm md:text-base">
              <code>
                {COMPONENT_USAGE}
              </code>
            </pre>
        </motion.div>

        {/* Examples Section - wrapped for animation */}
        <motion.div variants={sectionItemVariants as Variants}>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 px-4 pt-4">Live Demos & Code Snippets</h3>
            {/* This inner motion.div orchestrates the stagger for the individual example cards */}
            <motion.div
              variants={mainContainerVariants as Variants} // Re-use main container variant for nested staggering
              initial="hidden" // Ensure animation starts for children of this specific motion.div
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-4"
            >
              {/* Each example is wrapped in a motion.div to participate in the staggering */}
              <motion.div variants={sectionItemVariants as Variants}>{EXAMPLE_BASIC_BUTTON}</motion.div>
              <motion.div variants={sectionItemVariants as Variants}>{EXAMPLE_BASIC_INPUT}</motion.div>
              <motion.div variants={sectionItemVariants as Variants}>{EXAMPLE_BASIC_CARD}</motion.div>
              <motion.div variants={sectionItemVariants as Variants}>{EXAMPLE_COMBINED_UI}</motion.div>
            </motion.div>
          <DocItemCard/>
        </motion.div>

        {/* Footer with animation */}
        <motion.footer
          variants={footerVariants as Variants}
          className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          Documentation for {COMPONENT_NAME} &copy; {new Date().getFullYear()}
        </motion.footer>
      </motion.div>
    </ErrorBoundary>
  );
};

export default ComponentDocumentation;