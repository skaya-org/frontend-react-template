import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// No other components to import, so we define the interface here.

/**
 * @interface ResumeHeaderProps
 * @description Defines the properties for the ResumeHeader component.
 * This interface structures the data required to populate the resume header,
 * including personal identification and contact information.
 */
export interface ResumeHeaderProps {
  /**
   * The full name of the individual.
   * @type {string}
   * @example "Amelia Chen"
   */
  name: string;

  /**
   * The professional title or headline.
   * @type {string}
   * @example "Senior Fullstack/TypeScript Developer"
   */
  title: string;

  /**
   * An object containing various methods of contact.
   * @type {object}
   */
  contact?: {
    /**
     * The email address, which will be formatted as a 'mailto:' link.
     * @type {string}
     * @example "amelia.chen@dev.io"
     */
    email: string;

    /**
     * The phone number, which will be formatted as a 'tel:' link.
     * @type {string}
     * @example "+1 415-555-0101"
     */
    phone: string;

    /**
     * The physical location, typically city and country or state.
     * @type {string}
     * @example "San Francisco, USA"
     */
    location: string;

    /**
     * The full URL to the LinkedIn profile.
     * @type {string}
     * @example "https://linkedin.com/in/ameliachen"
     */
    linkedin: string;

    /**
     * The full URL to a personal portfolio or professional website.
     * @type {string}
     * @example "https://ameliachen.dev"
     */
    portfolio: string;
  };
}

/**
 * @constant headerContainerVariants
 * @description Animation variants for the main header container.
 * Orchestrates the staggered animation of its direct children.
 */
const headerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

/**
 * @constant leftBlockVariants
 * @description Animation variants for the left block (name and title).
 * Animates with a slide-in from the left and fade-in effect.
 */
const leftBlockVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

/**
 * @constant rightBlockVariants
 * @description Animation variants for the right block (contact list).
 * It slides in from the right and staggers its own children's animations.
 */
const rightBlockVariants: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      staggerChildren: 0.1,
    },
  },
};

/**
 * @constant contactItemVariants
 * @description Animation variants for individual contact list items.
 * Animates with a subtle slide-up and fade-in effect.
 */
const contactItemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120 },
  },
};

/**
 * @component ResumeHeader
 * @description Renders the header section of a resume with animations.
 * It prominently displays the person's name and professional title,
 * alongside a list of key contact information. This component is designed to be
 * clean, professional, and the first major element a recruiter sees.
 * It is a pure presentational component that relies on the props passed to it.
 *
 * For robustness in a larger application, the parent component that fetches
 * and provides the data for `ResumeHeader` should be wrapped in a React Error Boundary
 * to handle potential data fetching or processing errors gracefully.
 *
 * @param {ResumeHeaderProps} props The props object containing the header data.
 * @returns {JSX.Element} The rendered TSX for the resume header.
 *
 * @example
 * const headerData = {
 *   name: "Amelia Chen",
 *   title: "Senior Fullstack/TypeScript Developer",
 *   contact: {
 *     email: "amelia.chen@dev.io",
 *     phone: "+1 415-555-0101",
 *     location: "San Francisco, USA",
 *     linkedin: "https://linkedin.com/in/ameliachen",
 *     portfolio: "https://ameliachen.dev"
 *   }
 * };
 *
 * <ResumeHeader {...headerData} />
 */
const ResumeHeader = ({ name, title, contact }: ResumeHeaderProps): JSX.Element => {
  return (
    <motion.header
      className="flex justify-between items-start py-6 mb-6 font-sans border-b-2 border-gray-200"
      variants={headerContainerVariants as Variants}
      initial="hidden"
      animate="visible"
      aria-labelledby="resume-name"
    >
      <motion.div variants={leftBlockVariants as Variants}>
        <h1 id="resume-name" className="text-4xl font-bold text-gray-900">{name}</h1>
        <p className="mt-1 text-xl text-gray-600">{title}</p>
      </motion.div>
      {contact &&
      <motion.ul
        className="list-none text-right space-y-1.5"
        variants={rightBlockVariants as Variants}
        aria-label="Contact Information"
      >
        <motion.li className="text-sm" variants={contactItemVariants as Variants}>
           <a href={`mailto:${contact.email}`} className="font-medium text-blue-600 hover:underline">
             {contact.email}
           </a>
        </motion.li>
        <motion.li className="text-sm" variants={contactItemVariants as Variants}>
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="font-medium text-blue-600 hover:underline">
            {contact.phone}
          </a>
        </motion.li>
        <motion.li className="text-sm" variants={contactItemVariants as Variants}>
          <span className="text-gray-800">{contact.location}</span>
        </motion.li>
        <motion.li className="text-sm" variants={contactItemVariants as Variants}>
           <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
             LinkedIn
           </a>
        </motion.li>
        <motion.li className="text-sm" variants={contactItemVariants as Variants}>
           <a href={contact.portfolio} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
             Portfolio
           </a>
        </motion.li>
      </motion.ul>
}
    </motion.header>
  );
};

export default ResumeHeader;