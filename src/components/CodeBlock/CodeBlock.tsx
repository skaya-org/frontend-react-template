import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Import motion and Variants

/**
 * Defines the structure for a single code snippet to be displayed within the CodeBlock component.
 * @typedef {object} CodeSnippet
 * @property {string} id - A unique identifier for the code snippet.
 * @property {string} language - The programming language of the snippet (e.g., 'typescript', 'css', 'html'). This can be used for descriptive labels.
 * @property {string} title - A descriptive title for the code snippet, displayed above the code.
 * @property {string} code - The actual code string content to be displayed.
 */
interface CodeSnippet {
  id: string;
  language: string;
  title: string;
  code: string;
}

/**
 * An array of constant code examples for documentation purposes.
 * This data is internal to the `CodeBlock` component and is not passed via props,
 * ensuring the component is self-contained and always renders predefined content.
 * Each object represents a different code snippet with its unique ID,
 * programming language, a descriptive title, and the actual code content.
 */
const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: '1',
    language: 'typescript',
    title: 'TypeScript Functional Component',
    code: `import React, { FC, ReactNode } from 'react';

/**
 * Props for the MyExampleComponent.
 * @typedef {object} MyExampleComponentProps
 * @property {ReactNode} children - The content to be rendered inside the component.
 */
interface MyExampleComponentProps {
  children: ReactNode;
}

/**
 * MyExampleComponent is a simple functional component demonstrating basic structure.
 * It's designed to accept children and render them within a styled container.
 *
 * @param {MyExampleComponentProps} props - The component's props, including children.
 * @returns {JSX.Element} A React JSX element.
 */
const MyExampleComponent: FC<MyExampleComponentProps> = ({ children }) => {
  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
        Hello from My Component!
      </h3>
      {children}
    </div>
  );
};

export default MyExampleComponent;
`,
  },
  {
    id: '2',
    language: 'css',
    title: 'Tailwind CSS Utility Classes',
    code: `/* Example of common Tailwind CSS utility classes */

.container-flex {
  @apply flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg;
}

.button-primary {
  @apply px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg
          hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75
          transition-colors duration-200 ease-in-out;
}

.text-muted {
  @apply text-gray-500 dark:text-gray-400 text-sm;
}
`,
  },
  {
    id: '3',
    language: 'html',
    title: 'Basic HTML Structure with Tailwind',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Page</title>
    <!-- Tailwind CSS via CDN for browser environments -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="font-sans antialiased text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
    <header class="bg-blue-600 p-4 text-white shadow-md">
        <h1 class="text-3xl font-bold">Welcome to My Site</h1>
    </header>
    <main class="container mx-auto p-6 mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <p class="text-lg mb-4">This is a basic HTML page styled with Tailwind CSS.</p>
        <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Click Me
        </button>
    </main>
    <footer class="text-center p-4 mt-8 text-gray-600 dark:text-gray-400">
        &copy; 2023 All rights reserved.
    </footer>
</body>
</html>
`,
  },
  {
    id: '4',
    language: 'json',
    title: 'Sample JSON Data Structure',
    code: `{
  "userId": "usr_abc123",
  "username": "developer_pro",
  "email": "dev.pro@example.com",
  "isActive": true,
  "roles": [
    "admin",
    "editor"
  ],
  "lastLogin": "2023-10-27T10:30:00Z",
  "preferences": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "sms": false
    }
  },
  "addresses": [
    {
      "type": "billing",
      "street": "123 Dev Street",
      "city": "Codington",
      "zipCode": "10001"
    },
    {
      "type": "shipping",
      "street": "456 Byte Avenue",
      "city": "Scriptsville",
      "zipCode": "90210"
    }
  ]
}`,
  },
];

// Define animation variants for the main container
const containerVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.15, // Stagger the appearance of child items
      delayChildren: 0.2 // Delay the start of child animations slightly
    },
  },
};

// Define animation variants for each code snippet item
const itemVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  whileHover: {
    scale: 1.005, // Slight scale up on hover
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // Add a subtle shadow
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// Define animation variants for the main heading
const headingVariants: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: 0.1 // Appear slightly before the main content starts staggering
    },
  },
};

/**
 * `CodeBlock` is a reusable React component designed to display
 * predefined constant code snippets with basic visual styling.
 * It strictly adheres to the requirement of not accepting any props,
 * making it a self-sufficient component for documentation purposes.
 *
 * All code examples are hardcoded internally within the `CODE_SNIPPETS` constant.
 * This ensures consistency and fulfills the requirement of using constant data
 * that the main component does not need to receive via props.
 *
 * The component applies basic visual "syntax highlighting" by utilizing Tailwind CSS
 * classes to style the code blocks with a dark background, monospaced font, and
 * a light text color. No external syntax highlighting libraries are used,
 * conforming to the strict dependency guidelines.
 *
 * While error boundaries are generally good practice, for a component that
 * exclusively renders static, internally defined data, the need for an
 * explicit internal error boundary is minimal. Any rendering issues would
 * typically be caught by a higher-level error boundary wrapping this component
 * in the application's tree.
 *
 * @returns {JSX.Element} A React JSX element representing a collection of styled code blocks.
 */
const CodeBlock = (): JSX.Element => {
  return (
    <motion.div
      className="flex flex-col gap-8 p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-950 rounded-lg shadow-inner border border-gray-200 dark:border-gray-800"
      variants={containerVariants as Variants} // Apply container animation variants
      initial="initial" // Set initial state
      animate="animate" // Animate to final state
    >
      <motion.h2
        className="text-3xl font-extrabold text-gray-800 dark:text-white mb-4 text-center"
        variants={headingVariants as Variants} // Apply heading animation variants
      >
        Component Code Examples
      </motion.h2>
      {CODE_SNIPPETS.map((snippet: CodeSnippet) => (
        <motion.div
          key={snippet.id}
          className="bg-gray-800 dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
          // Removed original Tailwind CSS `transform hover:scale-[1.005] transition-transform duration-200 ease-in-out`
          // as Framer Motion's whileHover will handle this more robustly.
          variants={itemVariants as Variants} // Apply item animation variants
          whileHover="whileHover" // Apply hover animation from variants
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-700 dark:bg-gray-850 px-4 py-3 border-b border-gray-600 dark:border-gray-700">
            <span className="text-xl font-semibold text-gray-200 dark:text-gray-100 mb-2 sm:mb-0">
              {snippet.title}
            </span>
            <span className="text-sm font-mono text-gray-400 dark:text-gray-500 uppercase bg-gray-600 dark:bg-gray-700 px-3 py-1 rounded-md">
              {snippet.language}
            </span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code className="text-green-300 font-mono block whitespace-pre">
              {snippet.code}
            </code>
          </pre>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CodeBlock;