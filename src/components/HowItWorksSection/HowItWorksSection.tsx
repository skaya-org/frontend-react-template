import React, { JSX } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';
import HowItWorksCard from '../HowItWorksCard/HowItWorksCard';

/**
 * @typedef {object} HowItWorksStep
 * @property {number} stepNumber - The sequential number of the step.
 * @property {string} title - The title of the step.
 * @property {string} description - A brief explanation of the step.
 */
type HowItWorksStep = any;

/**
 * @constant HOW_IT_WORKS_DATA
 * @description Constant data array defining the steps of the laundry service process.
 * This self-contained data source ensures the component is modular and does not require props.
 * Each object corresponds to the props expected by the `HowItWorksCard` component.
 */
const HOW_IT_WORKS_DATA: Readonly<HowItWorksStep[]> = [
  {
    stepNumber: 1,
    title: 'Schedule a Pickup',
    description: 'Use our simple app or website to choose a convenient pickup time that fits your schedule. No calls, no fuss.',
  },
  {
    stepNumber: 2,
    title: 'We Collect Your Laundry',
    description: 'Our friendly driver will arrive at your specified location to collect your laundry. We\'ll provide the bags.',
  },
  {
    stepNumber: 3,
    title: 'Expert Cleaning',
    description: 'Our professionals sort, wash, dry, and fold your clothes with the utmost care, using high-quality, eco-friendly detergents.',
  },
  {
    stepNumber: 4,
    title: 'Prompt Delivery',
    description: 'Receive your fresh, clean, and perfectly folded laundry back at your doorstep, ready to be put away.',
  },
];

/**
 * A simple fallback component to display in case of a rendering error within the card grid.
 * This ensures the rest of the page remains functional.
 * @param {FallbackProps} props - Props provided by React Error Boundary, including the error object.
 * @returns {JSX.Element} A user-friendly error message.
 */
const StepsErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div role="alert" className="rounded-md border border-red-400 bg-red-100 p-4 text-red-700">
    <h3 className="font-bold">Oops! Something went wrong.</h3>
    <p className="mt-1 text-sm">We couldn't display the steps. Please try refreshing the page.</p>
    <pre className="hidden">{error.message}</pre>
  </div>
);

// Animation variants for the grid container to orchestrate staggered animations for the cards.
const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Time delay between each card animating in.
    },
  },
};

// Animation variants for each individual "How It Works" card.
// They will fade in and slide up.
const cardVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 15,
    },
  },
};

// Animation variants for the title and subtitle text.
// They will fade in and slide up slightly.
const textVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Renders the "How It Works" informational section.
 * This component outlines the laundry service process in a series of clear, sequential steps.
 * It is self-contained, fetching its content from an internal constant, `HOW_IT_WORKS_DATA`,
 * and uses the `HowItWorksCard` component to display each step.
 * Animations are triggered as the component enters the viewport.
 *
 * @component
 * @returns {JSX.Element} The rendered HowItWorksSection component.
 */
const HowItWorksSection = (): JSX.Element => {
  return (
    <section className="bg-slate-50 py-16 sm:py-24" aria-labelledby="how-it-works-title">
      {/* This outer motion.div acts as the animation controller for all its children. */}
      {/* It triggers the animations when it enters the viewport. */}
      <motion.div
        className="mx-auto max-w-7xl px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} // Animate once when 20% of the section is visible
      >


        <ErrorBoundary FallbackComponent={StepsErrorFallback}>
        
                <HowItWorksCard
                />
        </ErrorBoundary>
      </motion.div>
    </section>
  );
};

export default HowItWorksSection;