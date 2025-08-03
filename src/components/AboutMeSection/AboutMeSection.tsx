import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

//==============================================================================
// INTERFACES
//==============================================================================

/**
 * @interface ProfileImageProps
 * @description Defines the properties for the profile image.
 * This interface is exported to allow its use in parent components for type consistency.
 */
export interface ProfileImageProps {
  /**
   * The source URL of the image.
   * @type {string}
   */
  src: string;
  /**
   * The alternative text for the image, crucial for accessibility.
   * @type {string}
   */
  alt: string;
}

/**
 * @interface CallToActionProps
 * @description Defines the properties for the call-to-action button.
 * This interface is exported for use in other parts of the application.
 */
export interface CallToActionProps {
  /**
   * The text to display on the button.
   * @type {string}
   */
  text: string;
  /**
   * The destination URL for the link. This can be an internal path (e.g., '/contact')
   * or a full external URL (e.g., 'https://github.com').
   * @type {string}
   */
  to: string;
  /**
   * If true, the link will be rendered as a standard `<a>` tag with `target="_blank"`,
   * suitable for external links. If false or undefined, it will be rendered as a
   * `react-router-dom` `<Link>` for internal navigation.
   * @type {boolean}
   * @default false
   */
  isExternal?: boolean;
}

/**
 * @interface AboutMeSectionProps
 * @description Defines the props for the AboutMeSection component.
 * It's designed to be flexible, with most props being optional to ensure
 * the component can render even with minimal data.
 */
export interface AboutMeSectionProps {
  /**
   * The main heading for the section.
   * @type {string}
   * @default 'About Me'
   */
  heading?: string;
  /**
   * An array of strings, where each string is a paragraph of the biography.
   * @type {string[]}
   * @default ['A brief introduction will be displayed here...']
   */
  paragraphs?: string[];
  /**
   * The profile image details, conforming to the ProfileImageProps interface.
   * If not provided, a default placeholder will be used.
   * @type {ProfileImageProps}
   */
  profileImage?: ProfileImageProps;
  /**
   * A list of skills or technologies to display.
   * @type {string[]}
   * @default ['TypeScript', 'React', 'Node.js', 'System Design']
   */
  skills?: string[];
  /**
   * Optional details for a call-to-action button, conforming to the CallToActionProps interface.
   * The button will not be rendered if this prop is not provided.
   * @type {CallToActionProps}
   */
  callToAction?: CallToActionProps;
}

//==============================================================================
// DEFAULT DATA AND STYLES
//==============================================================================

/**
 * @constant defaultProps
 * @description Provides default values for the component's props to ensure robustness
 * and prevent runtime errors if props are not supplied.
 */
const defaultProps: Required<Pick<AboutMeSectionProps, 'heading' | 'paragraphs' | 'skills'>> = {
    heading: 'About Me',
    paragraphs: [
        'Hello! I am a passionate developer with a knack for creating elegant solutions in the least amount of time.',
        'My journey in web development started years ago, and since then, I have been honing my skills in various technologies, always striving to write clean, efficient, and maintainable code.'
    ],
    skills: ['TypeScript', 'React', 'Node.js', 'Next.js', 'GraphQL', 'System Design']
};

/**
 * @constant defaultProfileImage
 * @description A default placeholder for the profile image.
 */
const defaultProfileImage: ProfileImageProps = {
    src: `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' fill='%23999' font-size='16' font-family='sans-serif' text-anchor='middle' dy='.3em'%3EProfile%3C/text%3E%3C/svg%3E`,
    alt: 'Default profile placeholder'
};


/**
 * AboutMeSection Component
 *
 * @component
 * @description A top-level section component designed to display biographical information.
 * It features a responsive layout, subtle animations, and is built to be highly
 * reusable and resilient to missing data by using sensible defaults.
 *
 * @param {AboutMeSectionProps} props - The props for configuring the component.
 * @returns {JSX.Element} The rendered AboutMeSection component.
 *
 * @example
 * const myProfileData = {
 *   heading: "About Jane Doe",
 *   paragraphs: [
 *     "I'm a software engineer specializing in frontend development.",
 *     "I love building beautiful and user-friendly interfaces."
 *   ],
 *   profileImage: {
 *     src: "/images/jane-doe.jpg",
 *     alt: "A picture of Jane Doe"
 *   },
 *   skills: ["React", "TypeScript", "Figma", "Web Accessibility"],
 *   callToAction: {
 *     text: "View My Work",
 *     to: "/portfolio"
 *   }
 * };
 *
 * <AboutMeSection {...myProfileData} />
 */
const AboutMeSection = ({
  heading = defaultProps.heading,
  paragraphs = defaultProps.paragraphs,
  profileImage = defaultProfileImage,
  skills = defaultProps.skills,
  callToAction,
}: AboutMeSectionProps): JSX.Element => {

  //--- ANIMATION VARIANTS ---//

  const sectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 12 },
    },
  };

  const textItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };
  
  const skillListVariants: Variants = {
    visible: { transition: { staggerChildren: 0.07 } },
    hidden: {},
  };

  const skillTagVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  //--- COMPONENT LOGIC & STYLES ---//

  // Motion-compatible Link component
  const MotionLink = motion(Link);

  // CSS classes for the CTA button. Removed transition classes to let Framer Motion handle them.
  const ctaButtonClasses = "inline-block self-start mt-4 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";


  return (
    <motion.section
      aria-labelledby="about-me-heading"
      className="font-sans bg-white py-12 md:py-16 px-6 md:px-8 rounded-xl max-w-5xl my-8 mx-auto shadow-lg flex flex-col lg:flex-row gap-8 lg:gap-12 items-start overflow-hidden"
      variants={sectionVariants as Variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="flex justify-center items-center w-full lg:w-1/3"
        variants={imageVariants as Variants}
      >
        <img
          src={profileImage.src}
          alt={profileImage.alt}
          className="w-44 h-44 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-lg shadow-blue-500/20"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent potential infinite loops on error.
            target.src = defaultProfileImage.src;
            target.alt = defaultProfileImage.alt;
          }}
        />
      </motion.div>

      <div className="flex flex-col gap-6 w-full lg:w-2/3">
        <motion.h2
            id="about-me-heading"
            className="text-4xl md:text-5xl font-bold text-slate-800"
            variants={textItemVariants as Variants}
        >
          {heading}
        </motion.h2>

        {paragraphs.map((text, index) => (
          <motion.p
            key={index}
            className="text-base md:text-lg leading-relaxed text-slate-600"
            variants={textItemVariants as Variants}
          >
            {text}
          </motion.p>
        ))}

        {skills.length > 0 && (
          <motion.div className="pt-4" variants={textItemVariants as Variants}>
            <h3 className="text-xl font-semibold text-slate-700 mb-4">Key Skills</h3>
            <motion.ul
              className="list-none p-0 m-0 flex flex-wrap gap-3"
              variants={skillListVariants as Variants}
            >
              {skills.map((skill) => (
                <motion.li
                  key={skill}
                  className="bg-slate-100 text-slate-700 py-1.5 px-4 rounded-full text-sm font-medium"
                  variants={skillTagVariants as Variants}
                >
                  {skill}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}

        {callToAction && (
          <motion.div variants={textItemVariants as Variants}>
            {callToAction.isExternal ? (
              <motion.a
                href={callToAction.to}
                target="_blank"
                rel="noopener noreferrer"
                className={ctaButtonClasses}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                {callToAction.text}
              </motion.a>
            ) : (
              <MotionLink
                to={callToAction.to}
                className={ctaButtonClasses}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                {callToAction.text}
              </MotionLink>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default AboutMeSection;