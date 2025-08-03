/**
 * @file HeroSection.tsx
 * @description This file contains the HeroSection component, a self-contained,
 * introductory visual element for the top of a homepage.
 * @author Senior Fullstack/TypeScript Developer
 * @date 2024-05-16
 */

import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

// --- Constants and Configuration ---

/**
 * @constant HERO_DATA
 * @description Contains all the static content for the HeroSection component.
 * This self-contained approach ensures the component is a "drop-in" unit
 * with no external dependencies for its content, promoting reusability and
 * simplifying maintenance.
 */
const HERO_DATA = {
  headline: 'Effortless Laundry & Dry Cleaning',
  description: 'Say goodbye to laundry day. We pick up, clean, and deliver your clothes right to your door. Freshness, guaranteed.',
  ctaText: 'Schedule a Pickup',
  ctaLink: '/schedule',
  backgroundImageUrl: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=2070&auto=format&fit=crop',
  backgroundAriaLabel: 'Laundry baskets in a well-lit, modern laundry room',
};

/**
 * @constant ANIMATION_VARIANTS
 * @description Defines the animation variants for the Framer Motion library.
 * This includes a container for staggering child animations and item variants
 * for a smooth "fade in and up" effect.
 */
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
};


/**
 * HeroSection Component
 * @exports HeroSection
 * @description The primary introductory section ("hero") for the homepage.
 * It is designed as a standalone, "drop-in" component with no props API. All content,
 * styling, and animations are self-contained to ensure maximum portability and
 * minimal integration effort.
 *
 * For production applications, it's recommended to wrap this component's usage in a
 * React Error Boundary to gracefully handle any unexpected rendering issues.
 *
 * @example
 * // In your router/page component:
 * import HeroSection from './components/HeroSection';
 * import { ErrorBoundary } from 'react-error-boundary';
 *
 * const HomePage = () => (
 *   <ErrorBoundary fallback={<div>Something went wrong with the hero section.</div>}>
 *     <HeroSection />
 *     // ... rest of the page
 *   </ErrorBoundary>
 * );
 *
 * @returns {JSX.Element} The rendered HeroSection component.
 */
const HeroSection = (): JSX.Element => {
  return (
    <section 
      className="relative flex h-[90vh] min-h-[600px] items-center justify-center overflow-hidden text-center text-white" 
      aria-labelledby="hero-headline"
    >
      <div
        className={`absolute inset-0 z-10 bg-cover bg-center bg-[url('${HERO_DATA.backgroundImageUrl}')]`}
        role="img"
        aria-label={HERO_DATA.backgroundAriaLabel}
      ></div>
      <div className="absolute inset-0 z-20 bg-black/[.55]"></div>

      <motion.div
        className="relative z-30 flex max-w-[800px] flex-col items-center gap-7 px-8"
        variants={ANIMATION_VARIANTS.container as Variants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          id="hero-headline"
          className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]"
          variants={ANIMATION_VARIANTS.item as Variants}
        >
          {HERO_DATA.headline}
        </motion.h1>

        <motion.p
          className="max-w-2xl text-[clamp(1.1rem,2.5vw,1.25rem)] leading-relaxed [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]"
          variants={ANIMATION_VARIANTS.item as Variants}
        >
          {HERO_DATA.description}
        </motion.p>

        <motion.div
          variants={ANIMATION_VARIANTS.item as Variants}
        >
          <Link 
            to={HERO_DATA.ctaLink} 
            className="inline-block rounded-full bg-[hsl(211,100%,50%)] px-10 py-4 text-lg font-semibold text-white no-underline shadow-[0_4px_15px_rgba(0,123,255,0.3)] transition-all duration-300 ease-out hover:scale-105 hover:bg-[hsl(211,100%,45%)] hover:shadow-[0_6px_20px_rgba(0,123,255,0.4)] active:scale-95"
          >
            {HERO_DATA.ctaText}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;