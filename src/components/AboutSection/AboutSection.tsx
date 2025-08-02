import React from 'react';
import { motion, Variants } from 'framer-motion';

// A sample list of skills to be displayed in the component.
const skills = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'GraphQL',
  'Design Systems',
  'Figma',
  'UI/UX Design',
];

// Animation variants for the main container to orchestrate the children's animations.
const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

// Animation variants for the main content blocks (image and text content).
// A subtle slide-up and fade-in effect.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

// Animation variants for the container of the skill tags to stagger them.
const skillsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for each individual skill tag for a pop-in effect.
const skillTagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'backOut',
    },
  },
};

/**
 * A section detailing the user's background, skills, and experience.
 * It features a responsive layout with a profile image and a styled list of skills.
 */
const AboutSection = () => {
  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          variants={sectionVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Profile Image */}
          <motion.div
            className="flex justify-center lg:justify-start"
            variants={itemVariants as Variants}
          >
            <img
              className="h-48 w-48 rounded-full object-cover shadow-xl ring-4 ring-gray-200 dark:ring-gray-800 sm:h-64 sm:w-64"
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
              alt="Profile picture of the user"
            />
          </motion.div>

          {/* About Me Content */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants as Variants}
          >
            <div className="text-base leading-7 text-gray-700 dark:text-gray-300">
              <p className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">About Me</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                A Passionate Developer and Design Enthusiast
              </h1>
              <div className="max-w-xl space-y-6">
                <p className="mt-6">
                  With over a decade of experience in front-end development and UI design, I specialize in creating intuitive, high-performance web applications. My passion lies at the intersection of design and technology, where I architect robust design systems that bridge the gap between designers and developers, ensuring consistency and accelerating production.
                </p>
                <p>
                  I thrive on solving complex problems and am dedicated to building products that are not only beautiful but also accessible and a joy to use. My approach is user-centric, focusing on creating meaningful experiences through clean code and thoughtful design.
                </p>
              </div>
            </div>

            {/* Skills List */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                My Core Skills
              </h2>
              <motion.div
                className="mt-4 flex flex-wrap gap-2"
                variants={skillsContainerVariants as Variants}
              >
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-800"
                    variants={skillTagVariants as Variants}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutSection;