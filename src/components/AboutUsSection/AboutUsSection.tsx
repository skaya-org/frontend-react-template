import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// --- CONSTANT DATA ---

/**
 * @typedef {object} AboutUsData
 * @description Defines the static content for the About Us section.
 * @property {string} title - The main heading for the section.
 * @property {string[]} paragraphs - An array of paragraphs forming the body text.
 * @property {object} image - Details for the representative image.
 * @property {string} image.src - The source URL for the image.
 * @property {string} image.alt - The alternative text for the image for accessibility.
 */
const ABOUT_US_DATA: {
  title: string;
  paragraphs: string[];
  image: { src: string; alt: string };
} = {
  title: 'Our Story: Forging the Future',
  paragraphs: [
    'Founded over a decade ago by a small group of passionate developers, our company began with a simple yet powerful mission: to craft digital experiences that are not only functional but also elegant and intuitive. We saw a gap between potential and reality in the digital landscape and set out to bridge it.',
    'Today, we are a diverse team of strategists, designers, and engineers who share a collective commitment to excellence. Our journey has been one of continuous learning and adaptation, always staying at the forefront of technology while remaining grounded in the principles of user-centric design. We believe that the best products are born from collaboration, creativity, and a relentless pursuit of quality.',
    "Our mission is to empower our clients by transforming their visions into robust, scalable, and impactful digital solutions. We're not just building software; we're building partnerships for a better digital tomorrow.",
  ],
  image: {
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    alt: 'A diverse and collaborative team working together in a modern office environment.',
  },
};

// --- ANIMATION VARIANTS ---

/**
 * @description Framer Motion variants for staggered animation effects.
 */
const motionVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  },
  image: {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  },
};

// --- CORE COMPONENT ---

/**
 * A self-contained "About Us" section component for a company website.
 *
 * @description This component renders a complete section with a title, descriptive
 * paragraphs, and a representative image. It is designed to be fully independent,
 * with all necessary data and styles defined internally. It uses `framer-motion`
 * for subtle, engaging animations that trigger upon entering the viewport.
 * This component requires no props.
 * @returns {JSX.Element} The rendered About Us section.
 */
const AboutUsSection = (): JSX.Element => {
  return (
    <section className="font-sans bg-gray-50 py-24 px-8 overflow-hidden">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={motionVariants.container as Variants}
      >
        {/* Text content column with its own staggering for its children */}
        <motion.div
          className="flex flex-col gap-6"
          variants={motionVariants.container as Variants}
        >
          <motion.h2
            className="text-[2.75rem] font-bold text-gray-900 mb-4 leading-tight"
            variants={motionVariants.item as Variants}
          >
            {ABOUT_US_DATA.title}
          </motion.h2>
          {ABOUT_US_DATA.paragraphs.map((text, index) => (
            <motion.p
              key={index}
              className="text-lg leading-relaxed text-gray-600"
              variants={motionVariants.item as Variants}
            >
              {text}
            </motion.p>
          ))}
        </motion.div>
        {/* Image column with a distinct zoom-in animation */}
        <motion.div
          className="rounded-xl overflow-hidden shadow-xl"
          variants={motionVariants as Variants}
        >
          <img
            src={ABOUT_US_DATA.image.src}
            alt={ABOUT_US_DATA.image.alt}
            className="w-full h-full object-cover block"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

// --- ERROR FALLBACK ---

/**
 * A fallback component to display when an error is caught by the ErrorBoundary.
 * @description This provides a user-friendly message instead of a crashed component.
 * @returns {JSX.Element} The error fallback UI.
 */
const ErrorFallback = (): JSX.Element => (
  <div className="bg-red-50 text-red-700 border border-red-700 rounded-lg p-8 text-center m-8">
    <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
    <p>
      We're sorry, the "About Us" section could not be displayed at this time.
    </p>
  </div>
);

// --- EXPORT WITH BOUNDARY ---

/**
 * A wrapper component that provides a safety net for the `AboutUsSection`.
 * @description It uses `react-error-boundary` to catch any potential runtime errors
 * within the component, preventing them from breaking the entire application.
 * This component is the default export and the intended way to use `AboutUsSection`.
 * @returns {JSX.Element} The `AboutUsSection` component wrapped in an `ErrorBoundary`.
 */
const AboutUsSectionWithBoundary = (): JSX.Element => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <AboutUsSection />
  </ErrorBoundary>
);

export default AboutUsSectionWithBoundary;