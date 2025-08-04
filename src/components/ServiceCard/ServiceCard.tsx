import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Added Variants import

// Assume Card component exists at this path and does not require props.
// It is designed as a self-contained component providing base styling and structure.
import Card from '../Card/Card';

/**
 * @file ServiceCard.tsx
 * @brief This file defines the ServiceCard React component.
 *
 * The ServiceCard component is a specialized, self-contained display card for a single service.
 * It encapsulates a title, description, and an icon, all of which are sourced from
 * internal constant data. This design ensures the component is fully autonomous and
 * requires no external props for its core functionality.
 *
 * It leverages a base `Card` component for foundational styling and structure, and applies
 * animation capabilities using the `framer-motion` library for enhanced user experience.
 *
 * @remarks
 * - All service-related details (title, description, icon) are hardcoded as constants
 *   within this component, making it entirely self-sufficient.
 * - Strict adherence to the guideline of not passing any props or interfaces to
 *   the imported `Card` component, as it is designed to be self-fulfilled.
 * - Utilizes Tailwind CSS classes directly for styling, relying on the browser script.
 * - Employs comprehensive JSDoc comments for clear documentation.
 * - Includes `framer-motion` for subtle entrance animations.
 */

/**
 * Represents the structure for the service details.
 * This interface is internal and defines the shape of the constant data.
 */
interface ServiceDetails {
  title: string;
  description: string;
  iconUrl: string;
  iconAlt: string;
}

/**
 * Constant data for the service card.
 * These details are internal to the ServiceCard component and are not exposed via props.
 * This ensures the component is a self-sufficient display unit.
 */
const SERVICE_DETAILS: ServiceDetails = {
  title: "Cloud Infrastructure Management",
  description: "Optimizing and scaling your cloud resources across leading providers to ensure high availability, security, and cost-efficiency for your applications.",
  // Using a random image from picsum.photos for the icon, ensuring a square aspect ratio.
  iconUrl: "https://picsum.photos/id/104/80/80.webp", // Example: A small webp image as an icon (80x80 pixels)
  iconAlt: "Cloud Infrastructure Icon",
};

// --- Framer Motion Variants Definitions ---

/**
 * Variants for the main container of the Service Card content.
 * This controls the overall fade-in and slide-up effect,
 * and orchestrates the staggered animation of its children.
 */
const containerVariants: Variants = {
  initial: { opacity: 0, y: 20 }, // Start invisible and slightly below
  animate: {
    opacity: 1, // Fade in
    y: 0,       // Slide up to final position
    transition: {
      duration: 0.6,          // Duration of the container's own animation
      ease: "easeOut",        // Easing function
      delayChildren: 0.2,     // Delay before children animations start after container
      staggerChildren: 0.15   // Time between the start of each child's animation
    }
  }
};

/**
 * Variants for individual items (icon, title, description) within the Service Card.
 * Each item will fade in and slide up slightly after its parent's animation begins.
 */
const itemVariants: Variants = {
  initial: { opacity: 0, y: 15 }, // Start invisible and slightly below
  animate: {
    opacity: 1, // Fade in
    y: 0,       // Slide up to final position
    transition: {
      duration: 0.5, // Duration for each item's animation
      ease: "easeOut" // Easing function
    }
  }
};

// --- End Framer Motion Variants Definitions ---

/**
 * ServiceCard React Component.
 *
 * This component displays a service with a pre-defined title, description, and icon.
 * All necessary data is managed internally as constants, eliminating the need for
 * external props. It serves as a static display unit for a specific service.
 *
 * It utilizes a base `Card` component for its structural foundation and incorporates
 * `framer-motion` for subtle animations upon mount.
 *
 * @returns {JSX.Element} The rendered service card component.
 */
const ServiceCard = (): JSX.Element => {
  const { title, description, iconUrl, iconAlt } = SERVICE_DETAILS;

  return (
    // The Card component provides the base structure and styling for the service card.
    // As per strict guidelines, no props are passed to the imported Card component.
    <>
    <Card/>
   
      <motion.div
        className="flex flex-col items-center p-6 text-center bg-white rounded-lg shadow-xl"
        variants={containerVariants as Variants} // Apply container variants
        initial="initial"                        // Set initial state from variants
        animate="animate"                        // Animate to final state from variants
        aria-label={`Service: ${title}`}         // Accessible label for the card content
      >
        {/* Service Icon Container - now a motion.div to apply item-specific animation */}
        <motion.div variants={itemVariants as Variants} className="mb-4">
          <img
            src={iconUrl}
            alt={iconAlt}
            // Existing icon classes are already appropriate and well-styled for a circular icon with shadow and border.
            className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-indigo-500/50"
            // aria-hidden="true" // Uncomment if the icon is purely decorative and its meaning is conveyed by text
          />
        </motion.div>

        {/* Service Title - now a motion.h3 to apply item-specific animation */}
        <motion.h3
          variants={itemVariants as Variants}
          className="text-3xl font-extrabold text-gray-900 mb-3"
        >
          {title}
        </motion.h3>

        {/* Service Description - now a motion.p to apply item-specific animation */}
        <motion.p
          variants={itemVariants as Variants}
          className="text-lg text-gray-700 leading-relaxed px-2"
        >
          {description}
        </motion.p>
      </motion.div>
    </>

  );
};

export default ServiceCard;