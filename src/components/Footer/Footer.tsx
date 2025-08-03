import React, { JSX, forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { motion, ForwardRefComponent, Variants } from 'framer-motion';

// --- Internal Data Constants ---

/**
 * The current year, calculated dynamically for the copyright notice.
 * This ensures the copyright year is always up-to-date without manual changes.
 * @type {number}
 */
const CURRENT_YEAR: number = new Date().getFullYear();

/**
 * The copyright text displayed in the footer.
 * @type {string}
 */
const COPYRIGHT_TEXT: string = `© ${CURRENT_YEAR} Cosmic Endeavors. All rights reserved.`;

/**
 * An array of navigation link objects for the footer.
 * Each object contains a display label and a route path for `react-router-dom`.
 * This structure makes it easy to add, remove, or modify footer links.
 * @type {Array<{label: string, to: string}>}
 */
const FOOTER_LINKS: { label: string; to: string }[] = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Star Map', to: '/map' },
];

// --- Motion-Enhanced Components & Variants ---

/**
 * Variants for the main footer container.
 * This orchestrates the animation of its children, making them appear in sequence
 * when the component enters the viewport.
 */
const containerVariants: Variants = {
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
 * Variants for individual child elements within the footer (navigation and copyright text).
 * They fade and slide up gently, triggered by the parent container's animation.
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * A Framer Motion-enhanced version of React Router's `Link` component.
 * This is created by wrapping the `Link` component with `motion()`,
 * allowing it to be animated directly. `Link` is compatible because it forwards refs.
 *
 * @type {ForwardRefComponent<HTMLAnchorElement, LinkProps>}
 */
const MotionLink: ForwardRefComponent<HTMLAnchorElement, LinkProps> = motion(
  forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => <Link {...props} ref={ref} />)
);

/**
 * Framer Motion variants for link hover effects.
 * Provides a subtle and smooth visual feedback on interaction, enhancing the user experience.
 */
const linkVariants: Variants = {
  initial: {
    opacity: 0.8,
  },
  hover: {
    opacity: 1,
    color: '#ffffff',
    scale: 1.08,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
  },
};

// --- Main Component ---

/**
 * A standard, self-contained footer component with a cosmic theme.
 *
 * This component renders a footer with copyright information and a set of navigation links.
 * It features an entrance animation that triggers when scrolled into view, with its
 * content staggering in for a polished effect.
 *
 * All content and styling are managed internally as constants, so it requires no props from its parent.
 * This design promotes encapsulation and reusability. It is intended to be wrapped by an ErrorBoundary
 * higher up in the component tree as a best practice.
 *
 * It leverages `react-router-dom` for client-side navigation and `framer-motion` for
 * engaging, theme-appropriate micro-interactions on the links.
 *
 * @example
 * // To use this component, simply render it in your page layout:
 * <Footer />
 *
 * @returns {JSX.Element} The rendered footer component.
 */
const Footer = (): JSX.Element => {
  return (
    <footer
      className="w-full bg-[#0a0a1a] py-10 px-6 text-[#d0d0e0] border-t border-[#2a2a3a] font-sans"
      role="contentinfo"
      aria-label="Site Footer"
    >
      <motion.div
        className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center"
        variants={containerVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.nav aria-label="Footer navigation" variants={itemVariants as Variants}>
          <ul className="m-0 flex list-none flex-wrap justify-center gap-x-8 gap-y-4 p-0">
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <MotionLink
                  to={link.to}
                  className="text-sm font-medium text-[#9f9fff] no-underline"
                  variants={linkVariants as Variants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {link.label}
                </MotionLink>
              </li>
            ))}
          </ul>
        </motion.nav>
        <motion.p className="mt-2 text-sm text-slate-500" variants={itemVariants as Variants}>
          {COPYRIGHT_TEXT}
        </motion.p>
      </motion.div>
    </footer>
  );
};

export default Footer;