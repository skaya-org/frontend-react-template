import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Import motion and Variants

/**
 * AboutMe component displays personal information.
 * It uses constant data internally and does not rely on props.
 */
const AboutMe = (): JSX.Element => {
  // Constant data for the name, as required.
  const name: string = 'Shubham Kuwanr';

  // Placeholder for other personal information (can be expanded later with more static data)
  const description: string = 'A passionate developer committed to building impactful web applications.';
  const imageUrl: string = 'https://picsum.photos/200/300.webp?random=1'; // Using a random image from picsum.photos

  // --- Framer Motion Variants ---

  // Variants for the main section, providing an overall fade-in and slide-up effect
  const sectionVariants: Variants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  // Variants for the heading, making it fade in and slide down slightly
  const headingVariants: Variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } },
  };

  // Variants for the profile image, scaling it in with a spring effect
  const imageVariants: Variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.4 } },
  };

  // Variants for the text container, setting up staggering for its children
  const textContainerVariants: Variants = {
    initial: { opacity: 0 }, // Parent container starts invisible (though children will do the main animating)
    animate: {
      opacity: 1, // Parent becomes visible
      transition: {
        staggerChildren: 0.15, // Delay between each child's animation
        delayChildren: 0.6,    // Delay before the children's animations start, relative to parent's 'animate'
      },
    },
  };

  // Variants for individual text paragraphs, making them slide in from the left and fade
  const textItemVariants: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  // Variants for the name span, giving it a slight scale-in effect
  const nameSpanVariants: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 150 } },
  };

  return (
    <motion.section
      className="p-8 bg-white shadow-lg rounded-lg max-w-2xl mx-auto my-8"
      variants={sectionVariants as Variants}
      initial="initial"
      animate="animate"
    >
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-6 border-b-2 pb-2 border-blue-500"
        variants={headingVariants as Variants}
      >
        About Me
      </motion.h2>
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex-shrink-0">
          <motion.img
            src={imageUrl}
            alt={`${name}'s profile picture`}
            className="rounded-full w-32 h-32 object-cover border-4 border-blue-400 shadow-md"
            loading="lazy"
            variants={imageVariants as Variants} // Apply image animation directly
          />
        </div>
        <motion.div
          className="text-center md:text-left"
          variants={textContainerVariants as Variants} // Parent for staggering text elements
          initial="initial"
          animate="animate"
        >
          <motion.p
            className="text-xl font-semibold text-gray-700 mb-2"
            variants={textItemVariants as Variants} // Apply staggered text animation
          >
            Hello, my name is <motion.span
              className="text-blue-600 font-bold"
              variants={nameSpanVariants as Variants} // Apply specific animation to the name span
            >
              {name}
            </motion.span>.
          </motion.p>
          <motion.p
            className="text-gray-600 leading-relaxed"
            variants={textItemVariants as Variants} // Apply staggered text animation
          >
            {description}
          </motion.p>
          <motion.p
            className="mt-4 text-sm text-gray-500"
            variants={textItemVariants as Variants} // Apply staggered text animation
          >
            (This component uses internal constant data and does not accept props.)
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutMe;