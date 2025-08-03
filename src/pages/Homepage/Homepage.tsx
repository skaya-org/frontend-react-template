import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import Header from "src/components/Header/Header";
import VisualizationDashboard from "src/components/VisualizationDashboard/VisualizationDashboard";
import CircuitBuilderWorkspace from "src/components/CircuitBuilderWorkspace/CircuitBuilderWorkspace";
import Footer from "src/components/Footer/Footer";

/**
 * Variants for the main container to orchestrate the animation of its children.
 * It staggers the children's animations for a sequential effect.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

/**
 * Variants for the individual child components (Header, Main content, Footer).
 * Each item will fade in and slide up into place.
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

/**
 * Homepage component.
 * This is the main application component that structures the entire platform.
 * It renders the Header, the primary content sections (VisualizationDashboard and CircuitBuilderWorkspace),
 * and the Footer. The layout is static to provide a seamless user experience.
 * The entire layout animates in on load for a smooth presentation.
 */
const Homepage = (): JSX.Element => {
  return (
    <motion.div
      className="flex flex-col h-screen bg-neutral-100 text-neutral-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants as Variants}>
        <Header />
      </motion.div>
      
      <motion.main
        className="flex flex-1 overflow-hidden"
        variants={itemVariants as Variants}
      >
        <VisualizationDashboard />
        <CircuitBuilderWorkspace />
      </motion.main>

      <motion.div variants={itemVariants as Variants}>
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default Homepage;