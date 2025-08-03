import React, { useMemo, JSX } from 'react';
import { motion, PanInfo, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

//==============================================================================
// INTERFACES
//==============================================================================

/**
 * @interface Testimonial
 * @description Defines the structure for a single testimonial item.
 * @property {string | number} id - A unique identifier for the testimonial.
 * @property {string} quote - The main content of the testimonial.
 * @property {string} author - The name of the person who gave the testimonial.
 * @property {string} [role] - The role or company of the author (optional).
 * @property {string} [avatarUrl] - URL for the author's avatar image (optional).
 */
export interface Testimonial {
  id: string | number;
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
}

/**
 * @interface TestimonialsCarouselProps
 * @description Props for the TestimonialsCarousel component.
 * @property {string} title - The main heading for the testimonials section.
 * @property {Testimonial[]} testimonials - An array of testimonial objects to display.
 * @property {number} [speed=40] - The duration in seconds for one full animation loop. Higher numbers mean slower speed. Defaults to 40.
 * @property {string} [className] - Optional CSS class name for custom styling of the root section element.
 */
export interface TestimonialsCarouselProps {
  title: string;
  testimonials: Testimonial[];
  speed?: number;
  className?: string;
}

//==============================================================================
// COMPONENT
//==============================================================================

/**
 * A fallback component to render when an error occurs within the TestimonialsCarousel.
 * @param {{ error: Error }} props - The error object provided by ErrorBoundary.
 * @returns {JSX.Element} A simple error message UI.
 */
const CarouselErrorBoundaryFallback = ({ error }: { error: Error }): JSX.Element => (
  <div className="w-full bg-gray-50 py-16 text-center text-red-600">
    <div className="mx-auto max-w-7xl px-4">
      <h2 className="text-4xl font-bold">Something went wrong</h2>
      <p className="mt-4">
        We're sorry, the testimonials could not be displayed at this time.
      </p>
      <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-red-100 p-4 text-left text-red-800">
        {error.message}
      </pre>
    </div>
  </div>
);

/**
 * Renders a single testimonial card.
 * @param {{ testimonial: Testimonial }} props - The testimonial data for the card.
 * @returns {JSX.Element} The JSX for a testimonial card.
 */
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }): JSX.Element => (
  <div className="flex h-full w-[clamp(300px,40vw,450px)] flex-none flex-col rounded-xl bg-white p-8 shadow-md">
    <blockquote className="relative flex-grow pl-10 text-lg italic leading-relaxed text-gray-700">
      <span className="absolute -top-2 left-0 text-5xl leading-none text-gray-200">
        “
      </span>
      {testimonial.quote}
    </blockquote>
    <footer className="mt-8 flex items-center border-t border-gray-200 pt-6">
      {testimonial.avatarUrl && (
        <img
          src={testimonial.avatarUrl}
          alt={testimonial.author}
          className="mr-4 h-12 w-12 rounded-full bg-gray-300 object-cover"
        />
      )}
      <div className="flex flex-col">
        <cite className="font-semibold not-italic text-gray-900">
          {testimonial.author}
        </cite>
        {testimonial.role && (
          <span className="text-sm text-gray-500">{testimonial.role}</span>
        )}
      </div>
    </footer>
  </div>
);

/**
 * @name TestimonialsCarousel
 * @description A component to display a continuously scrolling carousel of customer testimonials.
 * It is designed to be self-contained and handles its own animation loop.
 * For robust applications, it is recommended to wrap this component in an ErrorBoundary
 * at a higher level in your application tree to catch potential rendering errors.
 *
 * @param {TestimonialsCarouselProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered carousel component or null if no testimonials are provided.
 */
const TestimonialsCarousel = ({
  title,
  testimonials,
  speed = 40,
  className = '',
}: TestimonialsCarouselProps): JSX.Element | null => {
  // Guard clause: Do not render anything if the testimonials array is empty or not provided.
  if (!testimonials || testimonials.length === 0) {
    // In a real application, you might want to log this case.
    console.warn('TestimonialsCarousel: `testimonials` prop is empty or not provided.');
    return null;
  }

  /**
   * Duplicates the testimonials array to create a seamless looping effect.
   * The carousel animates from the start of the first set to the start of the second set,
   * then instantly resets, creating an illusion of infinite scroll.
   * Memoized to prevent re-computation on every render.
   */
  const duplicatedTestimonials = useMemo(() => [...testimonials, ...testimonials], [testimonials]);

  /**
   * Animation variants for the `framer-motion` component.
   * This defines the animation properties for the carousel track.
   */
  const marqueeVariants: Variants = {
    animate: {
      x: ['0%', '-50%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: speed,
          ease: 'linear',
        },
      },
    },
  };
  
  /**
   * Variants for the main container to orchestrate staggered animations on its children
   * when it enters the viewport.
   */
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  /**
   * Variants for individual items like the title and the carousel itself,
   * causing them to fade and slide in from below.
   */
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <ErrorBoundary FallbackComponent={CarouselErrorBoundaryFallback}>
      <motion.section
        className={`w-full bg-gray-50 py-16 text-gray-900 ${className}`}
        aria-labelledby="testimonials-title"
        variants={containerVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <motion.h2
            id="testimonials-title"
            className="mb-12 text-center text-4xl font-bold"
            variants={itemVariants as Variants}
          >
            {title}
          </motion.h2>
          <motion.div
            className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
            variants={itemVariants as Variants}
          >
            <motion.div
              className="flex will-change-transform"
              variants={marqueeVariants as Variants}
              animate="animate"
              // Add drag functionality for user interaction
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info: PanInfo) => {
                // This is a simple example. A more complex implementation could
                // adjust the animation based on drag offset and velocity.
                console.log('Drag ended with info:', info);
              }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <div
                  // Using a composite key for the duplicated array
                  key={`${testimonial.id}-${index}`}
                  aria-hidden={index >= testimonials.length} // Hide duplicated items from screen readers
                  className="mx-4" // Margin between cards
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </ErrorBoundary>
  );
};

export default TestimonialsCarousel;