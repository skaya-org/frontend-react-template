import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import Icon from 'src/components/Icon/Icon';

/**
 * Represents the properties for the Footer component.
 * @interface FooterProps
 */
export interface FooterProps {
  /**
   * Optional custom CSS class name(s) to apply to the footer's root element.
   * This allows for custom styling from parent components.
   * @type {string}
   * @optional
   */
  className?: string;

  /**
   * The name of the company to display in the footer.
   * @type {string}
   * @default 'YourCompany'
   */
  companyName?: string;

  /**
   * A short description or slogan for the company.
   * @type {string}
   * @default 'Building innovative solutions for the future.'
   */
  companyDescription?: string;

  /**
   * An array of navigation links to display in the footer.
   * Each object should have a `label` for the text and a `to` for the path.
   * @type {{ label: string; to: string }[]}
   * @optional
   */
  navLinks?: { label: string; to: string }[];

  /**
   * An array of social media links.
   * Each object should have a `name` for the platform and a `url` for the link.
   * The 'name' should correspond to a valid Icon name.
   * @type {{ name: string; url: string }[]}
   * @optional
   */
  socialLinks?: { name: string; url: string }[];
}

/**
 * @constant DEFAULT_NAV_LINKS
 * @description Default navigation links for the footer if none are provided.
 */
const DEFAULT_NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy' },
];

/**
 * @constant DEFAULT_SOCIAL_LINKS
 * @description Default social media links for the footer if none are provided.
 * The 'name' property should match an available icon name (e.g., 'twitter', 'linkedin', 'github').
 */
const DEFAULT_SOCIAL_LINKS = [
  { name: 'Twitter', url: 'https://twitter.com' },
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'GitHub', url: 'https://github.com' },
];

// --- Framer Motion Variants ---

/**
 * @constant footerContainerVariants
 * @description Animation variants for the main footer container and nested lists.
 * This orchestrates a staggered animation for its children when it comes into view.
 */
const footerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

/**
 * @constant sectionVariants
 * @description Animation variants for each individual section within the footer.
 * Creates a subtle "fade in and slide up" effect.
 */
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * @constant linkItemVariants
 * @description Animation variants for individual list items (nav links, social icons).
 * Creates a granular staggering effect, sliding in from the left.
 */
const linkItemVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * A responsive and comprehensive footer component for the application.
 * It displays company information, navigation links, social media links, and a copyright notice,
 * all animated with Framer Motion.
 *
 * @component
 * @param {FooterProps} props - The properties for the Footer component.
 * @returns {JSX.Element} The rendered footer component.
 *
 * @example
 * <Footer
 *   companyName="Innovate Inc."
 *   companyDescription="Pioneering the next generation of web technology."
 * />
 */
const Footer = ({
  className = '',
  companyName = 'YourCompany',
  companyDescription = 'Building innovative solutions for the future.',
  navLinks = DEFAULT_NAV_LINKS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
}: FooterProps): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className={`bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 ${className}`}
      variants={footerContainerVariants as Variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info Section */}
          <motion.div
            className="md:col-span-2 lg:col-span-1"
            variants={sectionVariants as Variants}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {companyName}
            </h3>
            <p className="mt-4 text-base">{companyDescription}</p>
          </motion.div>

          {/* Spacer for alignment on medium screens */}
          <div className="hidden lg:block"></div>

          {/* Navigation Links Section */}
          <motion.div variants={sectionVariants as Variants}>
            <h4 className="text-sm font-semibold tracking-wider text-gray-900 dark:text-white uppercase">
              Quick Links
            </h4>
            <motion.ul
              className="mt-4 space-y-4"
              variants={footerContainerVariants as Variants}
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.to}
                  variants={linkItemVariants as Variants}
                  whileHover={{ scale: 1.05, originX: 0 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.to}
                    className="text-base hover:text-gray-900 dark:hover:text-white transition-colors duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Social Media Links Section */}
          <motion.div variants={sectionVariants as Variants}>
            <h4 className="text-sm font-semibold tracking-wider text-gray-900 dark:text-white uppercase">
              Follow Us
            </h4>
            <motion.div
              className="mt-4 flex space-x-6"
              variants={footerContainerVariants as Variants}
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                  aria-label={`Follow us on ${social.name}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  variants={linkItemVariants as Variants}
                >
                  <Icon
                    className="h-6 w-6" svgContent={'icon'}                  />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Footer Bottom Bar with Copyright */}
        <motion.div
          className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8 text-center"
          variants={sectionVariants as Variants}
        >
          <p className="text-base">
            &copy; {currentYear} {companyName}. All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;