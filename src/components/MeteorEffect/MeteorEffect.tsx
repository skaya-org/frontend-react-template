import React, { JSX, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, Variants } from 'framer-motion'; // Import Variants here

/**
 * Interface for a single meteor's properties, derived from internal constant data.
 * @private
 */
interface Meteor {
  /** A unique identifier for the meteor instance. */
  id: string;
  /** Initial horizontal position as a CSS percentage string (e.g., "50vw"). */
  x: string;
  /** Initial vertical position as a CSS pixel string (e.g., "-20px"). */
  y: string;
  /** Size (width and height) of the meteor head as a CSS pixel string (e.g., "3px"). */
  size: string;
  /** Duration of the falling animation in seconds. */
  duration: number;
  /** Delay before the meteor's animation starts in seconds. */
  delay: number;
  /** Rotation of the meteor in degrees for visual variation (e.g., "45deg"). */
  rotation: string;
}

/**
 * Generates a random floating-point number within a specified range.
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} A random number between min and max.
 * @private
 */
const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Generates a random integer within a specified range.
 * @param {number} min - The minimum integer value (inclusive).
 * @param {number} max - The maximum integer value (inclusive).
 * @returns {number} A random integer between min and max.
 * @private
 */
const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// --- Constant Configuration for Meteor Effect ---
/**
 * The total number of meteors to render concurrently.
 * Adjust this value to control the density of the meteor shower.
 * @private
 */
const NUMBER_OF_METEORS: number = 30;

/**
 * Minimum size (width/height) of a meteor's head in pixels.
 * @private
 */
const MIN_METEOR_SIZE: number = 1;

/**
 * Maximum size (width/height) of a meteor's head in pixels.
 * @private
 */
const MAX_METEOR_SIZE: number = 3;

/**
 * Minimum duration for a meteor to fall from the top of the viewport to the bottom, in seconds.
 * @private
 */
const MIN_FALL_DURATION: number = 4;

/**
 * Maximum duration for a meteor to fall from the top of the viewport to the bottom, in seconds.
 * @private
 */
const MAX_FALL_DURATION: number = 10;

/**
 * Minimum delay before a meteor starts falling, in seconds.
 * Used to stagger the appearance of meteors.
 * @private
 */
const MIN_DELAY: number = 0;

/**
 * Maximum delay before a meteor starts falling, in seconds.
 * @private
 */
const MAX_DELAY: number = 8;

/**
 * The starting opacity value for the meteor's tail gradient.
 * @private
 */
const METEOR_TAIL_START_OPACITY: string = '0.8';

/**
 * The ending opacity value for the meteor's tail gradient.
 * @private
 */
const METEOR_TAIL_END_OPACITY: string = '0';

/**
 * The primary color for the meteor's head and the brighter part of its tail.
 * This is a subtle, almost white color to mimic celestial bodies.
 * @private
 */
const METEOR_COLOR_HEAD: string = 'rgba(255, 255, 255, 0.9)';

/**
 * The secondary color for the meteor's tail, creating a fading effect.
 * This is a slightly bluish-white, adding depth.
 * @private
 */
const METEOR_COLOR_TAIL: string = 'rgba(173, 216, 230, 0.7)';

/**
 * Error boundary component to catch and display errors within its children.
 * This prevents the entire application from crashing if there's an issue
 * with rendering or logic within the MeteorEffect component.
 * @private
 */
class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>> {
  /**
   * State to track if an error has occurred.
   * @private
   */
  state = { hasError: false };

  /**
   * Lifecycle method to update state when an error is caught.
   * This allows the component to render a fallback UI.
   * @param {Error} error - The error that was thrown.
   * @returns {{hasError: boolean}} An object to update the state, indicating an error.
   */
  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    console.error("MeteorEffect ErrorBoundary: An error occurred.", error);
    return { hasError: true };
  }

  /**
   * Lifecycle method to log error information.
   * This is where you would typically send error reports to an external service.
   * @param {Error} error - The error that was thrown.
   * @param {React.ErrorInfo} info - Information about which component threw the error.
   */
  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Example: Log to a specific error reporting service
    // console.error("MeteorEffect caught error details:", error, info);
  }

  /**
   * Renders the error boundary. If an error occurred, it displays a fallback message.
   * Otherwise, it renders its children, allowing the MeteorEffect to display.
   * @returns {JSX.Element} The rendered error boundary content.
   */
  render(): JSX.Element {
    if (this.state.hasError) {
      return (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-red-500 text-lg z-[9999]"
          role="alert" // Indicate to assistive technologies that this is an alert
        >
          <p>Failed to render meteor effects. Please try again later.</p>
        </div>
      );
    }
    return this.props.children as JSX.Element;
  }
}

/**
 * A self-contained React component that generates and animates falling meteor-like elements
 * across its defined area. It acts as a purely decorative background element,
 * having its own fixed visual parameters and density without requiring any props from its parent.
 *
 * This component leverages `framer-motion` for smooth, performant animations
 * and utilizes inline styles with Tailwind CSS classes for its visual presentation.
 * It is designed to be placed as an absolute-positioned element within a parent
 * container to provide a dynamic, starry background effect.
 *
 * The component ensures a clean, modular structure, comprehensive JSDoc comments,
 * and includes an error boundary for resilience.
 *
 * @returns {JSX.Element} The MeteorEffect background component.
 */
