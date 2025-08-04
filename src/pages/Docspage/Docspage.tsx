import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Import Framer Motion components and types

// Import required components. These components are self-fulfilled and do not require props.
import Navbar from "src/components/Navbar/Navbar";
import DocSidebar from "src/components/DocSidebar/DocSidebar";
import DocContent from "src/components/DocContent/DocContent";

/**
 * @description Reusable page layout with optional title and content
 * PRESERVED: This is the original component and remains unchanged.
 */
export const Page: React.FC<{
  children?: React.ReactNode;
}> = ({
  children,
}) => {
  return (
    <div>
      Default Page Content
      {children}
    </div>
  );
};

// --- Framer Motion Variants Definitions ---

// Variants for the overall DocumentationPage container
// Orchestrates the animation of its direct children (Navbar and main content wrapper)
const pageContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between the animation of Navbar and mainContentWrapper
      delayChildren: 0.2,    // Initial delay before the first child animation starts
    },
  },
};

// Variants for the Navbar component
// Slides down from the top and fades in
const navbarVariants: Variants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100, // Provides a bouncy effect
      damping: 20,    // Controls the amount of bounce
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

// Variants for the main content area's flex container (holds sidebar and content)
// This element itself fades in and slides up slightly, then orchestrates its own children
const mainContentWrapperVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren", // Animate this wrapper before its children (sidebar and content)
      staggerChildren: 0.2,   // Stagger delay between Sidebar and main content
      duration: 0.5,
      ease: "easeOut"
    },
  },
};

// Variants for the DocSidebar component
// Slides in from the left and fades in
const sidebarVariants: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.7,
      ease: "easeOut"
    }
  },
};

// Variants for the DocContent area (the 'main' HTML element)
// Slides in from the right and fades in
const docContentVariants: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.7,
      ease: "easeOut"
    }
  },
};

/**
 * @description The main top-level container component for the entire documentation website.
 * It integrates the global Navbar, a DocSidebar for navigation on the left,
 * and a DocContent area on the right to display the selected documentation.
 * All data displayed by its child components (Navbar, DocSidebar, DocContent) is constant and pre-defined within them.
 */
export const DocumentationPage: React.FC = (): JSX.Element => {
  return (
    // Apply page container variants to the outermost div
    <motion.div
      className="min-h-screen flex flex-col bg-gray-100 text-gray-800"
      variants={pageContainerVariants as Variants}
      initial="hidden" // Initial state before animation
      animate="visible" // Animate to this state on component mount
    >
      {/* Global Navbar component */}
      {/* Wrap Navbar in a motion.div to apply its variants */}
      <motion.div variants={navbarVariants as Variants}>
        <Navbar />
      </motion.div>

      {/* Main content area: Flex container for Sidebar and Content */}
      {/* Apply main content wrapper variants to this div */}
      <motion.div
        className="flex flex-1 overflow-hidden"
        variants={mainContentWrapperVariants as Variants}
      >
        {/* DocSidebar for navigation */}
        {/* Wrap DocSidebar in a motion.div to apply its variants */}
        <motion.div variants={sidebarVariants as Variants}>
          <DocSidebar />
        </motion.div>

        {/* DocContent area for displaying documentation */}
        {/* Use motion.main for the main content area and apply its variants */}
        <motion.main
          className="flex-1 p-6 overflow-y-auto bg-white"
          variants={docContentVariants as Variants}
        >
          <DocContent />
        </motion.main>
      </motion.div>
    </motion.div>
  );
};

// PRESERVED: The original default export remains unchanged.
export default DocumentationPage;