import React from 'react';
import { motion, Variants } from 'framer-motion';

// Variants for the main content container to stagger the animation of its children.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

// Variants for individual text items (headline and paragraph) to fade in and slide up.
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

// Variants for the background beams to control their initial appearance.
// They will fade in and scale up smoothly before the CSS spin animation takes over.
const beamsVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

const AnimatedBeamsSection = () => {
  return (
    // Main container: full-width, dark background, and establishes a stacking context.
    <section className="relative isolate w-full overflow-hidden bg-gray-900 py-24 sm:py-32">
      {/* Content container: animated with Framer Motion to stagger its children.
          The animation triggers when the component scrolls into view. */}
      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={containerVariants as Variants}
      >
        <div className="mx-auto max-w-2xl text-center">
          {/* Animated headline */}
          <motion.h1
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
            variants={itemVariants as Variants}
          >
            A Visually Engaging Section
          </motion.h1>
          {/* Animated paragraph */}
          <motion.p
            className="mt-6 text-lg leading-8 text-gray-300"
            variants={itemVariants as Variants}
          >
            This component serves as a visually engaging standalone section, featuring a dynamic background with animated beams of light that appear to originate from the bottom and shoot upwards.
          </motion.p>
        </div>
      </motion.div>

      {/* Background container for the beams effect */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        {/* Dark background base */}
        <div className="absolute inset-0 h-full w-full bg-gray-900" />

        {/* Animated Beams: Framer Motion handles the initial fade-in and scale-up, 
            while the existing CSS class handles the continuous rotation. */}
        <motion.div
          className="absolute bottom-0 left-1/2 h-[200%] w-[200%] -translate-x-1/2 animate-[spin_12s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_70%,rgba(34,197,94,0.1)_0%,rgba(59,130,246,0.15)_50%,rgba(34,197,94,0.1)_100%)]"
          initial="hidden"
          animate="visible"
          variants={beamsVariants as Variants}
        />

        {/* Vignette overlay: a radial gradient mask to soften the edges of the effect and focus the eye. */}
        <div className="absolute inset-0 h-full w-full bg-gray-900 [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]" />
      </div>
    </section>
  );
};

export default AnimatedBeamsSection;