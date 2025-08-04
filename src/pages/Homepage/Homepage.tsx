import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// Import new components as specified
import Navbar from 'src/components/Navbar/Navbar';
import HeroSection from 'src/components/HeroSection/HeroSection';
import AboutSection from 'src/components/AboutSection/AboutSection';
import ServicesSection from 'src/components/ServicesSection/ServicesSection';
import PortfolioSection from 'src/components/PortfolioSection/PortfolioSection';
import ContactSection from 'src/components/ContactSection/ContactSection';
import Footer from 'src/components/Footer/Footer';

/**
 * The main application entry point. This component will be clean and simple,
 * importing and rendering only the main 'HomePage' component to
 * display the entire user interface. It will be wrapped in a main container
 * with a dark, space-themed background color.
 * @returns {JSX.Element} The rendered HomePage component.
 */
const Homepage = (): JSX.Element => {
  /**
   * Defines the animation variants for the main page container.
   * This creates a gentle fade-in and slide-up effect when the application loads.
   * It also orchestrates the staggered appearance of its direct children (sections).
   */
  const pageVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20, // Start slightly below its final position
    },
    visible: {
      opacity: 1,
      y: 0, // Animate to its final position
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        when: 'beforeChildren', // Ensure parent animation completes or starts before children begin
        staggerChildren: 0.1, // Stagger children by 0.1 seconds each
      },
    },
  };

  /**
   * Defines the animation variants for each individual section.
   * This creates a gentle fade-in and slide-up effect for each section as it appears.
   * These variants are picked up by the `staggerChildren` transition of the parent `motion.div`.
   */
  const sectionVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50, // Start slightly below its final position
    },
    visible: {
      opacity: 1,
      y: 0, // Animate to its final position
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-[#020024] text-slate-100 antialiased"
      initial="hidden"
      animate="visible"
      variants={pageVariants as Variants}
    >
      {/* Orchestrate the layout by importing and arranging components */}
      {/* Each section is wrapped in a motion.div to participate in the staggered animation */}
      <motion.div variants={sectionVariants as Variants}>
        <Navbar />
      </motion.div>
      <motion.div variants={sectionVariants as Variants}>
        <HeroSection />
      </motion.div>
      <motion.div variants={sectionVariants as Variants}>
        <AboutSection />
      </motion.div>
      <motion.div variants={sectionVariants as Variants}>
        <ServicesSection />
      </motion.div>
      <motion.div variants={sectionVariants as Variants}>
        <PortfolioSection />
      </motion.div>
      <motion.div variants={sectionVariants as Variants}>
        <ContactSection />
      </motion.div>
      <motion.div variants={sectionVariants as Variants}>
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default Homepage;