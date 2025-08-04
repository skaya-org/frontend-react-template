import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// Imported Components
import Navbar from '../Navbar/Navbar';
import LeftSidebar from '../LeftSidebar/LeftSidebar';
import MainContent from '../MainContent/MainContent';
import RightSidebar from '../RightSidebar/RightSidebar';
import Pagination from '../Pagination/Pagination';

/**
 * @file DocumentationPage.tsx
 * @description This file defines the main layout component for the entire documentation website.
 * @author Senior Fullstack/TypeScript Developer
 * @version 1.1.0
 */

/**
 * @module components/DocumentationPage
 * @description The main layout component that structures the entire documentation page.
 * It establishes the overall grid, placing the Navbar at the top, followed by a
 * three-column layout containing the LeftSidebar, the MainContent (with Pagination
 * at its bottom), and the RightSidebar. It orchestrates the assembly and animated
 * entrance of all visual elements.
 */

// Animation variants for the page elements
const navbarVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

const gridContainerVariants: Variants = {
  hidden: {
    opacity: 1, // The container itself is not animated, it just orchestrates
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger the animation of each column
      delayChildren: 0.2, // Start this animation shortly after the navbar
    },
  },
};

const gridItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20, // Start slightly below their final position
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * The `DocumentationPage` component serves as the structural backbone of the documentation site.
 * It is a self-contained component that requires no props, as it uses constant data
 * sourced from its child components. It defines a responsive layout that adapts to various
 * screen sizes, ensuring a consistent and user-friendly experience across devices.
 *
 * On large screens, it presents a three-column view:
 * 1.  **Left Sidebar**: For navigating between documentation topics.
 * 2.  **Main Content**: For displaying the primary article content.
 * 3.  **Right Sidebar**: For 'on this page' navigation, linking to sections within the current article.
 *
 * On smaller screens (e.g., tablets and mobile), the sidebars are hidden to maximize space
 * for the main content, with navigation typically handled by a mobile-friendly menu within the `Navbar`.
 *
 * This version incorporates Framer Motion to animate the entrance of the main layout blocks,
 * providing a smooth and engaging user experience on page load.
 *
 * @component
 * @returns {JSX.Element} The fully structured and rendered documentation page.
 * @example
 * // In your main App component:
 * import DocumentationPage from './components/DocumentationPage/DocumentationPage';
 *
 * function App() {
 *   return <DocumentationPage />;
 * }
 */
const DocumentationPage: React.FC = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-white font-sans dark:bg-gray-950">
      <motion.div
        variants={navbarVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        <Navbar />
      </motion.div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="lg:grid lg:grid-cols-[18rem_1fr_16rem] lg:gap-12"
          variants={gridContainerVariants as Variants}
          initial="hidden"
          animate="visible"
        >
          <motion.aside
            className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto py-8 pr-4 lg:block"
            variants={gridItemVariants as Variants}
          >
            <div className="w-full">
              <LeftSidebar />
            </div>
          </motion.aside>

          <motion.main
            className="min-w-0 py-8"
            variants={gridItemVariants as Variants}
          >
            <article>
              <MainContent />
            </article>
            <footer className="mt-12">
              <Pagination />
            </footer>
          </motion.main>

          <motion.aside
            className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto py-8 pl-4 lg:block"
            variants={gridItemVariants as Variants}
          >
            <div className="w-full">
              <RightSidebar />
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentationPage;