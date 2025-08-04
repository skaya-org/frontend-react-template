import React, { JSX } from 'react';
// Import 'motion' and 'Variants' from 'framer-motion' as per the description.
import { motion, Variants } from 'framer-motion';

// Import the ServiceCard component from its specified path.
// As per requirements, ServiceCard is a self-fulfilled component and does not accept props from ServicesSection.
import ServiceCard from "../ServiceCard/ServiceCard";

/**
 * @typedef {Object} ServicePlaceholder
 * @property {string} id - A unique identifier for each service slot. This ID is primarily used
 *    for React's `key` prop when rendering a list of `ServiceCard` components.
 *    It also conceptually represents a distinct service that a `ServiceCard` instance
 *    is expected to represent.
 *    Note: The actual content (e.g., title, description, image) for each `ServiceCard`
 *    is managed internally by the `ServiceCard` component itself, as it is designed
 *    to be self-fulfilled and not receive props from `ServicesSection`.
 */
type ServicePlaceholder = {
  id: string;
};

/**
 * Constant array defining the "slots" or the number of `ServiceCard` components to display.
 * Each object within this array serves as a placeholder to trigger the rendering of one
 * `ServiceCard` instance.
 *
 * This data adheres to the guideline that the main component (`ServicesSection`)
 * uses constant internal data and does not rely on external props.
 * It also implicitly signals to the `ServiceCard` components (if they are designed to
 * interpret this context) that they should display distinct service information,
 * even though `ServicesSection` does not pass explicit service data via props to them.
 *
 * @type {ServicePlaceholder[]}
 * @constant
 */
const SERVICES_TO_DISPLAY: ServicePlaceholder[] = [
  { id: 'web-development' },
  { id: 'mobile-app-development' },
  { id: 'ui-ux-design' },
  { id: 'cloud-solutions' },
  { id: 'data-analytics' },
  { id: 'cybersecurity' },
  { id: 'it-consulting' },
  { id: 'devops-solutions' },
];

// --- Framer Motion Variants Definitions ---

// Variants for the overall container of service cards.
// This orchestrates the staggered animation of its children.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Stagger children animations by 0.1 seconds each
      staggerChildren: 0.1,
      // Delay the start of the entire container animation slightly
      delayChildren: 0.2
    }
  },
};

// Variants for each individual ServiceCard item.
// Each item will animate in from slightly below and fade in.
const itemVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5, // Duration for each individual item's animation
      ease: "easeOut" // Easing function for a smoother animation
    }
  },
};

/**
 * ServicesSection React Component
 *
 * This component is a dedicated section designed to showcase various services offered by a business.
 * It structures and displays a grid of `ServiceCard` components, each representing a distinct service.
 *
 * **Core Functionality & Design Principles:**
 * - **Constant Data Driven**: The component determines the number of service cards to display
 *   based on the internal `SERVICES_TO_DISPLAY` constant array, ensuring the main component
 *   itself does not require any external props.
 * - **Self-Fulfilled Children**: Adheres strictly to the guideline that imported child components
 *   (e.g., `ServiceCard`) do not receive props or interfaces from `ServicesSection`. This implies
 *   each `ServiceCard` is fully responsible for populating its own content and managing its internal state.
 * - **Clean Code**: Employs a modular structure with clear separation of concerns, grouping
 *   related logic (constants, component rendering) together.
 * - **Styling**: Utilizes Tailwind CSS utility classes for responsive and clean visual design.
 *   The styling is embedded directly in the JSX via `className` attributes.
 * - **Animations**: Integrates the `motion` library for subtle, engaging entrance animations
 *   on each `ServiceCard`, enhancing the user experience.
 * - **Accessibility**: Includes `aria-labelledby` and `role` attributes for improved semantic meaning
 *   and accessibility.
 *
 * **Error Handling Philosophy:**
 * For this specific implementation, as the `ServicesSection` component primarily deals with
 * static, constant data and renders known child components (`ServiceCard`) that are
 * assumed to be stable and self-contained, a dedicated, explicit React Error Boundary
 * (typically a class component or a more advanced HOC/hook) is not directly implemented
 * within this component. In a production application with dynamic data fetching or
 * complex interactions that could lead to runtime errors, a higher-level Error Boundary
 * wrapping this section (or the entire application subtree) would be a best practice.
 *
 * **Usage:**
 * This component is self-contained and does not accept any props.
 * It can be directly included in any parent component where a services showcase is desired.
 *
 * @example
 * ```tsx
 * import ServicesSection from './ServicesSection';
 *
 * function LandingPage() {
 *   return (
 *     <div className="min-h-screen bg-white dark:bg-gray-800">
 *       <ServicesSection />
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {JSX.Element} The rendered HTML section showcasing services.
 */
const ServicesSection = (): JSX.Element => {
  return (
    <section
      id="services"
      className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
      aria-labelledby="services-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="services-heading" className="text-4xl font-extrabold text-center mb-12 capitalize tracking-tight leading-tight md:text-5xl">
          Our Comprehensive Services
        </h2>
        {/* The grid container is now a motion.div to orchestrate child animations */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants} // Apply the container animation variants
          initial="hidden"             // Start from the 'hidden' state
          whileInView="visible"        // Animate to 'visible' when in view (common for sections)
          viewport={{ once: true, amount: 0.2 }} // Only animate once, when 20% of the element is in view
        >
          {SERVICES_TO_DISPLAY.map((service) => (
            <motion.div
              key={service.id} // Unique key for each ServiceCard instance for React list reconciliation
              variants={itemVariants as Variants} // Apply the item animation variants (type assertion for safety)
              role="listitem" // Semantic role for accessibility within a grid/list context
              aria-label={`Service Card for ${service.id.replace(/-/g, ' ')}`} // Descriptive label for screen readers
            >
              {/*
                The ServiceCard component is rendered without any props.
                As per requirements, it is a self-fulfilled component that manages its own content.
                It implicitly understands how to display a unique service for each instance
                when rendered in a list by ServicesSection.
              */}
              <ServiceCard />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;