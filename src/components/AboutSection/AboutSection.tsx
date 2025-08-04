import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Corrected import to framer-motion as per instructions

/**
 * Constant data for the About Section content.
 * All content is strictly internal and immutable, ensuring the component
 * remains self-contained and does not require external props for its core data.
 */
const ABOUT_HEADING: string = "About Me";
const ABOUT_DESCRIPTION: string = `
  Hello! I'm a seasoned fullstack TypeScript developer with over a decade of experience
  crafting robust, scalable, and high-performance production-grade applications.
  My expertise spans across front-end frameworks like React,
  back-end technologies such as Node.js, and various databases.
  I am passionate about clean code, continuous learning, and building intuitive
  user experiences that delight. My journey in development has equipped me
  with a deep understanding of software architecture, system design,
  and delivering impactful solutions from concept to deployment.
  I thrive in dynamic environments and am always eager to tackle new challenges
  and contribute to innovative projects.
`;
const ABOUT_IMAGE_URL: string = "https://picsum.photos/400/500.webp"; // Using a larger image suitable for a section
const ABOUT_IMAGE_ALT: string = "A professional portrait of the developer, smiling confidently.";

/**
 * Define Framer Motion Variants for each animated element.
 * This encapsulates the animation properties (initial state, target state, transitions)
 * into reusable objects, making the component cleaner and more maintainable.
 */

// Variants for the main section container
const sectionVariants: Variants = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Variants for the image container
const imageVariants: Variants = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } },
};

// Variants for the heading (h2)
const headingVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.4, ease: "easeOut" } },
};

// Variants for the description paragraph (p)
const descriptionVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.6, ease: "easeOut" } },
};


/**
 * AboutSection React Component.
 *
 * This component provides a dedicated section to display information about an
 * individual or organization. It is designed to be fully self-sufficient,
 * rendering a heading, a detailed descriptive text, and a relevant image.
 *
 * All content rendered by AboutSection is sourced exclusively from internal,
 * constant data, adhering to the principle of not accepting any external props
 * for its primary functionality. This design ensures the component is highly
 * stable and predictable, making it ideal for static content display areas
 * such as "About Us" or "About Me" sections.
 *
 * It leverages the `framer-motion` library for subtle entrance animations,
 * enhancing the user experience upon component visibility. Styling is applied
 * using standard Tailwind CSS classes.
 *
 * @returns {JSX.Element} A React functional component displaying the About section.
 *
 * @remarks
 * - **No Props**: This component strictly adheres to the guideline of not
 *   accepting any props from its parent. All data is internally managed.
 * - **No Child Component Props**: No props or interfaces are passed to
 *   any potential child components, as all rendering is handled directly
 *   within this component for simplicity and adherence to the self-contained
 *   component principle.
 * - **Error Boundaries**: For a purely presentational component like this
 *   (which renders static data without complex logic or external dependencies),
 *   an internal error boundary is generally not necessary. Error boundaries
 *   are typically implemented at a higher level in the application's component
 *   tree to catch rendering errors in child components.
 */
const AboutSection = (): JSX.Element => {
  return (
    <motion.section
      id="about"
      className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center"
      variants={sectionVariants as Variants} // Apply main section variants
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        {/* About Image Container */}
        <motion.div
          className="flex-shrink-0"
          variants={imageVariants as Variants} // Apply image container variants
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src={ABOUT_IMAGE_URL}
            alt={ABOUT_IMAGE_ALT}
            // Tailwind classes for styling: responsive width, rounded corners, shadow, and border
            className="rounded-lg shadow-xl w-64 h-auto object-cover md:w-80 md:h-auto border-4 border-gray-200 dark:border-gray-700"
            width={400} // Explicit width for optimized loading and layout shifts
            height={500} // Explicit height for optimized loading and layout shifts
            loading="lazy" // Defer loading of images that are off-screen
          />
        </motion.div>

        {/* About Content Text */}
        <div className="md:text-left flex-1">
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight"
            variants={headingVariants as Variants} // Apply heading variants
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.3 }}
          >
            {ABOUT_HEADING}
          </motion.h2>

          <motion.p
            className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto md:mx-0"
            variants={descriptionVariants as Variants} // Apply description variants
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.3 }}
          >
            {ABOUT_DESCRIPTION.trim()} {/* Trim whitespace for clean rendering */}
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;