import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Import motion and Variants
import Card from '../Card/Card';
import Button from '../Button/Button';

/**
 * @interface ProjectData
 * @typedef {Object} ProjectData
 * Defines the structure for a single project's data.
 * @property {string} title - The title of the project.
 * @property {string} description - A brief description of the project.
 * @property {string} image - The URL of the project's image (e.g., thumbnail or hero image).
 * @property {string} [liveLink] - Optional URL to the live demo or deployed version of the project.
 * @property {string} [repoLink] - Optional URL to the project's source code repository (e.g., GitHub).
 */
interface ProjectData {
  title: string;
  description: string;
  image: string;
  liveLink?: string;
  repoLink?: string;
}

/**
 * Constant data for the project to be displayed.
 * This component strictly adheres to the guideline of not accepting external props;
 * all display data is internally defined and static.
 * @type {ProjectData}
 */
const PROJECT_DATA: ProjectData = {
  title: "EcoConnect Dashboard",
  description: "An interactive dashboard for monitoring environmental data, visualizing sensor readings, and managing smart agriculture systems. Built with real-time data streaming capabilities and a focus on user experience.",
  image: "https://picsum.photos/400/250?random=1.webp", // Using a random image from picsum.photos with webp format
  liveLink: "https://example.com/ecoconnect",
  repoLink: "https://github.com/example/ecoconnect-repo",
};

// --- Framer Motion Variants Definitions ---

// Variants for the main container wrapping the entire card
const containerVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren", // Parent animation runs first
      staggerChildren: 0.2,    // Stagger immediate children (the actual card body)
    },
  },
};

// Variants for the inner card structure (the div with rounded-lg)
const cardContentVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren", // Card body animates before its internal children
      staggerChildren: 0.1,    // Stagger its children (image, text content)
      delayChildren: 0.2,      // Delay before internal elements start animating
    },
  },
};

// Variants for the project image
const imageVariants: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Variants for the content section (p-5 div) containing title, description, and buttons
const textContentSectionVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1, // Stagger text elements (title, description) and buttons container
      delayChildren: 0.1,    // Slight delay for these elements to appear after section itself
    },
  },
};

// Variants for general text items (h3 and p)
const textItemVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Variants for the buttons container (flex flex-wrap div)
const buttonsContainerVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1, // Stagger individual buttons
    },
  },
};

// Variants for individual buttons (the <a> tags inside Button component)
const buttonItemVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  whileHover: { scale: 1.05 }, // Scale up slightly on hover
  whileTap: { scale: 0.95 },   // Scale down slightly on tap
};


/**
 * ProjectCard Component
 *
 * A dedicated React functional component designed for showcasing a single project.
 * It displays the project's title, a brief description, an associated image,
 * and optional action links (e.g., to a live demo or source code repository).
 *
 * This component strictly follows the guideline of not accepting any external props.
 * All the data displayed within the card is sourced from its internal `PROJECT_DATA` constant.
 *
 * It integrates with `Card` for base styling and structural layout, and `Button` for
 * interactive action elements. As per the strict guidelines, `Card` and `Button`
 * are treated as "self-fulfilled" components. This implies that they manage their
 * own internal logic and general styling and do not require specific data-driven
 * props (like `title="xyz"` or `href="abc"`) passed directly to them by `ProjectCard`.
 * Instead, `ProjectCard` provides content to these components as their children
 * (e.g., an `<img>` tag within `Card`, or an `<a>` tag within `Button`) to populate
 * their visual and interactive areas.
 *
 * The component also incorporates a subtle fade-in animation using `framer-motion`
 * and utilizes Tailwind CSS classes for styling, assuming `@tailwindcss/browser`
 * is available globally as instructed.
 *
 * @returns {JSX.Element} A React functional component rendering a project showcase card.
 */
const ProjectCard = (): JSX.Element => {
  const { title, description, image, liveLink, repoLink } = PROJECT_DATA;

  return (
    <motion.div
      variants={containerVariants as Variants} // Apply overall container animation
      initial="initial"
      animate="animate"
      // Tailwind CSS classes provide overall container styling for the card
      // These classes are suitable for centering and spacing the card responsive
      className="max-w-sm mx-auto my-8 p-4 sm:p-6 lg:p-8"
    >
      <Card/>
        <motion.div
          variants={cardContentVariants as Variants} // Apply animation to the actual card body
          className="rounded-lg overflow-hidden bg-white shadow-lg border border-gray-100"
        >
          {/* Project Image */}
          <motion.img
            variants={imageVariants as Variants} // Apply animation to the image
            src={image}
            alt={`Project Thumbnail for ${title}`}
            // Ensure image fills width, has fixed height, and covers its area
            className="w-full h-48 object-cover object-center"
            loading="lazy" // Optimize image loading
          />

          {/* Content section: padding, and flex layout for vertical distribution of elements */}
          <motion.div
            variants={textContentSectionVariants as Variants} // Apply animation to content wrapper
            className="p-5 flex flex-col justify-between"
          >
            {/* Project Title */}
            {/* Text size, font weight, color, and bottom margin */}
            <motion.h3
              variants={textItemVariants as Variants} // Apply animation to title
              className="text-2xl font-semibold text-gray-800 mb-2"
            >
              {title}
            </motion.h3>

            {/* Project Description */}
            {/* Text color, size, line height, bottom margin, and flex-grow to push buttons down */}
            <motion.p
              variants={textItemVariants as Variants} // Apply animation to description
              className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow"
            >
              {description}
            </motion.p>

            {/* Action Buttons Container */}
            {/* Flex layout for buttons, allowing wrap on smaller screens, gap for spacing,
                top border for visual separation, and auto top margin to stick to bottom */}
            <motion.div
              variants={buttonsContainerVariants as Variants} // Apply animation to buttons container
              className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 mt-auto"
            >
              {liveLink && (
              <motion.a
                    variants={buttonItemVariants as Variants} // Apply animation to the anchor tag
                    href={liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Tailwind classes for button styling: flex for alignment, full width/height,
                    // text color, padding, rounded corners, transitions, and specific background/hover/focus states.
                    className="flex items-center justify-center w-full h-full text-white no-underline px-4 py-2 rounded-md transition-colors duration-200
                               bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    View Live
                    {/* SVG icon for external link: spacing and size */}
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </motion.a>
              )}
              {repoLink && (
                  <motion.a
                    variants={buttonItemVariants as Variants} // Apply animation to the anchor tag
                    href={repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Tailwind classes for button styling: flex for alignment, full width/height,
                    // text color, padding, rounded corners, transitions, and specific background/hover/focus states.
                    className="flex items-center justify-center w-full h-full text-white no-underline px-4 py-2 rounded-md transition-colors duration-200
                               bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    View Repo
                    {/* SVG icon for repository link (e.g., GitHub): spacing and size */}
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a1 1 0 011-1h6a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                  </motion.a>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
    </motion.div>
  );
};

export default ProjectCard;