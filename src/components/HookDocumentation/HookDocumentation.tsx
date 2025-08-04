import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Import Variants
import DocItemCard from '../DocItemCard/DocItemCard';

/**
 * @typedef {object} HookParameter
 * @property {string} name - The name of the parameter.
 * @property {string} type - The TypeScript type signature of the parameter.
 * @property {string} description - A detailed description of the parameter's purpose and usage.
 */

/**
 * @typedef {object} HookReturnValue
 * @property {string} name - The name of the value returned by the hook (e.g., 'state', 'setState').
 * @property {string} type - The TypeScript type signature of the returned value.
 * @property {string} description - A detailed description of the returned value's purpose and behavior.
 */

/**
 * @typedef {object} UsageExample
 * @property {string} title - A descriptive title for the code example.
 * @property {string} code - The actual code snippet demonstrating the hook's usage.
 * @property {string} notes - Additional notes or explanations for the example, highlighting key concepts.
 */

/**
 * @typedef {object} ApiDetail
 * @property {string} heading - The heading for a specific API detail or consideration.
 * @property {string} content - The detailed content, which can include HTML for rich text like images.
 */

/**
 * @typedef {object} HookDocumentationData
 * @property {string} name - The name of the React hook (e.g., 'useState', 'useEffect').
 * @property {string} description - A concise overview of what the hook does.
 * @property {string} syntax - The typical syntax for declaring and using the hook.
 * @property {HookParameter[]} parameters - An array of parameters the hook accepts.
 * @property {HookReturnValue[]} returnValues - An array of values the hook returns.
 * @property {UsageExample[]} usageExamples - An array of practical usage scenarios with code examples.
 * @property {ApiDetail[]} apiDetails - Additional, in-depth API details, considerations, and best practices.
 */

/**
 * Constant data for the `useState` hook documentation.
 * This data is hardcoded within the component to fulfill the requirement
 * that the component is self-fulfilled and does not rely on external props
 * for its core content. This structure allows for comprehensive documentation
 * for a specific hook.
 * @type {HookDocumentationData}
 */
const USE_STATE_DOC: any = {
  name: 'useState',
  description: 'A React Hook that lets you add a state variable to your component. It returns a stateful value and a function to update it, triggering re-renders upon state changes.',
  syntax: 'const [state, setState] = useState(initialState);',
  parameters: [
    {
      name: 'initialState',
      type: 'any | () => any',
      description: 'The initial state value. It can be a value of any type (number, string, boolean, object, array, null, undefined), or a function that returns the initial value (for lazy initialization). If it\'s a function, it will only execute once during the component\'s initial render.'
    }
  ],
  returnValues: [
    {
      name: 'state',
      type: 'any',
      description: 'The current state value. During the first render, this will be the `initialState` you provided. After updates, it will reflect the latest value.'
    },
    {
      name: 'setState',
      type: '(newState: any | (prevState: any) => any) => void',
      description: 'A state setter function. Call it with the new state value to queue a re-render of the component. If you pass a function (updater function), it will receive the previous state as its argument, which is recommended for updates based on the current state.'
    }
  ],
  usageExamples: [
    {
      title: 'Basic Counter Implementation',
      code: `
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <p className="text-lg font-medium text-gray-800 mb-3">You clicked {count} times</p>
      <button
        onClick={() => setCount(count + 1)}
        className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Click me
      </button>
    </div>
  );
}
      `,
      notes: 'This example showcases the fundamental use of `useState` to manage a numeric `count`. Clicking the button updates the state and re-renders the component to display the new value.'
    },
    {
      title: 'Lazy Initialization for Performance Optimization',
      code: `
import React, { useState } from 'react';

function DataLoader() {
  // The function passed to useState runs only once on initial render.
  // This is useful for expensive computations that should not re-run on every render.
  const [data, setData] = useState(() => {
    console.log('Performing expensive data loading...'); // This message appears only once
    // Simulate an expensive computation or initial data fetch
    const initialData = Array.from({ length: 10000 }, (_, i) => \`Item \${i}\`).join(', ');
    return initialData.substring(0, 100) + '...'; // Return a truncated string for display
  });

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Loaded Data:</h3>
      <p className="text-gray-700 mb-4 font-mono text-sm">{data}</p>
      <button
        onClick={() => setData(prev => prev + '.')} // Example update
        className="px-5 py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        Append Data
      </button>
    </div>
  );
}
      `,
      notes: 'When `initialState` involves heavy computation, passing a function ensures it runs only once during the initial mount, preventing redundant calculations on subsequent re-renders and improving performance.'
    },
    {
      title: 'Updating State Based on Previous State (Functional Updates)',
      code: `
import React, { useState } from 'react';

function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false);

  // Use the functional update form when the new state depends on the previous state.
  const toggle = () => {
    setIsOn(prevIsOn => !prevIsOn);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <p className="text-lg font-medium text-gray-800 mb-3">Status: <span className={\`font-bold \${isOn ? 'text-green-600' : 'text-red-600'}\`}>{isOn ? 'ON' : 'OFF'}</span></p>
      <button
        onClick={toggle}
        className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Toggle Power
      </button>
    </div>
  );
}
      `,
      notes: 'For updates that rely on the current state (like toggling a boolean or incrementing a number), always use the functional update form of `setState`. This ensures you are working with the most recent state value, preventing issues with stale closures or batched updates.'
    }
  ],
  apiDetails: [
    {
      heading: 'State Updates are Asynchronous and Batched',
      content: 'React may batch multiple `setState` calls for performance. This means the state update might not be immediately reflected after calling `setState`. If you need to perform an action based on the *newly updated* state, use `useEffect` or the functional update form of `setState`.'
    },
    {
      heading: 'Immutability of State',
      content: 'When updating state that is an object or an array, *always create a new object/array*. Mutating the existing state directly will not trigger a re-render and can lead to unexpected behavior and hard-to-debug issues. Use spread syntax (`...`) or array methods (`map`, `filter`) to create new copies.'
    },
    {
      heading: 'When to Use useState vs. useRef',
      content: 'Use `useState` for values that, when changed, should trigger a re-render of the component and are part of the component\'s observable output. Use `useRef` for values that need to persist across renders but whose changes should *not* trigger a re-render, typically for mutable values that are not directly involved in rendering (e.g., a DOM element reference, a timer ID, or any value that acts as an instance variable).'
    },
    {
      heading: 'Visual Example (Placeholder)',
      content: '<img src="https://picsum.photos/400/250.webp" alt="Conceptual image related to React state management" className="rounded-lg shadow-md mt-4 max-w-full h-auto" loading="lazy" />'
    }
  ]
};

