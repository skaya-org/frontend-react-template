import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @interface IconProps
 * @description Props for the Icon component.
 * @property {string} svgContent - The inner XML content of the SVG (e.g., <path>, <circle>).
 * @property {number} [size=24] - The width and height of the icon in pixels.
 * @property {string} [className] - Optional CSS class for custom styling of the wrapper.
 * @property {string} [viewBox='0 0 24 24'] - The viewBox attribute for the SVG.
 * @property {'bounce' | 'rotate' | 'color-shift' | 'none'} [hoverAnimation='none'] - The type of animation to apply on hover.
 * @property {string} [hoverColor] - The target color for the 'color-shift' animation.
 */
export interface IconProps {
  svgContent: string;
  size?: number;
  className?: string;
  viewBox?: string;
  hoverAnimation?: 'bounce' | 'rotate' | 'color-shift' | 'none';
  hoverColor?: string;
}

/**
 * @component Icon
 * @description A component to render SVG icons with optional hover animations.
 * It's designed to be flexible for use with feature icons, social media links, and more.
 *
 * @example
 * <Icon
 *   svgContent="<path d='...' />"
 *   hoverAnimation="bounce"
 *   size={32}
 * />
 *
 * @example
 * <Icon
 *   svgContent="<path d='...' />"
 *   hoverAnimation="color-shift"
 *   hoverColor="#007bff"
 *   className="text-gray-500"
 * />
 */
const Icon = ({
  svgContent,
  size = 24,
  className = '',
  viewBox = '0 0 24 24',
  hoverAnimation = 'none',
  hoverColor,
}: IconProps): JSX.Element => {
  /**
   * @const iconVariants
   * @description Framer Motion variants used to orchestrate the hover animations.
   * The 'hover' state is dynamically generated based on the `hoverAnimation` prop.
   * The 'initial' state defines the resting position, ensuring a smooth transition back.
   */
  const iconVariants = {
    initial: {
      y: 0,
      rotate: 0,
    },
    hover: (() => {
      switch (hoverAnimation) {
        case 'bounce':
          return {
            y: -5,
            transition: { type: 'spring', stiffness: 400, damping: 10 },
          };
        case 'rotate':
          return {
            rotate: 20,
            transition: { type: 'spring', stiffness: 300 },
          };
        case 'color-shift':
          // Only apply animation if a hoverColor is provided
          return hoverColor
            ? { color: hoverColor, transition: { duration: 0.2 } }
            : {};
        case 'none':
        default:
          return {};
      }
    })(),
  };

  return (
    <motion.div
      // Use variants to control animations instead of direct `whileHover` props.
      // This pattern is more scalable and declarative.
      variants={iconVariants as Variants}
      initial="initial"
      whileHover="hover"
      // The inline 'style' attribute has been replaced with Tailwind classes for layout.
      // The passed 'className' is merged to allow for custom styling (e.g., text color).
      className={`inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="currentColor" // This is key for the 'color-shift' animation to work via the parent's color property
        xmlns="http://www.w3.org/2000/svg"
        // Security Note: The `svgContent` should always come from a trusted source
        // to prevent XSS vulnerabilities.
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </motion.div>
  );
};

export default Icon;