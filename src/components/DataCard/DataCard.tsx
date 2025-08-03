/**
 * @file DataCard.tsx
 * @description A production-grade, reusable card component with a holographic,
 * semi-transparent design and glowing neon edges, styled with Tailwind CSS.
 * @author Senior Fullstack/TypeScript Developer
 * @version 1.2.0
 */

import React, { JSX, useRef } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import {
  motion,
  useMotionValue,
  useTransform,
  MotionValue,
  Variants,
} from 'framer-motion';

// ============================================================================
// #region CONSTANTS
// ============================================================================

/**
 * @constant CARD_DATA
 * @description Static data for the component. As per the requirements,
 * the component is self-contained and does not accept props for its content.
 */
const CARD_DATA = {
  title: 'Total Volume',
  value: '$1,234,567.89',
  currency: 'USD',
};

// ============================================================================
// #endregion CONSTANTS
// ============================================================================

// ============================================================================
// #region ANIMATION VARIANTS
// ============================================================================

/**
 * @constant cardVariants
 * @description Animation variants for the main card container.
 * - `initial`: The card starts slightly scaled down, faded out, and shifted down.
 * - `animate`: The card animates to its final state, orchestrating child animations.
 * - `hover`: The card scales up slightly on hover for a tactile feel.
 */
const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 30 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      duration: 0.8,
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
  hover: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 300, damping: 15 },
  },
};

/**
 * @constant glowVariants
 * @description Animation variants for the neon glow effect.
 * - `initial`: The glow starts completely faded out.
 * - `animate`: The glow fades into its default state.
 * - `hover`: The glow intensifies on hover for a more vibrant effect.
 */
const glowVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 0.6 },
  hover: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

/**
 * @constant contentVariants
 * @description Animation variants for the text content inside the card.
 * - `initial`: Text elements start faded out and shifted down.
 * - `animate`: Text elements animate into place with a springy effect.
 */
const contentVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

// ============================================================================
// #endregion ANIMATION VARIANTS
// ============================================================================

// ============================================================================
// #region ERROR BOUNDARY FALLBACK
// ============================================================================

/**
 * A fallback component to display when an error is caught by the ErrorBoundary.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const ErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div
    className="max-w-[320px] rounded-lg border border-red-500 bg-red-950/50 p-5 text-red-200"
    role="alert"
  >
    <p>Something went wrong:</p>
    <pre className="mt-2 text-red-400">{error.message}</pre>
  </div>
);

// ============================================================================
// #endregion ERROR BOUNDARY FALLBACK
// ============================================================================

// ============================================================================
// #region CORE COMPONENT
// ============================================================================

/**
 * DataCard Component
 *
 * A self-contained, high-fidelity UI component that displays a key metric.
 * It features a 3D interactive holographic effect on mouse move and a
 * glowing neon border that intensifies on hover.
 *
 * @returns {JSX.Element} The rendered DataCard component.
 */
const DataCard = (): JSX.Element => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for tracking mouse position
  const mouseX: MotionValue<number> = useMotionValue(0);
  const mouseY: MotionValue<number> = useMotionValue(0);

  /**
   * Transforms mouse X-position into a Y-axis rotation.
   * The range [-160, 160] corresponds to half the card's width.
   * The range [15, -15] is the desired rotation in degrees.
   */
  const rotateY = useTransform(mouseX, [-160, 160], [15, -15]);

  /**
   * Transforms mouse Y-position into an X-axis rotation.
   * The range [-100, 100] corresponds to half the card's height.
   * The range [-15, 15] is the desired rotation in degrees.
   */
  const rotateX = useTransform(mouseY, [-100, 100], [-15, 15]);

  /**
   * Handles the mouse move event on the card to update motion values.
   * @param {React.MouseEvent<HTMLDivElement>} event - The mouse event.
   */
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    // Calculate mouse position relative to the card's center
    mouseX.set(event.clientX - left - width / 2);
    mouseY.set(event.clientY - top - height / 2);
  };

  /**
   * Resets the card's rotation when the mouse leaves.
   */
  const handleMouseLeave = (): void => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    // The wrapper is included for demonstration to provide a contrasting background
    <div className="flex min-h-[400px] items-center justify-center overflow-hidden bg-zinc-950 p-8 font-sans">
      <motion.div
        ref={cardRef}
        className="relative flex h-[200px] w-[320px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 text-neutral-200 backdrop-blur-md [transform-style:preserve-3d] [perspective:800px]"
        style={{
          rotateX,
          rotateY,
        }}
        variants={cardVariants as Variants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl shadow-[0_0_20px_5px_rgba(0,255,255,0.4),_0_0_30px_10px_rgba(255,0,255,0.3)]"
          variants={glowVariants as Variants}
        />
        <div className="z-10 text-center [text-shadow:0_1px_3px_rgba(0,0,0,0.2)]">
          <motion.h2
            className="mb-3 text-base font-medium uppercase tracking-widest text-neutral-200/80"
            variants={contentVariants as Variants}
          >
            {CARD_DATA.title}
          </motion.h2>
          <motion.p
            className="text-4xl font-bold text-white leading-[1.1]"
            variants={contentVariants as Variants}
          >
            {CARD_DATA.value}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// #endregion CORE COMPONENT
// ============================================================================

// ============================================================================
// #region EXPORT
// ============================================================================

/**
 * The final component exported with a safety net.
 * This wrapper component uses an ErrorBoundary to catch any potential runtime
 * errors within the DataCard, ensuring the app remains stable.
 */
const DataCardWithErrorBoundary = (): JSX.Element => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <DataCard />
  </ErrorBoundary>
);

export default DataCardWithErrorBoundary;

// ============================================================================
// #endregion EXPORT
// ============================================================================