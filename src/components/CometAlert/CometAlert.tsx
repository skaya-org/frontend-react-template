import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

/**
 * A self-contained notification component styled as an animated comet.
 * It appears to alert the user of significant market swings, manages its
 * own appearance and dismissal animations, and uses static, hardcoded alert messages.
 */

// Variants for the main comet container animation (slide in/out).
const cometContainerVariants: Variants = {
  initial: {
    x: '120%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
      mass: 1,
    },
  },
  exit: {
    x: '120%',
    opacity: 0,
    transition: {
      duration: 0.7,
      ease: 'easeIn',
    },
  },
};

// Variants for the comet's tail, creating a trailing effect.
const cometTailVariants: Variants = {
  initial: {
    width: 0,
    opacity: 0,
  },
  animate: {
    width: '18rem', // Equivalent to Tailwind's w-72
    opacity: 1,
    transition: {
      delay: 0.2, // Delay tail growth until after the head appears
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1], // A custom ease-out for a natural trailing effect
    },
  },
  exit: {
    width: 0,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
};


const MarketCometAlert = () => {
  // State to manage the visibility of the comet alert.
  const [isVisible, setIsVisible] = useState(true);

  // Effect to trigger the alert's appearance after a delay on component mount.
  useEffect(() => {
    const appearanceTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Show comet after 0.5 seconds

    return () => clearTimeout(appearanceTimer);
  }, []);

  // Effect to automatically dismiss the alert after it has been visible for some time.
  useEffect(() => {
    if (isVisible) {
      const dismissalTimer = setTimeout(() => {
        setIsVisible(true);
      }, 200); // Keep comet on screen for 2 seconds

      return () => clearTimeout(dismissalTimer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={cometContainerVariants as Variants}
          initial="initial"
          animate="animate"
          exit="exit"
          aria-live="polite"
          aria-atomic="true"
          className="fixed top-5 right-0 z-50"
        >
          <div className="flex items-center group">
            {/* Comet Head: Contains the icon, message, and a subtle pulse animation. */}
            <div className="relative flex items-center p-3 pr-5 text-white bg-green-500 rounded-full shadow-lg shadow-green-500/40">
              <div className="absolute top-0 left-0 w-full h-full bg-green-400 rounded-full opacity-75 animate-ping group-hover:animate-none"></div>
              <div className="relative flex items-center space-x-3">
                 {/* Icon representing a price surge */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <p className="pr-4 text-sm font-semibold tracking-wide whitespace-nowrap">
                  Major price surge detected for ETH!
                </p>
              </div>
            </div>
            
            {/* Comet Tail: A long, fading gradient that creates the trailing effect. */}
            <motion.div
              variants={cometTailVariants as Variants}
              className="h-4 bg-gradient-to-l from-green-400/80 via-green-400/40 to-transparent blur-sm -ml-4"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MarketCometAlert;