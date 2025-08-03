import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import TestimonialCard from 'src/components/TestimonialCard/TestimonialCard';

//==============================================================================
// INTERFACES
//==============================================================================

/**
 * @interface ITestimonial
 * @description Defines the structure for a single testimonial object.
 * This interface can be exported and used across the application to ensure
 * consistency for testimonial data.
 */
export interface ITestimonial {
  /**
   * @property {string | number} id - A unique identifier for the testimonial,
   * used for React keys.
   */
  id: string | number;

  /**
   * @property {string} quote - The main content of the testimonial.
   */
  quote: string;

  /**
   * @property {string} authorName - The name of the person providing the testimonial.
   */
  authorName: string;

  /**
   * @property {string} authorTitle - The job title or role of the author.
   */
  authorTitle: string;

  /**
   * @property {string} authorImage - The URL for the author's avatar or profile picture.
   */
  authorImage: string;
}

/**
 * @interface TestimonialsSectionProps
 * @description Defines the props accepted by the TestimonialsSection component.
 */
export interface TestimonialsSectionProps {
  /**
   * @property {string} title - The main heading for the testimonials section.
   */
  title: string;

  /**
   * @property {string} [subtitle] - An optional subheading displayed below the main title.
   */
  subtitle?: string;

  /**
   * @property {ITestimonial[]} testimonials - An array of testimonial objects to be displayed.
   * The component will not render the carousel if this array is empty.
   */
  testimonials: ITestimonial[];

  /**
   * @property {number} [autoplayInterval=5000] - The interval in milliseconds for the carousel
   * to automatically advance to the next slide. Set to 0 or a negative number to disable autoplay.
   * Defaults to 5000ms (5 seconds).
   * @note This prop is preserved for API consistency but is no longer used by the continuous marquee implementation.
   */
  autoplayInterval?: number;

  /**
   * @property {string} [className] - Optional CSS class names to apply to the root section element for custom styling.
   */
  className?: string;
}

//==============================================================================
// ANIMATION VARIANTS
//==============================================================================

/**
 * @const containerVariants
 * @description Variants for a container element that orchestrates staggering animations for its children.
 * Used for the main section to animate its primary child elements into view.
 */
const containerVariants: Variants = {
  offscreen: { opacity: 0 },
  onscreen: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

/**
 * @const itemFadeInUpVariants
 * @description Variants for child elements that fade and slide up into view.
 * Used for the header, carousel wrapper, and navigation dots.
 */
const itemFadeInUpVariants: Variants = {
  offscreen: { opacity: 0, y: 30 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

/**
 * @const cardVariants
 * @description Variants for individual testimonial cards to create a 3D tilt effect on hover.
 * The transition is defined within each variant for smooth entry and exit from the hover state.
 */
const cardVariants: Variants = {
  initial: {
    scale: 1,
    rotateY: 0,
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  hover: {
    scale: 1.05,
    rotateY: 8, // A subtle 3D tilt
    boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.15)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};


//==============================================================================
// ERROR FALLBACK COMPONENT
//==============================================================================

/**
 * @function TestimonialErrorFallback
 * @description A simple fallback component to display when an error occurs within the carousel.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const TestimonialErrorFallback = (): JSX.Element => (
  <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-left" role="alert">
    <strong className="font-bold">Oops! Something went wrong.</strong>
    <span className="block sm:inline"> We couldn't load the testimonials at the moment. Please try again later.</span>
  </div>
);


//==============================================================================
// MAIN COMPONENT
//==============================================================================

/**
 * @component TestimonialsSection
 * @description A section component that displays an animated carousel of testimonials.
 * It features a smooth, continuous scrolling animation and 3D hover effects on each card.
 *
 * @param {TestimonialsSectionProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered TestimonialsSection component or null if no testimonials are provided.
 */
const TestimonialsSection = ({
  title,
  subtitle,
  testimonials,
  autoplayInterval = 5000,
  className,
}: TestimonialsSectionProps): JSX.Element | null => {

  // --- DERIVED STATE & CONSTANTS ---
  const testimonialsCount = testimonials.length;

  // --- RENDER LOGIC ---

  // Do not render the component if there are no testimonials to display.
  if (!testimonials || testimonialsCount === 0) {
    return null;
  }

  // Calculate a dynamic duration for the marquee animation to ensure consistent scroll speed.
  // We'll aim for roughly 7 seconds per card.
  const marqueeDuration = testimonialsCount * 7;

  // Duplicate the testimonials array to create a seamless looping effect.
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <motion.section
      className={`relative bg-gray-50 py-16 sm:py-24 overflow-hidden ${className || ''}`}
      aria-labelledby="testimonials-heading"
      variants={containerVariants as Variants}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header
          className="mb-12 max-w-3xl mx-auto text-center"
          variants={itemFadeInUpVariants as Variants}
        >
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg leading-8 text-gray-600">
              {subtitle}
            </p>
          )}
        </motion.header>

        <ErrorBoundary FallbackComponent={TestimonialErrorFallback}>
          <motion.div
            className="relative mt-16"
            variants={itemFadeInUpVariants as Variants}
          >
            {/* The marquee container with overflow-hidden to create the viewport */}
            <div
              className="overflow-hidden"
              role="region"
              aria-roledescription="carousel"
            >
              {/* The infinitely moving strip of testimonials */}
              <motion.div
                className="flex gap-x-8"
                style={{ perspective: '1200px' }} // Add perspective for 3D hover effect
                animate={{
                  x: ['0%', '-50%'],
                  transition: {
                    ease: 'linear',
                    duration: marqueeDuration,
                    repeat: Infinity,
                  },
                }}
              >
                {duplicatedTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={`${testimonial.id}-${index}`}
                    className="flex-shrink-0 w-80 md:w-96"
                    aria-hidden={true} // Hide individual items from screen readers
                    variants={cardVariants as Variants}
                    initial="initial"
                    whileHover="hover"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <TestimonialCard
                      quote={testimonial.quote}
                      author={testimonial.authorName} title={''} avatar={''}                      // Assuming TestimonialCard handles its own internal styling
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Left-side fade overlay to enhance the infinite scroll illusion */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
            
            {/* Right-side fade overlay */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
          </motion.div>
        </ErrorBoundary>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;