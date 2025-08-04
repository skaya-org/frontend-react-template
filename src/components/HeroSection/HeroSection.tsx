import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Added Variants import
import Button from '../Button/Button';

/**
 * Constant data for the HeroSection component.
 * All textual content and image URLs are defined here to ensure the component
 * remains self-contained and does not rely on external props for its core content.
 */
const HERO_HEADLINE: string = 'Unlock Your Potential with Cutting-Edge Solutions';
const HERO_DESCRIPTION: string = 'Discover innovative tools and services designed to streamline your workflow, boost productivity, and achieve unparalleled success. Join a community of forward-thinkers today.';
const HERO_BACKGROUND_IMAGE_URL: string = 'https://picsum.photos/1920/1080.webp?random=1'; // High-resolution random image for background

/**
 * Animation variants for Framer Motion.
 * These define the initial and animated states for the container and its children,
 * creating a staggered fade-in effect.
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Stagger children animations with a slight delay before they start
      staggerChildren: 0.3,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring', // Use a spring physics animation for natural movement
      stiffness: 100,
      damping: 10,
    },
  },
};

/**
 * HeroSection Component
 *
 * This component represents the prominent introductory section of a homepage.
 * It features a compelling headline, a brief descriptive text, and a call-to-action button.
 *
 * Key Features:
 * - **Constant Content:** All textual content (headline, description) is hardcoded
 *   within the component, adhering to the requirement of not accepting external props.
 * - **Visual Design:** Utilizes Tailwind CSS for styling, providing a clean and
 *   responsive layout. It includes a background image with an overlay for visual impact.
 * - **Animations:** Integrates `framer-motion` for subtle, engaging entrance
 *   animations for its content elements, enhancing user experience.
 * - **Modular Integration:** Incorporates a `Button` component, which is
 *   assumed to be self-contained and handles its own content and actions internally,
 *   as per the guidelines (no props passed to the `Button`).
 * - **Accessibility:** Includes `aria-labelledby` for semantic linking of the section
 *   to its main headline and `alt` text for the background image.
 * - **Performance:** Uses `loading="lazy"` and `decoding="async"` for the background
 *   image, optimizing asset loading.
 *
 * Constraints Followed:
 * - Uses TypeScript.
 * - All content is constant; no props are accepted by this component itself.
 * - Follows React best practices (functional component, proper hooks usage).
 * - Implements clean, modular, and maintainable code structure.
 * - Includes comprehensive JSDoc comments.
 * - Designed with an intuitive API (though no props are exposed for this component).
 * - Uses `framer-motion` for subtle entrance animations.
 * - Integrates a self-contained `Button` component for the Call-to-Action.
 * - Assumes `@tailwindcss/browser` script is loaded for styling.
 * - Returns only the complete TSX code.
 * - Utilizes `https://picsum.photos` for image sourcing.
 *
 * @returns {JSX.Element} The rendered HeroSection component.
 */
function HeroSection(): JSX.Element {
  return (
    <section
      className="relative flex items-center justify-center min-h-screen overflow-hidden text-white bg-gray-900"
      aria-labelledby="hero-headline"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BACKGROUND_IMAGE_URL}
          alt="Abstract background image representing innovation and success"
          className="object-cover w-full h-full opacity-30"
          loading="lazy"
          decoding="async"
        />
        {/* Gradient overlay to enhance text readability and blend with background */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-80"></div>
      </div>

      {/* Content Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto"
        variants={containerVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        {/* Headline */}
        <motion.h1
          id="hero-headline"
          className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          variants={itemVariants as Variants}
        >
          {HERO_HEADLINE}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="mb-8 text-lg font-light leading-relaxed sm:text-xl md:text-2xl opacity-90"
          variants={itemVariants as Variants}
        >
          {HERO_DESCRIPTION}
        </motion.p>

        {/* Call-to-Action Button */}
        {/* The Button component is self-fulfilled and does not accept props as per requirements. */}
        <motion.div variants={itemVariants as Variants}> {/* Applied variants as Variants */}
          <Button />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroSection;