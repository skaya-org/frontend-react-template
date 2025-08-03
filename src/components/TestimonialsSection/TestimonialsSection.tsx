import React, { JSX } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';
import TestimonialCard from '../TestimonialCard/TestimonialCard';

// #region TYPE DEFINITIONS
/**
 * @type {TestimonialData}
 * Defines the shape of a single testimonial object.
 * This structure is used internally by the TestimonialsSection component.
 */
type TestimonialData = {
  /**
   * Unique identifier for the testimonial. Used for React keys.
   */
  id: number;
  /**
   * The main quote or review from the customer.
   */
  quote: string;
  /**
   * The full name of the customer giving the testimonial.
   */
  authorName: string;
  /**
   * The job title or role of the customer.
   */
  authorTitle: string;
  /**
   * URL to the customer's avatar image.
   */
  avatarUrl: string;
};
// #endregion

// #region CONSTANT DATA
/**
 * @const TESTIMONIALS_DATA
 * A hardcoded array of customer testimonials. This component is self-contained
 * and does not require this data to be passed via props, ensuring consistency
 * across the application.
 */
const TESTIMONIALS_DATA: readonly TestimonialData[] = [
  {
    id: 1,
    quote: "This is a game-changer. The performance and user experience are unparalleled. Our team's productivity has skyrocketed since we started using it.",
    authorName: 'Jane Doe',
    authorTitle: 'CEO, Innovate Inc.',
    avatarUrl: 'https://i.pravatar.cc/150?u=jane-doe',
  },
  {
    id: 2,
    quote: "I was skeptical at first, but the results speak for themselves. The support team is also incredibly responsive and helpful. Highly recommended!",
    authorName: 'John Smith',
    authorTitle: 'Lead Developer, Tech Solutions',
    avatarUrl: 'https://i.pravatar.cc/150?u=john-smith',
  },
  {
    id: 3,
    quote: "An essential tool for any modern business. It's intuitive, powerful, and has a beautiful design. It seamlessly integrated into our existing workflow.",
    authorName: 'Emily White',
    authorTitle: 'Project Manager, Creative Minds',
    avatarUrl: 'https://i.pravatar.cc/150?u=emily-white',
  },
];
// #endregion

// #region ANIMATION VARIANTS
/**
 * Framer Motion variants for the main heading.
 * Defines a fade-in and slide-down animation.
 */
const headingVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
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
 * Framer Motion variants for the container of the testimonial cards.
 * It orchestrates a staggered animation for its children.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2, // Delay after heading animation
    },
  },
};

/**
 * Framer Motion variants for each individual testimonial card.
 * Defines a fade-in and slide-up animation.
 */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};
// #endregion

// #region ERROR FALLBACK COMPONENT
/**
 * @component TestimonialsErrorFallback
 * A fallback UI component to be rendered by the ErrorBoundary if any
 * error occurs within the testimonial list.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} A simple error message.
 */
const TestimonialsErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div
    role="alert"
    className="rounded-lg border border-red-200 bg-red-100 p-4 text-red-700"
  >
    <h3 className="mb-2 font-bold">Oops! Something went wrong.</h3>
    <p>We couldn't display the testimonials at this moment.</p>
    <pre className="mt-2 text-sm text-red-800 whitespace-pre-wrap break-all">
      {error.message}
    </pre>
  </div>
);
// #endregion

/**
 * @component TestimonialsSection
 *
 * @description
 * A self-contained, production-grade UI component that displays a social proof
 * section with customer testimonials. It is designed to build credibility with
 * potential customers by showcasing positive feedback.
 *
 * @features
 * - **Self-Contained Data:** Uses a predefined constant for testimonials, requiring no props.
 * - **Animated:** Leverages Framer Motion for engaging, staggered entrance animations.
 * - **Robust:** Includes an ErrorBoundary to gracefully handle potential rendering errors.
 * - **Accessible:** Uses appropriate semantic HTML and ARIA attributes.
 * - **Modular:** Renders individual reviews using the `TestimonialCard` component.
 *
 * @returns {JSX.Element} The rendered `TestimonialsSection` component.
 */
const TestimonialsSection = (): JSX.Element => {
  return (
    <section
      className="w-full bg-gray-50 py-16 px-8"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl text-center">
        <motion.h2
          id="testimonials-heading"
          className="mb-12 text-4xl font-bold text-gray-900"
          variants={headingVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          What Our Customers Are Saying
        </motion.h2>
        <ErrorBoundary FallbackComponent={TestimonialsErrorFallback}>
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants as Variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {TESTIMONIALS_DATA.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants as Variants}
              >
                <TestimonialCard
                />
              </motion.div>
            ))}
          </motion.div>
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default TestimonialsSection;