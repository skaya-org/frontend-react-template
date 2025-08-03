import React, { JSX, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { animate } from 'motion';
import { motion, Variants } from 'framer-motion';

// ============================================================================
// CONSTANTS
// All component data is hardcoded here to ensure zero prop drilling.
// ============================================================================

/**
 * @constant LOGO_DATA
 * @description Configuration for the game logo, including its image source,
 * alt text for accessibility, and navigation path.
 */
const LOGO_DATA = {
  src: 'https://picsum.photos/seed/vaporwave-logo/180/50.webp',
  alt: 'Synth Runner Game Logo',
  path: '/',
};

/**
 * @constant NAV_LINKS
 * @description An array of navigation link objects for the header menu.
 * Each object contains a display label and a destination path.
 */
const NAV_LINKS: Readonly<{ label: string; path: string }[]> = [
  { label: 'Features', path: '/features' },
  { label: 'Gallery', path: '/gallery' },
];

/**
 * @constant CTA_BUTTON
 * @description Configuration for the primary Call-to-Action (CTA) button.
 * Includes the button's text label and its destination path.
 */
const CTA_BUTTON = {
  label: 'Wishlist Now',
  path: '/wishlist',
};

// ============================================================================
// ANIMATION VARIANTS
// Framer Motion variants for orchestrating the component's animations.
// ============================================================================

/**
 * @constant headerVariants
 * @description Variants for the main header container. It orchestrates a
 * staggered animation for its direct children.
 */
const headerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/**
 * @constant headerChildVariants
 * @description Variants for individual children within the header.
 * Each child will fade in and slide down from above.
 */
const headerChildVariants: Variants = {
  hidden: { y: -30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14,
    },
  },
};

// ============================================================================
// HELPER COMPONENTS
// Internal components to keep the main component's render logic clean.
// ============================================================================

/**
 * NavLinkItem
 *
 * A private helper component that renders a single navigation link with a
 * self-contained hover state, following React best practices.
 *
 * @param {object} props - The properties for the navigation link.
 * @param {string} props.label - The text to display for the link.
 * @param {string} props.path - The navigation path for the link.
 * @returns {JSX.Element} A list item containing a styled navigation link.
 */
const NavLinkItem = ({
  label,
  path,
}: {
  label: string;
  path: string;
}): JSX.Element => {
  return (
    // The list item itself will be animated by its parent `ul` or `nav`.
    // We add interactive hover and tap animations here for better user feedback.
    <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={path}
        className="text-[#00ffff] text-base font-semibold uppercase tracking-[0.05em] transition-all duration-300 ease-in-out hover:text-white hover:[text-shadow:0_0_8px_#00ffff,0_0_12px_#00ffff]"
      >
        {label}
      </Link>
    </motion.li>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * GameHeader
 *
 * A static, production-grade navigation header for a game's landing page.
 * It is designed with a striking vaporwave aesthetic, featuring a logo,
 * navigation links, and a "Wishlist Now" button with a pulsating neon glow.
 *
 * This component is self-contained and does not accept any props, as all its
 * data is hardcoded internally. It uses Framer Motion for entrance animations
 * and `motion` for the performant CTA button glow.
 *
 * @returns {JSX.Element} The fully rendered GameHeader component.
 */
const GameHeader = (): JSX.Element => {
  const ctaRef = useRef<HTMLDivElement>(null);

  /**
   * This effect applies a pulsating neon glow animation to the CTA button
   * on component mount. It leverages the `motion` library for direct DOM
   * animation, ensuring high performance. A cleanup function stops the
   * animation when the component unmounts to prevent memory leaks.
   * This functionality is preserved as per the original component.
   */
  useEffect(() => {
    const element = ctaRef.current;
    if (!element) return;

    const animation = animate(
      element,
      {
        boxShadow: [
          '0 0 10px #ff00ff, 0 0 20px #ff00ff, inset 0 0 5px #ff00ff',
          '0 0 20px #ff00ff, 0 0 30px #ff00ff, inset 0 0 10px #ff00ff',
          '0 0 10px #ff00ff, 0 0 20px #ff00ff, inset 0 0 5px #ff00ff',
        ],
      },
      {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    );

    return () => animation.stop();
  }, []); // Empty dependency array ensures this effect runs only once.

  return (
    <motion.header
      className="sticky top-0 z-50 flex items-center justify-between border-b-2 border-[#ff00ff] bg-[#1a103c]/85 px-10 py-4 font-sans backdrop-blur-[10px]"
      variants={headerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      {/* Left side: Logo */}
      <motion.div variants={headerChildVariants as Variants}>
        <Link to={LOGO_DATA.path}>
          <img
            src={LOGO_DATA.src}
            alt={LOGO_DATA.alt}
            className="block h-[50px] w-auto"
          />
        </Link>
      </motion.div>

      {/* Right side: Navigation and CTA Button */}
      <div className="flex items-center gap-10">
        <motion.nav variants={headerChildVariants as Variants}>
          <ul className="flex list-none gap-8 p-0 m-0">
            {NAV_LINKS.map((link) => (
              <NavLinkItem
                key={link.label}
                label={link.label}
                path={link.path}
              />
            ))}
          </ul>
        </motion.nav>

        {/* Animated CTA Button */}
        <motion.div
          variants={headerChildVariants as Variants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <div ref={ctaRef} className="rounded-md">
            <Link
              to={CTA_BUTTON.path}
              className="block rounded-md border-2 border-[#ff00ff] bg-[#ff00ff]/10 px-6 py-3 font-bold text-white transition-colors duration-300 ease-in-out hover:bg-[#ff00ff]/20 [text-shadow:0_0_5px_#ff00ff,0_0_10px_#ff00ff]"
            >
              {CTA_BUTTON.label}
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default GameHeader;