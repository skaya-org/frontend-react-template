import React, { JSX, CSSProperties } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  Variants,
} from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// --- CONSTANT DATA ---
// By defining all content as constants, this component remains self-contained
// and does not require any props, simplifying its usage across an application.

/**
 * @constant HERO_TITLE The main title displayed in the hero section.
 */
const HERO_TITLE: string = 'AETHERIUM DRIFT';

/**
 * @constant HERO_TAGLINE The compelling tagline shown below the main title.
 */
const HERO_TAGLINE: string = 'Race the sun. Outrun the night.';

/**
 * @constant CTA_TEXT The text for the primary call-to-action button.
 */
const CTA_TEXT: string = 'WATCH THE TRAILER';

// --- STYLES & ANIMATIONS ---
// Grouping styles and animation variants makes the component's presentation logic
// easy to locate and manage.

/**
 * A string containing global CSS, such as font imports, keyframe animations, and
 * custom utility classes that complement Tailwind CSS.
 * In a larger application, this would typically reside in a global stylesheet or
 * be handled by the Tailwind configuration, but is included here to ensure
 * the component is fully self-contained.
 */
const globalStyles: string = `
  @import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');

  @keyframes vaporwave-gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .font-audiowide {
    font-family: 'Audiowide', sans-serif;
  }

  .bg-vaporwave-gradient {
    background: linear-gradient(-45deg, #3c1053, #ad5389, #ff4b2b, #f27121);
    background-size: 400% 400%;
  }

  .animate-vaporwave-gradient {
    animation: vaporwave-gradient 20s ease infinite;
  }
  
  .text-shadow-custom {
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

/**
 * Framer Motion variants for the background layer.
 * Creates a subtle, slow zoom-in effect to enhance the "vaporwave" feel.
 */
const backgroundVariants: Variants = {
  hidden: {
    scale: 1.1, // Start slightly zoomed in
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 2.5, // A longer duration for a subtle effect
      ease: [0.42, 0, 0.58, 1], // Ease in and out
    },
  },
};

/**
 * Framer Motion variants for staggered entrance animations.
 * @property {Variants} container - Variants for the parent container to orchestrate children animations.
 * @property {Variants} item - Variants for individual child elements, creating a stylized "fade and rise" effect.
 */
const animationVariants = {
  container: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.8, // Increased delay to let background animation start
      },
    },
  },
  item: {
    hidden: { y: 25, opacity: 0, skewY: 3 }, // Element is initially lower, faded, and slightly skewed
    visible: {
      y: 0,
      opacity: 1,
      skewY: 0, // Animates to its final position, fully opaque, and un-skewed
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  },
};

/**
 * A simple, styled fallback component to be displayed by the ErrorBoundary.
 * This ensures that if the HeroSection encounters a critical error, the
 * application does not crash, providing a better user experience.
 *
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @param {Error} props.error - The error that was caught.
 * @param {() => void} props.resetErrorBoundary - A function to reset the component's state.
 * @returns {JSX.Element} The fallback UI.
 */
const HeroErrorFallback = ({ error, resetErrorBoundary }: FallbackProps): JSX.Element => (
  <div className="flex h-screen flex-col items-center justify-center bg-[#1a082d] p-8 font-mono text-white">
    <h2 className="mb-4 text-xl">Something went wrong in the Hero Section.</h2>
    <pre className="mb-4 rounded-md bg-black/30 p-4 text-red-400">{error.message}</pre>
    <button
      onClick={resetErrorBoundary}
      className="rounded-full border-2 border-white/80 bg-white/10 py-3 px-8 font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
    >
      Try Again
    </button>
  </div>
);

/**
 * The core `HeroSection` component.
 * It renders the main "above-the-fold" content for a game's landing page,
 * featuring a dynamic background, animated text, and an interactive call-to-action button.
 * It is fully self-contained and manages its own state and content.
 * A subtle parallax effect is added to the content based on mouse position for a more
 * immersive experience.
 *
 * @returns {JSX.Element} The rendered Hero Section component.
 */
export const HeroSectionCore = (): JSX.Element => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Create a subtle parallax effect on the content based on mouse position
  const parallaxX = useTransform(x, (latest) => latest * 0.05);
  const parallaxY = useTransform(y, (latest) => latest * 0.05);

  /**
   * Handles the click event for the Call-To-Action button.
   * In a real application, this would trigger an action like opening a video modal
   * or navigating to a new page.
   */
  const handleCtaClick = (): void => {
    console.log('Action: Play trailer triggered. Implement modal or navigation.');
    // Example: window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  /**
   * Updates motion values based on the mouse position over the hero container.
   * @param {React.MouseEvent<HTMLElement>} event - The mouse event.
   */
  const handleMouseMove = (event: React.MouseEvent<HTMLElement>): void => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const newX = clientX - left - width / 2;
    const newY = clientY - top - height / 2;
    x.set(newX);
    y.set(newY);
  };
  
  /**
   * Resets the parallax effect when the mouse leaves the container.
   */
  const handleMouseLeave = (): void => {
      x.set(0);
      y.set(0);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <motion.section
        className="relative flex  w-screen items-center justify-center overflow-hidden text-white font-audiowide"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        variants={animationVariants.container as Variants}
      >
        {/* Animated Background Layer */}
        <motion.div
          className="absolute inset-0 z-10 bg-vaporwave-gradient animate-vaporwave-gradient"
          variants={backgroundVariants as Variants}
        />
        <motion.div
          className="relative z-20 flex flex-col items-center p-5 text-center text-shadow-custom"
          style={{ x: parallaxX, y: parallaxY }}
        >
          <motion.h1 
            className="m-0 text-5xl font-bold tracking-widest text-gray-100 sm:text-6xl md:text-7xl lg:text-8xl" 
            variants={animationVariants.item as Variants}
          >
            {HERO_TITLE}
          </motion.h1>
          <motion.p 
            className="mt-4 mb-10 text-lg text-gray-200 md:text-xl lg:text-2xl" 
            variants={animationVariants.item as Variants}
          >
            {HERO_TAGLINE}
          </motion.p>
          <motion.button
            className="cursor-pointer rounded-full border-2 border-white/80 bg-white/10 py-4 px-10 text-base font-bold text-white shadow-lg backdrop-blur-sm md:text-lg"
            onClick={handleCtaClick}
            variants={animationVariants.item as Variants}
            whileHover={{
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {CTA_TEXT}
          </motion.button>
        </motion.div>
      </motion.section>
    </>
  );
};
