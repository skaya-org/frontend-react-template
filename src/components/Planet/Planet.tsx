import React, { useMemo, JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * @typedef {object} PlanetData
 * @description Defines the static data structure for a planet.
 * @property {string} name - The name of the planet.
 * @property {string} path - The URL path for navigation when the planet is clicked.
 * @property {number} size - The diameter of the planet in pixels.
 * @property {React.CSSProperties} backgroundStyle - The CSS properties for the planet's surface appearance.
 * @property {string} glowColor - The color of the glow effect on hover.
 */
type PlanetData = {
  name: string;
  path: string;
  size: number;
  backgroundStyle: React.CSSProperties;
  glowColor: string;
};

/**
 * @constant PLANET_DATA
 * @description Constant data for the Planet component. This component represents Mars.
 * By using a constant, we ensure the component is self-contained and does not require props.
 */
const PLANET_DATA: PlanetData = {
  name: 'Mars',
  path: '/planets/mars',
  size: 200,
  backgroundStyle: {
    backgroundImage: `radial-gradient(circle at 30% 30%, #D88A58, #B85B42, #8C3B2F, #5C2720)`,
    // For a more realistic texture, an image could be used:
    // backgroundImage: 'url(https://picsum.photos/200/200.webp?grayscale&blur=2)',
    // backgroundSize: 'cover',
  },
  glowColor: 'rgba(255, 107, 84, 0.7)',
};

/**
 * @component Planet
 * @description A visual, interactive component representing a single planet (Mars).
 * It is a clickable, circular element styled with a unique CSS gradient. On hover,
 * it exhibits a glowing effect. The component is self-contained, fetching its data
 * from an internal constant, and navigates to a predefined route on click.
 * It's designed to be used within a larger view like a Solar System.
 *
 * @example
 * // In a router-enabled application:
 * <Planet />
 *
 * @returns {JSX.Element} The rendered Planet component.
 */
const Planet = (): JSX.Element => {
  /**
   * Memoizes the dynamic CSS styles for the planet to prevent recalculation.
   * Properties like width, height, and complex gradients are kept here.
   * @returns {React.CSSProperties} The computed style object for the planet.
   */
  const planetStyle = useMemo((): React.CSSProperties => ({
    width: `${PLANET_DATA.size}px`,
    height: `${PLANET_DATA.size}px`,
    ...PLANET_DATA.backgroundStyle,
  }), []);

  /**
   * Defines and memoizes the animation variants for the planet component.
   * - 'initial': The default state with no scaling or glow.
   * - 'hover': The state on mouse hover, where the planet scales up and emits a soft glow.
   *            A spring transition is used for a natural scaling effect, while the boxShadow
   *            (glow) has a smoother ease-in-out transition.
   * - 'tap': A subtle scale-down effect when the component is clicked or tapped.
   */
  const planetVariants = useMemo((): Variants => ({
    initial: {
      scale: 1,
      boxShadow: `0 0 0px 0px ${PLANET_DATA.glowColor}`,
    },
    hover: {
      scale: 1.1,
      boxShadow: `0 0 30px 8px ${PLANET_DATA.glowColor}`,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15,
        // Apply a separate, non-spring transition for the boxShadow for smoother glow effect
        boxShadow: {
          duration: 0.4,
          ease: "easeInOut",
        },
      },
    },
    tap: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 20
      }
    },
  }), []);

  return (
    // The Link component handles navigation, making the entire planet a clickable link.
    // Error Boundaries are best placed higher up in the component tree (e.g., around a route or a collection
    // of components) to catch errors from any of their children. A simple, static component like this
    // has a very low probability of throwing a runtime error, so an individual boundary is not necessary.
    <Link to={PLANET_DATA.path} aria-label={`Navigate to ${PLANET_DATA.name} details`}>
      <motion.div
        className="relative flex cursor-pointer items-center justify-center rounded-full shadow-[inset_0_0_40px_10px_rgba(0,0,0,0.6),_0_0_10px_rgba(0,0,0,0.5)] [-webkit-tap-highlight-color:transparent]"
        style={planetStyle}
        variants={planetVariants as Variants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        aria-hidden="true" // The parent Link already has the accessible label
      >
        {/* Future enhancements could include cloud layers or other visual details here */}
      </motion.div>
    </Link>
  );
};

export default Planet;