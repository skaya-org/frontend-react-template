import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import Header from 'src/components/Header/Header';
import HeroSection from 'src/components/HeroSection/HeroSection';
import ServicesSection from 'src/components/ServicesSection/ServicesSection';
import HowItWorksSection from 'src/components/HowItWorksSection/HowItWorksSection';
import TestimonialsSection from 'src/components/TestimonialsSection/TestimonialsSection';
import Footer from 'src/components/Footer/Footer';
import FaqSection from 'src/components/FaqSection/FaqSection';

// The prompt did not specify the paths for these components, but they are required by the sections.
// To ensure the file is complete and runnable, we include placeholders.
// Note: In a real scenario, these would be imported from their actual files.
// For the purpose of this task, we will assume the section components handle their own children.

/**
 * Variants for the header animation.
 * It slides down and fades in on page load.
 */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/**
 * Variants for the main content sections.
 * Each section fades in and slides up as it enters the viewport.
 */
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }, // A smooth, custom ease
  },
};

/**
 * Homepage component for the laundry service website.
 * This component assembles the main sections of the landing page,
 * acting as a container for various self-contained feature sections.
 * It is designed to be self-sufficient and does not accept any props,
 * with all content being managed by its child components.
 *
 * Animations are added using Framer Motion to enhance user experience.
 * Each section animates into view upon scrolling.
 */
const Homepage = (): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
      <motion.div
        variants={headerVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        <Header />
      </motion.div>
      <main className="flex-grow">
        {/* HeroSection animates on initial load */}
        <motion.div
          variants={sectionVariants as Variants}
          initial="hidden"
          animate="visible"
        >
          <HeroSection />
        </motion.div>

        {/* Subsequent sections animate when they scroll into view */}
        <motion.div
          variants={sectionVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <ServicesSection />
        </motion.div>

        <motion.div
          variants={sectionVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <HowItWorksSection />
        </motion.div>

        <motion.div
          variants={sectionVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <TestimonialsSection />
        </motion.div>

        <motion.div
          variants={sectionVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <FaqSection />
        </motion.div>
      </main>
      <motion.div
        variants={sectionVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
};

export default Homepage;