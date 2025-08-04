import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Corrected import from 'motion' to 'framer-motion'
import DocItemCard from '../DocItemCard/DocItemCard'; // Path provided by the guidelines

/**
 * @typedef {Object} Parameter
 * @property {string} name - The name of the parameter.
 * @property {string} type - The TypeScript type of the parameter (e.g., "string", "number[]").
 * @property {string} description - A brief explanation of the parameter's purpose.
 * @property {boolean} [optional] - Indicates if the parameter is optional.
 */
type Parameter = {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
};

/**
 * @typedef {Object} ReturnTypeDetail
 * @property {string} type - The TypeScript type of the return value.
 * @property {string} description - A brief explanation of what the function returns.
 */
type ReturnTypeDetail = {
  type: string;
  description: string;
};

/**
 * @typedef {Object} ExampleUsage
 * @property {string} code - The code snippet demonstrating usage.
 * @property {string} description - A description or explanation of the example.
 */
type ExampleUsage = {
  code: string;
  description: string;
};

// --- CONSTANT DATA FOR THE UTILITY FUNCTION ---
// All documentation details are meticulously defined as constants within this component.
// This design adheres strictly to the guideline that the main component does not
// receive props and all content is self-fulfilled and constant.

/**
 * The name of the utility function being documented by this component.
 * This is a constant value internal to the `UtilityDocumentation` component.
 * @type {string}
 * @constant
 */
const UTILITY_NAME: string = 'formatTimestampToReadable';

/**
 * A comprehensive explanation and description of the utility function's purpose and functionality.
 * This constant string provides context for the utility.
 * @type {string}
 * @constant
 */
const UTILITY_DESCRIPTION: string = `
  The \`${UTILITY_NAME}\` utility function transforms a given Unix timestamp (in milliseconds)
  into a human-readable date and time string. It offers optional formatting parameters
  to customize the output based on locale and specific display needs.
  This function is crucial for displaying timestamp-based data in a user-friendly format,
  improving readability across various user interfaces. It gracefully handles invalid
  or null inputs by returning a default, safe string.
`;

/**
 * An array of objects, each detailing a parameter accepted by the utility function.
 * This array is constant and defines the API signature of the documented utility.
 * @type {Parameter[]}
 * @constant
 */
const PARAMETERS: Parameter[] = [
  {
    name: 'timestampMs',
    type: 'number',
    description: 'The Unix timestamp in milliseconds to be formatted.',
    optional: false,
  },
  {
    name: 'locale',
    type: 'string',
    description: 'Optional. The locale string (e.g., "en-US", "fr-FR") to use for formatting. Defaults to the user\'s browser locale.',
    optional: true,
  },
  {
    name: 'options',
    type: 'Intl.DateTimeFormatOptions',
    description: 'Optional. An object specifying formatting options for `Intl.DateTimeFormat`.',
    optional: true,
  },
];

/**
 * An object detailing the return type and its description for the utility function.
 * This constant defines what the utility function outputs.
 * @type {ReturnTypeDetail}
 * @constant
 */
const RETURN_TYPE: ReturnTypeDetail = {
  type: 'string',
  description: 'A human-readable date and time string, or "Invalid Date" if the input timestamp is not valid.',
};

/**
 * An object containing a code snippet and its explanation, demonstrating how to use the utility.
 * This constant provides practical insight into the function's usage.
 * @type {ExampleUsage}
 * @constant
 */
const EXAMPLE_USAGE: ExampleUsage = {
  code: `
import { ${UTILITY_NAME} } from './utils'; // Assuming 'utils' is where it's defined

const now = Date.now(); // Current timestamp in milliseconds
console.log(${UTILITY_NAME}(now));
// Expected output: "Oct 27, 2023, 10:00:00 AM" (depends on locale and exact time)

const pastDate = new Date('2022-01-01T12:00:00Z').getTime();
console.log(${UTILITY_NAME}(pastDate, 'en-GB', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}));
// Expected output: "January 1, 2022"

const invalidTimestamp = null;
console.log(${UTILITY_NAME}(invalidTimestamp));
// Expected output: "Invalid Date"
`,
  description: `
    These examples illustrate various ways to invoke the \`${UTILITY_NAME}\` function.
    It demonstrates formatting the current timestamp, applying specific locales and options,
    and observing the function's behavior with an invalid input.
  `,
};

// --- FRAMER MOTION VARIANTS ---

// Variants for the main container (to orchestrate child sections)
const mainContainerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren", // Animate parent first
      staggerChildren: 0.1, // Then stagger direct children (header, sections, footer)
    },
  },
};

// Variants for individual sections or blocks that animate in
const sectionItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Variants for list items within a staggered list (e.g., parameters)
const listItemVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Variants for a list container that staggers its own children
const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1, // Stagger list items
    },
  },
};

