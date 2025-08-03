import React, { JSX, FC } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

// ============================================================================
// Animation Variants
// ============================================================================

/**
 * Variants for the main footer container.
 * It orchestrates the staggering animation of its direct children (the columns).
 */
const footerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

/**
 * Variants for each column in the footer.
 * They fade and slide in, and also act as a stagger container for their own content.
 */
const columnVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1, // Stagger links/items within the column
    },
  },
};

/**
 * Variants for individual list items (links, address lines) within a column.
 * Creates a cascading effect.
 */
const itemVariants: Variants = {
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
 * Variants for the social media icons.
 * A slightly different pop-in effect for visual variety.
 */
const socialIconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
};


// ============================================================================
// SVG Icon Components
// ============================================================================

/**
 * A generic icon wrapper to provide consistent styling and accessibility.
 * @param {object} props - The component props.
 * @param {JSX.Element} props.children - The SVG path elements.
 * @param {string} props.title - The accessible title for the icon.
 * @returns {JSX.Element} A styled SVG icon.
 */
const IconWrapper: FC<{ children: JSX.Element; title: string }> = ({ children, title }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="block h-6 w-6"
    aria-labelledby={title.toLowerCase().replace(' ', '-') + '-title'}
    role="img"
  >
    <title id={title.toLowerCase().replace(' ', '-') + '-title'}>{title}</title>
    {children}
  </svg>
);

/**
 * Renders the Twitter/X social media icon.
 * @returns {JSX.Element} The Twitter/X SVG icon.
 */
const TwitterIcon: FC = () => (
  <IconWrapper title="Twitter/X">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </IconWrapper>
);

/**
 * Renders the LinkedIn social media icon.
 * @returns {JSX.Element} The LinkedIn SVG icon.
 */
const LinkedInIcon: FC = () => (
  <IconWrapper title="LinkedIn">
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.25 6.5 1.75 1.75 0 0 1 6.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.62 1.62 0 0 0 13 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.1 1.16 3.1 3.99z" />
  </IconWrapper>
);

/**
 * Renders the GitHub social media icon.
 * @returns {JSX.Element} The GitHub SVG icon.
 */
const GitHubIcon: FC = () => (
  <IconWrapper title="GitHub">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 22 12 10 10 0 0 0 12 2z" />
  </IconWrapper>
);


// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Defines the structure for a navigation link in the footer.
 * @typedef {object} QuickLink
 * @property {string} label - The visible text for the link.
 * @property {string} to - The route path for react-router-dom's Link component.
 */
type QuickLink = {
  label: string;
  to: string;
};

/**
 * Defines the structure for a social media link in the footer.
 * @typedef {object} SocialMediaLink
 * @property {string} name - The name of the social media platform (for accessibility).
 * @property {string} href - The external URL to the social media profile.
 * @property {JSX.Element} icon - The SVG icon component for the platform.
 */
type SocialMediaLink = {
  name: string;
  href: string;
  icon: JSX.Element;
};

/**
 * Defines the structure for the company's contact information.
 * @typedef {object} ContactInfo
 * @property {string[]} address - An array of strings representing the company's physical address lines.
 * @property {string} phone - The company's contact phone number.
 * @property {string} email - The company's contact email address.
 */
type ContactInfo = {
  address: string[];
  phone: string;
  email: string;
};


// ============================================================================
// Constant Data
// ============================================================================

/**
 * An array of quick navigation links for the footer.
 * @type {readonly QuickLink[]}
 */
const QUICK_LINKS: readonly QuickLink[] = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Contact', to: '/contact' },
];

/**
 * An object containing company contact information.
 * @type {Readonly<ContactInfo>}
 */
const CONTACT_INFO: Readonly<ContactInfo> = {
  address: ['123 Innovation Drive', 'Suite 101', 'Tech City, TX 75001'],
  phone: '+1 (555) 123-4567',
  email: 'hello@company.com',
};

/**
 * An array of social media links with their corresponding icons.
 * @type {readonly SocialMediaLink[]}
 */
