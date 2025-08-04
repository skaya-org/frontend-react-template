import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Import motion and Variants
import BackgroundBeamsWithCollision from 'src/components/BackgroundBeamsWithCollision/BackgroundBeamsWithCollision';
import TypewriterEffect from 'src/components/TypewriterEffect/TypewriterEffect';
import ContainerScrollAnimation from 'src/components/ContainerScrollAnimation/ContainerScrollAnimation';
import MeteorEffect from 'src/components/MeteorEffect/MeteorEffect';
import CanvasRevealEffect from 'src/components/CanvasRevealEffect/CanvasRevealEffect';

// Import effect components as specified, assuming they are self-contained and require no props

// Define general variants for sections and their children
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2, // Stagger children animations
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.1 } },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } },
};

/**
 * @description Main application component that integrates and showcases various effect components.
 * This component serves as the entry point and displays each effect in a distinct section or part of the layout.
 * As per requirements, this component does not accept any props from its parent.
 */
export const Aboutpage: React.FC = () => {
  return (
    // Main container div for the application page.
    // Adds a subtle fade-in to the entire page.
    <motion.div
      className="min-h-screen w-full bg-gray-950 text-white overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    >
      {/* Background Beams Effect: Used as a general background for the entire page */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeamsWithCollision /> {/* No props sent */}
      </div>

      {/* Section 1: Typewriter Effect for a prominent title */}
      <motion.section
        className="relative z-10 h-screen flex flex-col items-center justify-center p-8 text-center"
        variants={sectionVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }} // Triggers when 40% of the section is visible
      >
        <motion.div className="max-w-4xl mx-auto">
          {/* TypewriterEffect is self-animated, so its container benefits from staggerChildren */}
          <TypewriterEffect/>
          <motion.p className="mt-6 text-lg md:text-xl text-gray-400" variants={itemVariants as Variants}>
            Explore the captivating world of modern UI animations and interactive experiences.
          </motion.p>
          <motion.img
            src="https://picsum.photos/600/350.webp"
            alt="Abstract digital art"
            className="mt-10 mx-auto rounded-lg shadow-xl"
            variants={imageVariants as Variants}
          />
        </motion.div>
      </motion.section>

      {/* Section 2: Container Scroll Animation for a dynamic content area */}
      <motion.section
        className="relative z-10 w-full min-h-screen py-20 bg-gray-900 flex flex-col items-center justify-center"
        variants={sectionVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // Triggers when 30% of the section is visible
      >
        <motion.h2 className="text-4xl md:text-5xl font-bold text-center mb-16 px-4" variants={titleVariants as Variants}>
          Uncover Hidden Depths with Scroll Effects
        </motion.h2>
        <motion.div className="max-w-6xl mx-auto px-4 w-full">
          {/* ContainerScrollAnimation is self-animated */}
          <ContainerScrollAnimation />
          <motion.div className="mt-20 text-center text-gray-300">
            <motion.p className="text-lg md:text-xl mb-8" variants={itemVariants as Variants}>
              Experience content that unfolds as you scroll, revealing new layers of design.
            </motion.p>
            <motion.img
              src="https://picsum.photos/800/450"
              alt="Dynamic content preview"
              className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
              variants={imageVariants as Variants}
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Section 3: Meteor Effect as a mesmerizing background for a focused message */}
      <motion.section
        className="relative z-10 w-full min-h-[600px] flex items-center justify-center p-8"
        variants={sectionVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // Triggers when 30% of the section is visible
      >
        <div className="absolute inset-0">
          <MeteorEffect /> {/* MeteorEffect is self-animated */}
        </div>
        <motion.div className="relative z-20 text-center max-w-3xl mx-auto p-8 bg-black bg-opacity-70 rounded-xl shadow-2xl border border-gray-700">
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-400" variants={titleVariants as Variants}>
            A Glimpse Into the Future of UI
          </motion.h2>
          <motion.p className="text-lg md:text-xl text-gray-300" variants={itemVariants as Variants}>
            Witness an ever-changing celestial display enhancing your digital experience.
          </motion.p>
          <motion.img
            src="https://picsum.photos/450/300.webp"
            alt="Futuristic interface concept"
            className="mt-8 mx-auto rounded-md shadow-md"
            variants={imageVariants as Variants}
          />
        </motion.div>
      </motion.section>

      {/* Section 4: Canvas Reveal Effect for an interactive call to action or message */}
      <motion.section
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-8 bg-gray-950"
        variants={sectionVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // Triggers when 30% of the section is visible
      >
        <motion.h2 className="text-4xl md:text-5xl font-bold mb-12 text-center px-4" variants={titleVariants as Variants}>
          Unveil the Unexpected
        </motion.h2>
        <motion.div className="w-full max-w-5xl h-[400px] md:h-[500px] flex items-center justify-center rounded-lg overflow-hidden relative shadow-lg" variants={itemVariants as Variants}>
          <CanvasRevealEffect /> {/* CanvasRevealEffect is self-animated */}
        </motion.div>
        <motion.p className="mt-12 text-xl text-gray-400 text-center px-4" variants={itemVariants as Variants}>
          Interact with our hidden messages and discover compelling content.
        </motion.p>
        <motion.img
          src="https://picsum.photos/700/400"
          alt="Interactive design elements"
          className="mt-10 mx-auto rounded-lg shadow-xl"
          variants={imageVariants as Variants}
        />
      </motion.section>

      {/* Footer Section */}
      <motion.footer
        className="relative z-10 w-full py-10 bg-gray-900 text-center text-gray-500"
        variants={sectionVariants as Variants} // Reusing sectionVariants for a simple fade/slide up
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.8 }} // Triggers when 80% of the footer is visible
      >
        <motion.p variants={itemVariants as Variants}>&copy; 2023 Dynamic UI Showcase. All rights reserved.</motion.p>
        <motion.p className="mt-2 text-sm" variants={itemVariants as Variants}>Powered by modern React and cutting-edge effects.</motion.p>
      </motion.footer>
    </motion.div>
  );
};

// Default export, preserving the original component's export structure
export default Aboutpage;