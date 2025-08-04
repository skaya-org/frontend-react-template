import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import CodeBlock from '../CodeBlock/CodeBlock';

/**
 * @constant MAIN_TITLE
 * @description The main heading for the documentation content.
 */
const MAIN_TITLE: string = "Comprehensive Guide to Our Framework";

/**
 * @constant INTRODUCTION_PARAGRAPHS
 * @description An array of paragraphs that serve as the introduction.
 */
const INTRODUCTION_PARAGRAPHS: string[] = [
    "Welcome to the official documentation for our next-generation development framework. This guide provides everything you need to know, from initial setup to advanced customization. Our goal is to empower you to build beautiful, performant, and scalable applications with ease.",
    "This central panel is designed for focused reading. It is the primary scrollable area where you will find detailed explanations, code examples, and best practices. Let's dive in and explore the core concepts."
];

/**
 * @constant INSTALLATION_HEADING
 * @description Subheading for the installation section.
 */
const INSTALLATION_HEADING: string = "Installation";

/**
 * @constant INSTALLATION_TEXT
 * @description Instructional text for the installation process.
 */
const INSTALLATION_TEXT: string = "Getting started is simple. You can add the framework to your project using your favorite package manager. Open your terminal and run the following command:";

/**
 * @constant INSTALLATION_CODE
 * @description The shell command for installing the package.
 */
const INSTALLATION_CODE: string = "npm install my-awesome-framework";

/**
 * @constant USAGE_HEADING
 * @description Subheading for the basic usage section.
 */
const USAGE_HEADING: string = "Basic Usage";

/**
 * @constant USAGE_TEXT
 * @description Instructional text explaining how to use a basic component from the framework.
 */
const USAGE_TEXT: string = "Once installed, you can import components directly into your React files. Here is a simple example of how to use the 'Button' component:";

/**
 * @constant USAGE_CODE_EXAMPLE
 * @description A TSX code example demonstrating basic component usage.
 */
const USAGE_CODE_EXAMPLE: string = `
import React from 'react';
import { Button } from 'my-awesome-framework';

function App() {
  return (
    <div>
      <h1>My Awesome App</h1>
      <Button onClick={() => alert('Button Clicked!')}>
        Click Me
      </Button>
    </div>
  );
}

export default App;
`;

/**
 * @constant ILLUSTRATION_URL
 * @description URL for an illustrative image.
 */
const ILLUSTRATION_URL: string = "https://picsum.photos/seed/documentation/900/400.webp";

/**
 * @constant ILLUSTRATION_ALT
 * @description Alt text for the illustrative image.
 */
const ILLUSTRATION_ALT: string = "Abstract architectural design representing the framework structure";


/**
 * @constant containerVariants
 * @description Variants for the main content container to orchestrate staggered animations for its children.
 */
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

/**
 * @constant itemVariants
 * @description Variants for individual content items (headings, paragraphs, sections) to fade in and slide up gracefully.
 */
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeInOut',
        },
    },
};


/**
 * Renders the main content panel for the documentation page.
 * This component serves as the primary, scrollable view, displaying detailed information,
 * tutorials, and code examples. It is self-contained and fetches no props,
 * ensuring a consistent and static presentation of the core documentation.
 * It features a staggered fade-in animation for its content blocks.
 *
 * @component
 * @returns {JSX.Element} The rendered main content area.
 *
 * @example
 * // In your layout component:
 * // <div className="flex">
 * //   <Sidebar />
 * //   <MainContent />
 * // </div>
 *
 * // Note: It is recommended to wrap the layout containing this component
 * // with an ErrorBoundary to handle any unexpected rendering issues gracefully.
 */
const MainContent = (): JSX.Element => {
    return (
        <main
            className="flex-1 overflow-y-auto bg-white dark:bg-slate-900"
            aria-labelledby="main-content-title"
        >
            <div className="mx-auto max-w-4xl p-6 sm:p-8 md:p-12">
                <motion.article
                    className="prose prose-slate dark:prose-invert max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-500 dark:prose-a:text-sky-400 dark:hover:prose-a:text-sky-300"
                    variants={containerVariants as Variants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1
                        id="main-content-title"
                        className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl"
                        variants={itemVariants as Variants}
                    >
                        {MAIN_TITLE}
                    </motion.h1>

                    {INTRODUCTION_PARAGRAPHS.map((paragraph, index) => (
                        <motion.p
                            key={index}
                            className="text-lg leading-relaxed text-slate-700 dark:text-slate-300"
                            variants={itemVariants as Variants}
                        >
                            {paragraph}
                        </motion.p>
                    ))}

                    <motion.section
                        className="my-10"
                        variants={itemVariants as Variants}
                    >
                        <h2 className="border-b border-slate-200 pb-2 text-3xl font-bold tracking-tight text-slate-800 dark:border-slate-700 dark:text-slate-200">
                            {INSTALLATION_HEADING}
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                            {INSTALLATION_TEXT}
                        </p>
                        <CodeBlock  />
                    </motion.section>

                    <motion.figure
                        className="my-12"
                        variants={itemVariants as Variants}
                    >
                         <img
                            src={ILLUSTRATION_URL}
                            alt={ILLUSTRATION_ALT}
                            className="w-full rounded-lg shadow-xl"
                            width="900"
                            height="400"
                            loading="lazy"
                        />
                         <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                           {ILLUSTRATION_ALT}
                         </figcaption>
                    </motion.figure>

                    <motion.section
                        className="my-10"
                        variants={itemVariants as Variants}
                    >
                        <h2 className="border-b border-slate-200 pb-2 text-3xl font-bold tracking-tight text-slate-800 dark:border-slate-700 dark:text-slate-200">
                            {USAGE_HEADING}
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                            {USAGE_TEXT}
                        </p>
                        <CodeBlock  />
                    </motion.section>
                </motion.article>
            </div>
        </main>
    );
};

export default MainContent;