const SOCIAL_MEDIA_LINKS: readonly SocialMediaLink[] = [
  { name: 'Twitter/X', href: 'https://x.com', icon: <TwitterIcon /> },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: <LinkedInIcon /> },
  { name: 'GitHub', href: 'https://github.com', icon: <GitHubIcon /> },
];

// ============================================================================
// Main Component
// ============================================================================

const MotionLink = motion(Link);

/**
 * A self-contained, production-grade footer component.
 * It displays quick links, company contact information, and social media icons.
 * All data is hardcoded within the component, so no props are required.
 *
 * @component
 * @returns {JSX.Element} The rendered footer element.
 */
const Footer: FC = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="bg-zinc-900 font-sans text-zinc-200 leading-relaxed px-6 py-12 overflow-hidden"
      role="contentinfo"
      variants={footerContainerVariants as Variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="mx-auto max-w-7xl flex flex-wrap justify-between gap-8">
        {/* Quick Links Column */}
        <motion.div
          className="flex-1 basis-[250px] min-w-[250px]"
          variants={columnVariants as Variants}
        >
          <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-white">Quick Links</h3>
          <nav aria-label="Footer Quick Links">
            <motion.ul className="m-0 list-none p-0">
              {QUICK_LINKS.map((link) => (
                <motion.li
                  key={link.to}
                  className="mb-2.5"
                  variants={itemVariants as Variants}
                >
                  <MotionLink
                    to={link.to}
                    className="inline-block text-zinc-200 no-underline transition-colors duration-200 hover:text-white"
                    whileHover={{ scale: 1.05, color: '#ffffff' }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </MotionLink>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
        </motion.div>

        {/* Contact Info Column */}
        <motion.div
          className="flex-1 basis-[250px] min-w-[250px]"
          variants={columnVariants as Variants}
        >
          <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-white">Contact Us</h3>
          <motion.address className="not-italic">
            {CONTACT_INFO.address.map((line, index) => (
              <motion.p
                key={index}
                className="m-0 mb-2.5 text-zinc-200"
                variants={itemVariants as Variants}
              >
                {line}
              </motion.p>
            ))}
            <motion.p
              className="m-0 mb-2.5 text-zinc-200"
              variants={itemVariants as Variants}
            >
              <motion.a
                href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`}
                className="text-zinc-200 no-underline transition-colors duration-200 hover:text-white"
                whileHover={{ scale: 1.05, color: '#ffffff' }}
                transition={{ duration: 0.2 }}
              >
                {CONTACT_INFO.phone}
              </motion.a>
            </motion.p>
            <motion.p
              className="m-0 mb-2.5 text-zinc-200"
              variants={itemVariants as Variants}
            >
              <motion.a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-zinc-200 no-underline transition-colors duration-200 hover:text-white"
                whileHover={{ scale: 1.05, color: '#ffffff' }}
                transition={{ duration: 0.2 }}
              >
                {CONTACT_INFO.email}
              </motion.a>
            </motion.p>
          </motion.address>
        </motion.div>

        {/* Social Media Column */}
        <motion.div
          className="flex-1 basis-[250px] min-w-[250px]"
          variants={columnVariants as Variants}
        >
          <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-white">Follow Us</h3>
          <motion.div
            className="mt-4 flex gap-4"
            variants={columnVariants as Variants} // Re-use for inner staggering
          >
            {SOCIAL_MEDIA_LINKS.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${social.name}`}
                className="inline-block text-zinc-200"
                variants={socialIconVariants as Variants}
                whileHover={{ scale: 1.2, y: -2, color: '#ffffff' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Copyright Section */}
      <motion.div
        className="mt-12 border-t border-zinc-700 pt-6 text-center text-sm text-zinc-500"
        variants={columnVariants as Variants} // Treat it like the final staggered item for a consistent effect
      >
        &copy; {currentYear} Your Company Name. All Rights Reserved.
      </motion.div>
    </motion.footer>
  );
};

export default Footer;