import React, { JSX } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';
import Badge from '../Badge/Badge';

/**
 * @constant BADGE_COUNT
 * @description The total number of badges to display in the gallery.
 * This constant drives the rendering of multiple Badge instances.
 * @type {number}
 */
const BADGE_COUNT: number = 8;

/**
 * Renders a fallback UI when a rendering error occurs within the badge grid.
 * @param {object} props - The props provided by react-error-boundary.
 * @param {Error} props.error - The captured error.
 * @returns {JSX.Element} A simple, styled error message component.
 */
const ErrorFallback = ({ error }: { error: Error }): JSX.Element => (
  <div
    className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-[#ff8a80] bg-zinc-800 p-4 text-center text-[#ff8a80]"
    role="alert"
  >
    <p>
      <strong className="block">Oops! The badge gallery failed to load.</strong>
      <br />
      <small>Error: {error.message}</small>
    </p>
  </div>
);

/**
 * Animation variants for the grid container.
 * This orchestrates the staggering animation of its children.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Time delay between each child's animation
    },
  },
};

/**
 * Animation variants for each individual badge item.
 * Defines how each badge appears on the screen.
 */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 }, // Start invisible, slightly down, and smaller
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring', // Use spring physics for a natural bounce
      stiffness: 100,
      damping: 12,
    },
  },
};

/**
 * @component BadgeGallery
 * @description A self-contained component that displays a collection of earned badges.
 * It follows the strict requirement of not accepting any props and uses its own
 * constant data to determine how many badges to render. The `Badge` component it uses
 * is also self-contained and prop-less, leading to a gallery of multiple,
 * potentially identical, badge instances arranged in a responsive grid.
 * This design adheres to the principle of creating highly-decoupled and
 * independently functioning components.
 *
 * @returns {JSX.Element} A section element containing a grid of Badge components.
 */
const BadgeGallery = (): JSX.Element => {
  return (
    <section
      className="mx-auto w-full max-w-6xl rounded-xl bg-zinc-900 p-8"
      aria-labelledby="badge-gallery-title"
    >
      <h2
        id="badge-gallery-title"
        className="mb-6 border-b-2 border-zinc-700 pb-4 text-center text-3xl font-bold text-white"
      >
        Badge Collection
      </h2>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <motion.div
          className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] justify-items-center gap-6"
          variants={containerVariants as Variants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }} // Animate when 20% of the element is in view
        >
          {Array.from({ length: BADGE_COUNT }).map((_, index) => (
            // The motion.div wrapper receives the animation variants and the key.
            // This is the correct pattern as the key must be on the outermost
            // element within the map loop for React reconciliation.
            <motion.div
              key={`badge-gallery-item-${index}`}
              variants={itemVariants as Variants}
            >
              <Badge />
            </motion.div>
          ))}
        </motion.div>
      </ErrorBoundary>
    </section>
  );
};

export default BadgeGallery;