// New component Button
import React, { useState, MouseEvent, ReactNode, JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * Interface for the Ripple effect state.
 */
interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Props for the Button component.
 * Extends standard HTML button attributes.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The content of the button.
   */
  children: ReactNode;
  /**
   * The variant of the button, which determines its style.
   * 'primary' is the main call-to-action button with a pulse animation.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
}

/**
 * Framer Motion variants for the main button animations.
 * This includes states for hover, tap, and the primary button's pulse effect.
 */
const buttonVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1, ease: 'easeInOut' },
  },
  pulse: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 2.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

/**
 * Framer Motion variants for the ripple effect animation.
 * The ripple starts small and expands outwards while fading.
 */
const rippleVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 1,
  },
  animate: {
    scale: 4,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};


/**
 * A reusable button component with built-in animations and variants.
 *
 * This component provides a styled button with several interactive features:
 * - **Variants**: 'primary', 'secondary', and 'tertiary' styles.
 * - **Soft Pulse Animation**: The 'primary' variant has a subtle pulse to draw user attention.
 * - **Ripple Effect**: A material-design-like ripple effect emanates from the click position.
 * - **Hover & Tap Scaling**: The button scales on hover and tap for immediate feedback.
 */
const Button = ({
  children,
  variant = 'primary',
  onClick,
  ...rest
}: ButtonProps): JSX.Element => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // Create and add the new ripple effect
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples(prevRipples => [...prevRipples, newRipple]);

    // Forward the click event to the parent component
    if (onClick) {
      onClick(event);
    }
  };

  const handleAnimationComplete = (id: number) => {
    setRipples(prevRipples => prevRipples.filter(ripple => ripple.id !== id));
  };

  // Base styles for all variants
  const baseClasses =
    'relative overflow-hidden inline-flex items-center justify-center gap-2 select-none cursor-pointer rounded-lg px-6 py-3 font-semibold text-base transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant-specific styles
  const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    tertiary: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:ring-gray-500',
  };

  // Ripple color class adjusts based on button variant for better contrast
  const rippleClass = variant === 'primary' ? 'bg-white/30' : 'bg-black/10';

  // Combine all classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]}`;

  return (
    <motion.button
      className={combinedClasses}
      onClick={handleClick}
      variants={buttonVariants as Variants}
      initial="initial"
      animate={variant === 'primary' && !rest.disabled ? 'pulse' : 'initial'}
      whileHover={!rest.disabled ? 'hover' : 'initial'}
      whileTap={!rest.disabled ? 'tap' : 'initial'}
    >
      {children}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className={`absolute rounded-full pointer-events-none ${rippleClass}`}
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
          variants={rippleVariants as Variants}
          initial="initial"
          animate="animate"
          onAnimationComplete={() => handleAnimationComplete(ripple.id)}
        />
      ))}
    </motion.button>
  );
};

export default Button;