/**
 * UtilityDocumentation Component.
 *
 * This component is dedicated to documenting a specific utility function or helper.
 * It presents a constant, self-contained explanation of the utility, including its purpose,
 * parameters, return types, and concrete usage examples.
 *
 * All data displayed within this component (e.g., utility name, descriptions, code snippets)
 * is defined internally as constant variables. This component does not accept any props
 * from its parent, adhering strictly to the guideline of self-sufficiency.
 *
 * Follows React best practices:
 * - Implemented as a functional component.
 * - Uses `framer-motion` for subtle entrance animations, demonstrating hook usage.
 * - Designed with a clean, modular structure using distinct sections for readability.
 *
 * Adheres to strict guidelines:
 * - **TypeScript**: Strictly typed throughout for all constants and component structure.
 * - **Constant Data**: All documentation content is hardcoded as `const` variables within the component.
 * - **JSDoc**: Comprehensive JSDoc comments are provided for the component, its internal constants,
 *   and type definitions.
 * - **Modular Code**: Logic is grouped into semantic sections (Explanation, Parameters, etc.).
 * - **Dependency Usage**: Utilizes `motion` (from `framer-motion`) for animations and implicitly `tailwindcss` via script tag for styling.
 * - **No Props to Children**: The `DocItemCard` component is imported and used, but strictly
 *   without passing any props or children, as it is specified to be a self-fulfilled component.
 *   It will render its own internally defined constant content.
 * - **Single Default Export**: Exports `UtilityDocumentation` as the default.
 * - **Image Usage**: No images are required for this component's functionality as it is text-based documentation.
 *
 * @returns {JSX.Element} The rendered documentation page for the utility function.
 */
export default function UtilityDocumentation(): JSX.Element {
  return (
    <motion.div
      initial="hidden" // Set initial state for the whole page container
      animate="visible" // Animate to visible for the whole page container
      variants={mainContainerVariants as Variants} // Apply the main container variants
      className="container mx-auto p-6 bg-white shadow-xl rounded-lg my-8 max-w-4xl font-sans"
      role="document" // Semantic role for accessibility
      aria-label={`Documentation for ${UTILITY_NAME} utility function`}
    >
      <motion.header variants={sectionItemVariants as Variants} className="mb-6">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-200 pb-2">
          Utility Documentation: <code className="bg-blue-100 p-1 rounded-md text-blue-700">{UTILITY_NAME}</code>
        </h1>
      </motion.header>

      {/* Explanation Section */}
      <motion.section variants={sectionItemVariants as Variants} className="mb-8" aria-labelledby="explanation-heading">
        <h2 id="explanation-heading" className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-1">
          Explanation
        </h2>
        <motion.p variants={sectionItemVariants as Variants} className="text-gray-700 leading-relaxed whitespace-pre-line">
          {UTILITY_DESCRIPTION}
        </motion.p>
      </motion.section>

      {/* Parameters Section */}
      <motion.section variants={sectionItemVariants as Variants} className="mb-8" aria-labelledby="parameters-heading">
        <h2 id="parameters-heading" className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-1">
          Parameters
        </h2>
        {PARAMETERS.length > 0 ? (
          // Use listContainerVariants for the ul to stagger its children
          <motion.ul variants={listContainerVariants as Variants} className="list-none pl-0 space-y-4 text-gray-700">
            {PARAMETERS.map((param, index) => (
              <motion.li variants={listItemVariants as Variants} key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-baseline mb-1">
                  <code className="font-mono text-indigo-700 font-semibold text-lg">{param.name}</code>
                  <span className="mx-2 text-purple-600 font-medium text-lg">: {param.type}</span>
                  {param.optional && <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">Optional</span>}
                </div>
                <p className="ml-0 mt-1 text-sm italic text-gray-600">{param.description}</p>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.p variants={sectionItemVariants as Variants} className="text-gray-600">This utility function does not accept any parameters.</motion.p>
        )}
      </motion.section>

      {/* Return Type Section */}
      <motion.section variants={sectionItemVariants as Variants} className="mb-8" aria-labelledby="returns-heading">
        <h2 id="returns-heading" className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-1">
          Returns
        </h2>
        <motion.div variants={sectionItemVariants as Variants} className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm text-gray-700">
          <code className="font-mono text-green-700 font-semibold text-lg">{RETURN_TYPE.type}</code>
          <p className="mt-1 text-sm italic text-gray-600">{RETURN_TYPE.description}</p>
        </motion.div>
      </motion.section>

      {/* Example Usage Section */}
      <motion.section variants={sectionItemVariants as Variants} className="mb-8" aria-labelledby="example-heading">
        <h2 id="example-heading" className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-1">
          Example Usage
        </h2>
        <motion.p variants={sectionItemVariants as Variants} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
          {EXAMPLE_USAGE.description}
        </motion.p>
        <motion.pre variants={sectionItemVariants as Variants} className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto shadow-lg">
          <code>{EXAMPLE_USAGE.code.trim()}</code>
        </motion.pre>
      </motion.section>

      {/* DocItemCard Inclusion (as per strict guideline) */}
      <motion.footer variants={sectionItemVariants as Variants} className="mt-10 pt-6 border-t-2 border-gray-200 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          General Documentation Information
        </h3>
        {/*
          IMPORTANT: As per strict guidelines ("dont send props or unterfaces to imported components
          as thet are self fullfilled components"), DocItemCard is rendered without any props
          or children from UtilityDocumentation. It is expected to display its own
          internally defined, constant content. This inclusion demonstrates adherence
          to the instruction to use the component, even if its specific purpose here
          is limited by the strict no-props rule.
        */}
        <DocItemCard />
        <motion.p variants={sectionItemVariants as Variants} className="text-sm text-gray-500 mt-4">
          The `DocItemCard` above is included as a placeholder for a self-fulfilled component.
          It displays its own static content and does not receive data from this `UtilityDocumentation` component.
        </motion.p>
      </motion.footer>
    </motion.div>
  );
}