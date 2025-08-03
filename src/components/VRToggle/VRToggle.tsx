import React, { useState, useCallback, JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// --- CONSTANTS ---

/**
 * @constant CONTAINER_VARIANTS
 * @description Framer Motion variants for the component's entry animation.
 * The button will fade in and slide up from the bottom on mount.
 */
const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      delay: 0.2,
    },
  },
};

/**
 * @constant BUTTON_VARIANTS
 * @description Framer Motion variants for the button's active and inactive states.
 * This allows for smooth animated transitions between states.
 * Note: Animatable properties like backgroundColor, borderColor, and boxShadow
 * are defined here to be controlled by Framer Motion.
 */
const BUTTON_VARIANTS: Variants = {
  inactive: {
    backgroundColor: 'rgba(51, 51, 51, 0.9)',
    borderColor: '#555555',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    scale: 1,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  active: {
    backgroundColor: 'rgba(0, 123, 255, 0.9)',
    borderColor: '#0056b3',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    scale: 1.05,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

/**
 * @constant HOVER_TAP_ANIMATION
 * @description Framer Motion animation properties for hover and tap gestures.
 */
const HOVER_TAP_ANIMATION = {
  whileHover: { scale: 1.15, boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)' },
  whileTap: { scale: 0.95, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' },
};

/**
 * @constant ICON_GLOW_VARIANTS
 * @description Variants for the glowing effect on the icon's bottom path when active.
 */
const ICON_GLOW_VARIANTS: Variants = {
  inactive: { stroke: 'currentColor', transition: { duration: 0.3 } },
  active: { stroke: '#76d9ff', transition: { duration: 0.3 } },
};

/**
 * @constant LENS_VARIANTS
 * @description Variants for the icon's lenses, making them fill and pulse when active.
 */
const LENS_VARIANTS: Variants = {
  inactive: { fill: 'none', scale: 1, transition: { duration: 0.3 } },
  active: {
    fill: '#76d9ff',
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};


/**
 * Renders an animated VR headset icon.
 * @param {object} props - The component props.
 * @param {'active' | 'inactive'} props.animate - The current animation state.
 * @returns {JSX.Element} The SVG icon element with motion capabilities.
 */
const VRHeadsetIcon = ({ animate }: { animate: 'active' | 'inactive' }): JSX.Element => (
  <motion.svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <title>VR Headset Icon</title>
    {/* Static top part of the headset */}
    <path d="M2 12.55V11a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v1.55" />
    
    {/* Animated "glow" path */}
    <motion.path
      d="M2 12.55A12.79 12.79 0 0 0 9.28 17a4.17 4.17 0 0 0 5.44 0A12.79 12.79 0 0 0 22 12.55"
      variants={ICON_GLOW_VARIANTS as Variants}
      initial="inactive"
      animate={animate}
    />
    
    {/* Animated lenses */}
    <motion.path
      d="M8 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
      variants={LENS_VARIANTS as Variants}
      initial="inactive"
      animate={animate}
    />
    <motion.path
      d="M16 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
      variants={LENS_VARIANTS as Variants}
      initial="inactive"
      animate={animate}
    />
  </motion.svg>
);


/**
 * @component VRToggle
 * @description A self-contained, stateful toggle button for activating and deactivating
 * a virtual reality or 360-degree view mode. The component manages its own state and
 * simulates the side effects of toggling the view mode. It is designed as a
 * floating action button with a VR headset icon.
 *
 * This component follows a strict "no props" policy, deriving all its configuration
 * from internal constants, making it a drop-in UI element. It uses Tailwind CSS for
 * base styling and Framer Motion for state and interaction animations.
 *
 * @returns {JSX.Element} The rendered VRToggle component.
 */
const VRToggle = (): JSX.Element => {
  /**
   * @state {boolean} isVRModeActive - Tracks whether the VR mode is currently active.
   * Defaults to `false`.
   */
  const [isVRModeActive, setIsVRModeActive] = useState<boolean>(false);

  /**
   * @function handleToggleVRMode
   * @description Toggles the VR mode state and logs the action to the console.
   * In a real-world application, this function would contain the logic to
   * interact with a 3D scene's camera or rendering engine.
   * Wrapped in `useCallback` for performance optimization, preventing re-creation
   * on each render unless its dependencies change.
   */
  const handleToggleVRMode = useCallback(() => {
    setIsVRModeActive(prev => {
      const nextState = !prev;
      if (nextState) {
        // In a real application, you would trigger the 3D scene's VR entry logic here.
        // Example: scene.enterVR();
        console.log('Entering VR / 360-degree view mode.');
      } else {
        // In a real application, you would trigger the 3D scene's VR exit logic here.
        // Example: scene.exitVR();
        console.log('Exiting VR / 360-degree view mode.');
      }
      return nextState;
    });
  }, []); // No dependencies, so the function is created only once.

  const animationState = isVRModeActive ? 'active' : 'inactive';

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-[1000]"
      variants={CONTAINER_VARIANTS as Variants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        aria-pressed={isVRModeActive}
        aria-label={isVRModeActive ? 'Exit VR Mode' : 'Enter VR Mode'}
        onClick={handleToggleVRMode}
        className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full border-2 text-white select-none outline-none focus:outline-none"
        variants={BUTTON_VARIANTS as Variants}
        animate={animationState}
        initial="inactive"
        {...HOVER_TAP_ANIMATION}
      >
        <VRHeadsetIcon animate={animationState} />
      </motion.button>
    </motion.div>
  );
};

export default VRToggle;