const MeteorEffect = (): JSX.Element => {
  /**
   * Generates a single meteor object with randomized properties based on the predefined constants.
   * This function is memoized using `useCallback` to prevent unnecessary re-creations.
   * @returns {Meteor} A new Meteor object with calculated properties for animation.
   * @private
   */
  const generateMeteor = useCallback((): Meteor => {
    const id = `meteor-${Math.random().toString(36).substring(2, 11)}`;
    const size = getRandomInt(MIN_METEOR_SIZE, MAX_METEOR_SIZE);
    const duration = getRandomNumber(MIN_FALL_DURATION, MAX_FALL_DURATION);
    const delay = getRandomNumber(MIN_DELAY, MAX_DELAY);
    // Meteors start randomly across the viewport width, slightly off-screen to the left or right.
    const xPosition = getRandomNumber(-20, 120); // -20vw to 120vw for broad distribution
    const rotation = getRandomNumber(-30, 30); // Slight rotation for visual variety

    return {
      id,
      x: `${xPosition}vw`,
      y: '-20%', // Start off-screen above, will fall to 120% below.
      size: `${size}px`,
      duration,
      delay,
      rotation: `${rotation}deg`,
    };
  }, []); // No dependencies, as all internal configurations are constants.

  /**
   * Memoized array of meteor objects.
   * `useMemo` ensures that the array of meteors is generated only once
   * when the component mounts, or if `generateMeteor` itself were to change (which it won't).
   * This prevents re-calculation on every re-render and ensures stable meteor identities.
   * @private
   */
  const meteors: Meteor[] = useMemo(() => {
    const generatedMeteors: Meteor[] = [];
    // Wrap meteor generation in a try-catch for robustness, though unlikely to fail here.
    try {
      for (let i = 0; i < NUMBER_OF_METEORS; i++) {
        generatedMeteors.push(generateMeteor());
      }
    } catch (error) {
      console.error("Error during meteor generation:", error);
      // If an error occurs during generation, the ErrorBoundary will catch it
      // if the component fails to render, or this could be handled more granularly.
    }
    return generatedMeteors;
  }, [generateMeteor]); // `generateMeteor` is a stable useCallback, so this memoizes effectively.

  /**
   * Defines Framer Motion variants for a single meteor's animation.
   * The 'initial' state depends on the specific meteor's properties (passed via `custom` prop).
   * The 'fallAndFade' state defines the keyframe animations for the falling and fading effect.
   * Transition properties that are dynamic per meteor (like duration and delay)
   * are intentionally left on the <motion.div> itself, as Framer Motion allows this
   * to override or extend variant transitions.
   */
  const meteorItemVariants: Variants = useMemo(() => ({
    initial: (custom: Meteor) => ({ // 'custom' parameter receives the value passed via the 'custom' prop
      x: custom.x,
      y: custom.y,
      opacity: 0,
      rotate: custom.rotation,
    }),
    fallAndFade: {
      y: ['-20%', '120%'], // Animate from 20% above viewport to 120% below viewport
      opacity: [0, 1, 1, 0], // Fade in, stay visible, then fade out
    },
  }), []); // Memoize the variants object as its structure is constant.

  return (
    <ErrorBoundary>
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-[1]"
        aria-hidden="true" // Hide from accessibility tree as it's purely decorative
        style={{ perspective: '1000px' }} // Adds a 3D perspective to the container for potential depth effects
      >
        {meteors.map((meteor) => (
          <motion.div
            key={meteor.id}
            variants={meteorItemVariants as Variants} // Apply the defined variants
            initial="initial" // Set the initial state using the 'initial' variant
            animate="fallAndFade" // Animate to the 'fallAndFade' state
            custom={meteor} // Pass the individual meteor object to the variants for dynamic initial properties
            transition={{
              duration: meteor.duration,
              delay: meteor.delay,
              ease: 'linear', // Consistent speed of fall
              repeat: Infinity, // Loop the animation indefinitely
              repeatType: 'loop', // Ensure consistent looping behavior
            }}
            className="absolute rounded-full origin-top shadow-[0_0_8px_2px_rgba(255,255,255,0.6)]"
            style={{
              width: meteor.size,
              height: meteor.size,
              // Apply a CSS filter for a subtle blur, mimicking atmospheric entry glow
              filter: 'blur(0.5px)',
              // Use a combination of radial and linear gradients for the meteor head and tail
              background: `
                radial-gradient(circle at 50% 50%, ${METEOR_COLOR_HEAD} 0%, rgba(255,255,255,0) 100%),
                linear-gradient(to bottom, ${METEOR_COLOR_TAIL} ${METEOR_TAIL_START_OPACITY}, rgba(255, 255, 255, 0) ${METEOR_TAIL_END_OPACITY})
              `,
              // Clip-path to create a triangular 'tail' shape for the meteor
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            }}
          />
        ))}
      </div>
    </ErrorBoundary>
  );
};

export default MeteorEffect;