// --- Framer Motion Variants Definitions ---

// Main container animation
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      when: 'beforeChildren', // Animate parent first
      staggerChildren: 0.15, // Stagger main sections within the container
    },
  },
};

// Variants for main headings (H1, H2, and top description P)
const headerAndDescriptionVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Variants for the content within each DocItemCard section
// This allows the section itself to fade in and then stagger its immediate children
const sectionContentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.08, // Stagger items (e.g., list items, example cards) inside this section
      delayChildren: 0.1, // Small delay before children start animating
    },
  },
};

// Variants for individual list items (parameters, return values) and the syntax block
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// Variants for each usage example card
const exampleCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Variants for each individual API detail item
const apiDetailItemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/**
 * HookDocumentation component props.
 * This interface is intentionally empty as per the strict guideline:
 * "Always use constant data so that main components never have to send props."
 * This component's content is entirely self-contained and hardcoded.
 */
interface HookDocumentationProps {}

/**
 * `HookDocumentation` React component.
 *
 * This component is dedicated to displaying comprehensive documentation for a single React hook.
 * It strictly adheres to the provided guidelines, featuring constant, self-contained data
 * for the `useState` hook, avoiding any external props for its core content.
 *
 * It provides:
 * - A clear overview and syntax of the hook.
 * - Detailed descriptions of its parameters and return values.
 * - Practical usage scenarios with well-commented code examples.
 * - Important API details and best practices for effective use.
 *
 * @component
 * @param {HookDocumentationProps} _props - No props are used by this component as its content is constant.
 * @returns {JSX.Element} The rendered documentation page for a React hook.
 *
 * @example
 * ```tsx
 * // Example usage in a parent component (e.g., App.tsx)
 * import HookDocumentation from './HookDocumentation';
 *
 * function MyApplication() {
 *   return (
 *     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 md:p-10">
 *       <HookDocumentation />
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Styling**: This component uses Tailwind CSS for styling. Ensure the Tailwind CSS CDN script
 * is loaded in your `public/index.html` or equivalent file, or that Tailwind is set up in your build process:
 * ```html
 * <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
 * ```
 *
 * **Error Boundaries**: For a display-only component with static data like `HookDocumentation`,
 * internal error boundaries are typically not necessary, as it performs no complex operations
 * prone to runtime errors. Best practice dictates that a component like this should be wrapped
 * by an `ErrorBoundary` component higher up in the application's component tree. This ensures
 * that if any unexpected error occurs (e.g., during rendering of its children or external dependencies),
 * it is gracefully handled without crashing the entire application.
 *
 * **`DocItemCard` Usage**: The use of `DocItemCard` follows the principle of "self-fulfilled components"
 * by not passing data-specific props. It is assumed that `DocItemCard` functions as a presentational
 * wrapper that takes `children`, allowing `HookDocumentation` to structure its constant content
 * within the defined card layout without passing explicit data props *to* `DocItemCard` itself.
 */
