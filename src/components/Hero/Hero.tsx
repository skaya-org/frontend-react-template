import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import Button from '../Button/Button';

// Constant data for the Hero component
const heroData = {
  headline: 'Effortless Laundry & Dry Cleaning Delivered to Your Door',
  ctaText: 'Schedule a Pickup',
  backgroundImageUrl: '/images/laundry-hero-background.webp', // A placeholder path for the background image
  ctaLink: '/schedule',
};

// Animation variants for the main content container
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Creates a subtle delay between child animations
    },
  },
};

// Animation variants for the text and button elements
const itemVariants: Variants = {
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
 * Hero component for the homepage banner.
 * Features a static headline, background image, and a call-to-action button,
 * with Framer Motion animations for a dynamic entrance.
 */
const Hero = (): JSX.Element => {
  return (
    <section
      className="relative flex items-center justify-center text-center min-h-[60vh] p-8 text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${heroData.backgroundImageUrl})` }}
      aria-labelledby="hero-headline"
    >
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Animated content container */}
      <motion.div
        className="relative z-20 flex flex-col items-center gap-6 max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          id="hero-headline"
          className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
          variants={itemVariants as Variants}
        >
          {heroData.headline}
        </motion.h1>
        <motion.div variants={itemVariants as Variants}>
          <Link to={heroData.ctaLink}>
            <Button></Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;