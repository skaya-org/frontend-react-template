// New component Card
import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Corrected import to standard Framer Motion package

// Constant data for the Card component.
// Per instructions, main components never send props, and components are self-fulfilled.
// This means the Card's content is internal and constant.
const CARD_CONTENT_DATA = {
  imageUrl: "https://picsum.photos/400/250.webp?random=2", // Random image for demonstration
  title: "Insightful Discoveries",
  description: "Explore a curated collection of knowledge and insights, presented in a clear and visually appealing format. This block is designed to be self-contained and ready to use.",
  callToAction: "Explore Now"
};

// --- Framer Motion Variants ---

// Variants for the main container Card component
const cardContainerVariants: Variants = {
  // Initial state for the card (hidden and slightly moved down)
  hidden: { opacity: 0, y: 20 },
  // Animated state for the card (visible and in original position)
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren", // Ensures the container animates in before its children
      staggerChildren: 0.15, // Staggers the animation of child elements by 0.15 seconds
      duration: 0.6,        // Duration for the container's own fade-in/lift
      ease: "easeOut"       // Easing function for a smooth finish
    }
  }
};

// Variants for individual items within the Card (image, title, description, button)
const cardItemVariants: Variants = {
  // Initial state for each item (hidden and slightly moved down)
  hidden: { opacity: 0, y: 20 },
  // Animated state for each item (visible and in original position)
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4, // Duration for each item's individual animation
      ease: "easeOut"
    }
  }
};

/**
 * Card Component
 * Now serving as a base container for various documentation sections.
 * It provides a consistent visual structure and layout for displaying self-contained content blocks.
 * Its content is entirely self-fulfilled using constant internal data, adhering to strict guidelines.
 *
 * Adheres to strict guidelines:
 * - No interfaces or props are asked from parent components.
 * - Uses constant internal data for its content.
 * - Maintains specified styling and layout.
 * - Utilizes `motion` for a subtle animation as per allowed dependencies.
 * - Preserves all existing functionality and TypeScript code.
 */
function Card(): JSX.Element {
  return (
    // Main motion.div for the card container
    <motion.div
      variants={cardContainerVariants as Variants} // Apply the defined container variants
      initial="hidden"                             // Set the initial animation state
      animate="visible"                            // Animate to the visible state on mount
      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,0,0,0.1)" }} // Animate scale and shadow on hover
      transition={{ type: "spring", stiffness: 300, damping: 20 }} // Smooth spring transition for hover effect
      className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto my-8 border border-gray-100"
    >
      {/* Motion.img for the card image */}
      <motion.img
        variants={cardItemVariants as Variants} // Apply item variants for staggered animation
        src={CARD_CONTENT_DATA.imageUrl}
        alt="Abstract representation"
        className="w-full h-48 object-cover rounded-md mb-4 shadow-sm"
      />
      {/* Motion.h3 for the card title */}
      <motion.h3
        variants={cardItemVariants as Variants} // Apply item variants
        className="text-2xl font-bold text-gray-900 mb-2 leading-tight"
      >
        {CARD_CONTENT_DATA.title}
      </motion.h3>
      {/* Motion.p for the card description */}
      <motion.p
        variants={cardItemVariants as Variants} // Apply item variants
        className="text-gray-700 text-base mb-4 leading-relaxed"
      >
        {CARD_CONTENT_DATA.description}
      </motion.p>
      {/* Motion.button for the call to action */}
      <motion.button
        variants={cardItemVariants as Variants} // Apply item variants
        className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
        whileTap={{ scale: 0.95 }} // Add a subtle scale-down animation on tap/click
      >
        {CARD_CONTENT_DATA.callToAction}
      </motion.button>
    </motion.div>
  );
}

export default Card;