const HookDocumentation = (_props: HookDocumentationProps): JSX.Element => {
  return (
    <motion.div
      variants={containerVariants as Variants} // Apply main container animation
      initial="hidden"
      animate="visible"
      className="container mx-auto p-4 md:p-8 bg-white rounded-xl shadow-2xl max-w-5xl my-8 border border-gray-100"
    >
      <motion.h1
        variants={headerAndDescriptionVariants as Variants} // Animate heading
        className="text-4xl md:text-5xl font-extrabold text-center text-indigo-800 mb-8 leading-tight tracking-tight"
      >
        React Hook: <span className="text-indigo-600">{USE_STATE_DOC.name}</span>
      </motion.h1>

      <motion.p
        variants={headerAndDescriptionVariants as Variants} // Animate description
        className="text-lg md:text-xl text-center text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed"
      >
        {USE_STATE_DOC.description}
      </motion.p>

      {/* API Details Section */}
      <DocItemCard/>
        <motion.div variants={sectionContentVariants as Variants}> {/* Wrap content for section animation */}
          <motion.h2 variants={headerAndDescriptionVariants as Variants} className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-300">
            API Details
          </motion.h2>
          <motion.div variants={itemVariants as Variants} className="mb-8 bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Syntax</h3>
            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm md:text-base font-mono shadow-inner">
              <code>{USE_STATE_DOC.syntax}</code>
            </pre>
          </motion.div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Parameters</h3>
            <motion.ul variants={sectionContentVariants as Variants} className="list-disc pl-6 space-y-4"> {/* Stagger parameter list items */}
              {USE_STATE_DOC.parameters.map((param, index) => (
                <motion.li variants={itemVariants as Variants} key={index} className="text-gray-700 leading-relaxed">
                  <strong className="text-indigo-600 font-medium">{param.name}:</strong>{' '}
                  <code className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-sm font-mono border border-indigo-200">
                    {param.type}
                  </code>{' '}
                  - {param.description}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>

      {/* Return Values Section */}
        <motion.div variants={sectionContentVariants as Variants}> {/* Wrap content for section animation */}
          <motion.h2 variants={headerAndDescriptionVariants as Variants} className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-300">
            Return Values
          </motion.h2>
          <motion.ul variants={sectionContentVariants as Variants} className="list-disc pl-6 space-y-4"> {/* Stagger return value list items */}
            {USE_STATE_DOC.returnValues.map((returnValue, index) => (
              <motion.li variants={itemVariants as Variants} key={index} className="text-gray-700 leading-relaxed">
                <strong className="text-indigo-600 font-medium">{returnValue.name}:</strong>{' '}
                <code className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-sm font-mono border border-indigo-200">
                  {returnValue.type}
                </code>{' '}
                - {returnValue.description}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      <DocItemCard/>

      {/* Usage Scenarios & Examples Section */}
      <DocItemCard/>
        <motion.div variants={sectionContentVariants as Variants}> {/* Wrap content for section animation */}
          <motion.h2 variants={headerAndDescriptionVariants as Variants} className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-300">
            Usage Scenarios & Examples
          </motion.h2>
          <motion.div variants={sectionContentVariants as Variants} className="space-y-12"> {/* Stagger example cards */}
            {USE_STATE_DOC.usageExamples.map((example, index) => (
              <motion.div
                variants={exampleCardVariants as Variants} // Animate each example card
                key={index}
                className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 transform hover:scale-[1.005] transition-transform duration-200"
              >
                <h3 className="text-2xl font-semibold text-gray-700 mb-5 flex items-center">
                  <span className="text-indigo-500 mr-3 text-2xl">#{(index + 1).toString().padStart(2, '0')}</span> {example.title}
                </h3>
                <pre className="bg-gray-800 text-gray-200 p-5 rounded-lg overflow-x-auto text-sm md:text-base mb-5 font-mono leading-relaxed shadow-inner">
                  <code>{example.code.trim()}</code>
                </pre>
                <p className="text-gray-700 leading-relaxed">
                  <strong className="text-indigo-600">Notes:</strong> {example.notes}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      {/* Additional API Details Section */}
      <DocItemCard/>
        <motion.div variants={sectionContentVariants as Variants}> {/* Wrap content for section animation */}
          <motion.h2 variants={headerAndDescriptionVariants as Variants} className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-300">
            Further API Details & Considerations
          </motion.h2>
          <motion.div variants={sectionContentVariants as Variants} className="space-y-8"> {/* Stagger API detail items */}
            {USE_STATE_DOC.apiDetails.map((detail, index) => (
              <motion.div variants={apiDetailItemVariants as Variants} key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">{detail.heading}</h3>
                {/* Using dangerouslySetInnerHTML to render HTML content within the string.
                    This is generally used with caution to prevent XSS attacks, but is safe here
                    as the content is constant and internally controlled. */}
                <div
                  className="text-gray-700 leading-relaxed text-base md:text-lg space-y-3"
                  dangerouslySetInnerHTML={{ __html: detail.content }}
                ></div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      <motion.div
        variants={itemVariants as Variants} // Simple fade-in for the footer
        className="text-center text-gray-500 mt-12 text-sm leading-relaxed"
      >
        <p>&copy; {new Date().getFullYear()} React Hook Documentation. All rights reserved.</p>
        <p className="mt-2">
          Documentation for `useState` hook. Learn more about React Hooks at{' '}
          <a href="https://react.dev/reference/react/hooks" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">react.dev</a>.
        </p>
        <p className="mt-2">
          Animations powered by{' '}
          <a href="https://www.framer.com/motion/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">Framer Motion</a>.
        </p>
        <p className="mt-2">
          Placeholder images from{' '}
          <a href="https://picsum.photos/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">Picsum Photos</a>.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default HookDocumentation;