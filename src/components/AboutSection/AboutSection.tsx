import React, { JSX } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';
import ProfileSectionCard from '../../components/ProfileSectionCard/ProfileSectionCard';

/**
 * @constant ABOUT_CONTENT
 * @description Constant data for the About Us section. This ensures that the component
 * is self-contained and does not require props for its content, promoting reusability
 * and predictability.
 */
const ABOUT_CONTENT = {
  title: 'About Apollo Hospital',
  description: `Established in 1983, Apollo Hospitals has a robust presence across the healthcare ecosystem. From routine wellness & preventive health care to innovative life-saving treatments and diagnostic services, Apollo Hospitals has touched an impressive 120 million lives from over 120 countries. Our mission is to bring healthcare of international standards within the reach of every individual. We are committed to the achievement and maintenance of excellence in education, research and healthcare for the benefit of humanity. With a legacy of clinical excellence, pioneering technology, and a compassionate approach to patient care, we continue to lead the way in the healthcare industry, shaping the future of medicine for generations to come.`,
};

/**
 * @constant sectionVariants
 * @description Animation variants for the main section container.
 * Defines a fade-in and slide-up effect, and staggers the animation of its children.
 * The animation triggers when the component enters the viewport.
 */
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.3,
    },
  },
};

/**
 * @constant textVariants
 * @description Animation variants for the descriptive text content.
 * Defines a subtle fade-in and slide-up effect that follows the parent container's animation.
 */
const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * @component ErrorFallback
 * @description A simple, reusable component to display a user-friendly message
 * when a critical error occurs within its boundary.
 * @param {FallbackProps} props - Props provided by react-error-boundary, including the error object.
 * @returns {JSX.Element} A fallback UI.
 */
const ErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div role="alert" className="p-5 bg-red-50 text-red-800 rounded-lg">
    <h2 className="text-lg font-bold mb-2">Something went wrong:</h2>
    <pre className="p-3 my-2 font-mono text-sm text-red-900 bg-red-100 rounded-md whitespace-pre-wrap">
      {error.message}
    </pre>
    <p className="mt-4 text-sm">
      Please try refreshing the page. This component failed to render.
    </p>
  </div>
);

/**
 * @component AboutSectionCore
 * @description The core implementation of the About Us section. It fetches data from
 * a local constant and renders it within a styled card, with animations applied.
 * The main container animates on scroll-in, followed by its text content.
 * @returns {JSX.Element} The rendered and animated About Us section content.
 */
const AboutSectionCore = (): JSX.Element => {
  return (
    <motion.div
      variants={sectionVariants as Variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
        <motion.p
          variants={textVariants as Variants}
          className="text-base text-gray-700 leading-relaxed"
        >
          {ABOUT_CONTENT.description}
        </motion.p>
      <ProfileSectionCard />
    </motion.div>
  );
};

/**
 * @component AboutSection
 * @description A container component for the 'About Us' section of Apollo Hospital.
 * It encapsulates the core content within an ErrorBoundary to ensure robustness
 * and prevent UI crashes from isolated component failures.
 * This component is self-contained and requires no props, fetching all necessary
 * information from an internal constant data source.
 * @returns {JSX.Element} The complete About Us section, wrapped in an Error Boundary.
 */
const AboutSection = (): JSX.Element => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // In a real app, you might log this error to a service
        console.log('Error boundary has been reset.');
      }}
    >
      <AboutSectionCore />
    </ErrorBoundary>
  );
};

export default AboutSection;