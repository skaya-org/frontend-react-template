// FeatureCard.tsx

import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import type { IconProps } from 'src/components/Icon/Icon';
import Icon from 'src/components/Icon/Icon';

/**
 * Props for the FeatureCard component.
 * It defines the content and behavior of a feature card.
 */
export interface FeatureCardProps {
  /** The name of the icon to display, which is passed to the Icon component. */
  iconName:any
  /** The type of hover animation for the icon, passed to the Icon component. */
  iconHoverEffect?:any
  /** The title of the feature. */
  title: string;
  /** A short description of the feature. */
  description: string;
  /** Optional additional CSS classes for styling the card container. */
  className?: string;
}

/**
 * Variants for the card's hover animation.
 * - 'initial': The card's default state. The `y` position is set to 0.
 *   The initial box-shadow is controlled by the Tailwind CSS `shadow-sm` class.
 * - 'hover': The state when the mouse is over the card. The card lifts up (`y: -5`)
 *   and a more prominent shadow (`shadow-lg`) is applied for a "pop" effect.
 */
const cardVariants: Variants = {
  initial: {
    y: 0,
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", // Corresponds to shadow-lg
  },
};

/**
 * A card component to display a single feature, combining an icon and text.
 * This component encapsulates the hover animations for its icon by configuring
 * and rendering the Icon component. It also features its own hover animation.
 */
export const FeatureCard = ({
  iconName,
  iconHoverEffect,
  title,
  description,
  className,
}: FeatureCardProps): JSX.Element => {
  return (
    <motion.div
      className={`flex flex-col items-center p-8 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm cursor-pointer ${className || ''}`.trim()}
      variants={cardVariants as Variants}
      initial="initial"
      whileHover="hover"
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
        <Icon
          className="h-8 w-8 text-blue-600 dark:text-blue-400" svgContent={'Feature'}        />
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
    </motion.div>
  );
};