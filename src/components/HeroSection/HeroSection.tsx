import React from 'react';
import { motion, Variants } from 'framer-motion';

// Variants for the main container to orchestrate the animations
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

// Variants for the child elements (heading, paragraph, button)
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Introduction = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <motion.div
        className="py-20 px-4 mx-auto max-w-screen-xl text-center lg:py-24"
        variants={containerVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
          variants={itemVariants as Variants}
        >
          Jane Doe, Senior Product Designer
        </motion.h1>
        <motion.p
          className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
          variants={itemVariants as Variants}
        >
          I build accessible, inclusive products and digital experiences that are user-centric and beautifully crafted.
        </motion.p>
        <motion.div
          className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
          variants={itemVariants as Variants}
        >
          <a
            href="#contact"
            className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition-colors"
          >
            Get in touch
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Introduction;