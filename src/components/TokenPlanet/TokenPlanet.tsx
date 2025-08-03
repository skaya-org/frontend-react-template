import React, { JSX, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// #region --- Type Definitions ---

/**
 * @type {TokenData}
 * @description Defines the structure for the token planet's data, including styling.
 * This ensures type safety for our constant data object.
 */
type TokenData = {
  /** The full name of the cryptocurrency. */
  name: string;
  /** The ticker symbol for the cryptocurrency. */
  symbol: string;
  /** A fictional, space-themed designation for the token. */
  designation: string;
  /** The current price of the token. */
  price: number;
  /** The currency for the price display. */
  currency: string;
  /** The CSS properties to style the planet visual. */
  planetStyle: {
    background: string;
    boxShadow: string;
  };
};

// #endregion --- Type Definitions ---

// #region --- Animation Variants ---

/**
 * @const cardVariants
 * @description Variants for the main container. It orchestrates the animations of its children,
 * creating a staggered entrance effect for the entire component.
 */
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
};

/**
 * @const itemVariants
 * @description A generic variant for child elements like text and the planet container.
 * Creates a subtle "fade and slide up" effect.
 */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

// #endregion --- Animation Variants ---

// #region --- Constant Data ---

/**
 * @const TOKEN_PLANET_DATA
 * @description Hardcoded data for the TokenPlanet component. This self-contained approach
 * ensures the component is a standalone, display-only unit without external props or dependencies.
 * The data includes all necessary information to render the component, from text content to visual styling.
 */
const TOKEN_PLANET_DATA: TokenData = {
  name: 'Planet',
  symbol: 'BTC',
  designation: 'BTC-Prime',
  price: 68450.75,
  currency: 'USD',
  planetStyle: {
    background: 'radial-gradient(circle at 30% 30%, #ffc107, #ff9800, #f57c00, #e65100)',
    boxShadow: '0 0 20px #ff9800, 0 0 40px #f57c00, inset 0 0 15px rgba(0,0,0,0.5)',
  },
};

// #endregion --- Constant Data ---

// #region --- Fallback Component ---

/**
 * Renders a fallback UI when the TokenPlanet component encounters an error.
 * @param {FallbackProps} props - Props provided by React Error Boundary, including the error.
 * @returns {JSX.Element} A simple, styled error message component.
 */
const TokenPlanetFallback = ({ error }: FallbackProps): JSX.Element => (
  <div
    className="flex h-[420px] w-[300px] flex-col items-center justify-center rounded-2xl border border-[#ff8a80] bg-[#1a1a2e] p-6 font-mono text-[#ff8a80]"
    role="alert"
  >
    <p>TokenPlanet Celestial Anomaly Detected</p>
    <pre className="mt-4 whitespace-pre-wrap rounded bg-black/20 p-2 text-xs">{error.message}</pre>
  </div>
);

// #endregion --- Fallback Component ---

// #region --- Core Component ---

/**
 * @component TokenPlanet
 * @description A visual component representing a single cryptocurrency token as a celestial body.
 * It's a self-contained unit with hardcoded data, showcasing the token's name, a fictional
 * planetary designation, and its current price. The component features a unique planet
 * graphic created with CSS and subtle animations via Framer Motion. It's designed to be
 * a zero-prop, "drop-in" component for display purposes.
 *
 * @returns {JSX.Element} The rendered TokenPlanet component.
 */
const TokenPlanet = (): JSX.Element => {
  /**
   * Memoized formatted price string to prevent recalculation on every render.
   * @type {string}
   */
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: TOKEN_PLANET_DATA.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(TOKEN_PLANET_DATA.price);
  }, []); // Dependency array is empty as TOKEN_PLANET_DATA is a constant.

  return (
    <motion.div
      className="relative box-border flex h-[200px] w-[120px] flex-col items-center justify-between overflow-hidden rounded-2xl border border-[rgba(255,171,64,0.2)] bg-[#1a1a2e] p-6 font-sans text-[#E0E0E0] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      variants={cardVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="mb-5 flex h-[80px] w-[80px] items-center justify-center"
        variants={itemVariants as Variants}
      >
        <motion.div
          className="h-full w-full rounded-full"
          style={TOKEN_PLANET_DATA.planetStyle}
          aria-label={`${TOKEN_PLANET_DATA.name} planet visualization`}
          animate={{
            y: ['-4px', '4px'],
            rotate: 360,
          }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            },
            rotate: {
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        />
      </motion.div>

      <div className="w-full text-center">
        <motion.h2
          className="m-0 text-[18px] font-bold text-white [text-shadow:0_0_5px_#ffab40]"
          variants={itemVariants as Variants}
        >
          {TOKEN_PLANET_DATA.name}
        </motion.h2>
        <motion.p
          className="mt-1 mb-4 text-base italic tracking-[1px] text-[#ffab40]"
          variants={itemVariants as Variants}
        >
          {TOKEN_PLANET_DATA.designation}
        </motion.p>

        <motion.div
          className="w-full border-t border-[rgba(255,171,64,0.2)] pt-4 text-center"
          variants={itemVariants as Variants}
        >
          <p className="m-0 text-md font-light text-[#E0E0E0]">{formattedPrice}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// #endregion --- Core Component ---

// #region --- Boundary-Wrapped Export ---

/**
 * @component TokenPlanetWithBoundary
 * @description Wraps the TokenPlanet component with a React ErrorBoundary.
 * This ensures that any unexpected errors during rendering are caught gracefully,
 * preventing a crash of the entire application and displaying a helpful fallback UI.
 * This is the default export and the recommended way to use the component.
 *
 * @returns {JSX.Element} The TokenPlanet component wrapped in an ErrorBoundary.
 */
const TokenPlanetWithBoundary = (): JSX.Element => (
  <ErrorBoundary
    FallbackComponent={TokenPlanetFallback}
    onReset={() => {
      // This function could be used to reset application state,
      // but is not needed for this self-contained component.
      console.log('Error boundary reset triggered.');
    }}
  >
    <TokenPlanet />
  </ErrorBoundary>
);

export default TokenPlanetWithBoundary;

// #endregion --- Boundary-Wrapped Export ---