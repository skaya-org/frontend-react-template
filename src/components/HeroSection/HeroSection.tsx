import React, { JSX, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

/**
 * @interface CtaButtonProps
 * @description Defines the properties for a Call-to-Action button or link within the HeroSection.
 * Each CTA can either be a navigation link (using `to`) or a button with a click handler (using `onClick`).
 */
export interface CtaButtonProps {
  /** The text content displayed on the button. */
  text: string;
  /** The destination URL for the link. If provided, the component will render a `react-router-dom` Link. */
  to?: string;
  /** The function to execute when the button is clicked. Used if `to` is not provided. */
  onClick?: () => void;
  /**
   * The visual style of the button.
   * 'primary': Main action, usually with a solid background.
   * 'secondary': Alternative action, often with an outline or different color.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
  /** Optional custom CSS class for individual button styling. */
  className?: string;
}

/**
 * @interface HeroSectionProps
 * @description Defines the props for the HeroSection component.
 */
export interface HeroSectionProps {
  /**
   * The main headline for the hero section.
   * It can be a simple string or a more complex JSX.ReactNode for rich text formatting.
   */
  headline: ReactNode;
  /**
   * The subheadline or a short descriptive paragraph that appears below the main headline.
   * Optional.
   */
  subheadline?: ReactNode;
  /**
   * An array of Call-to-Action objects.
   * Renders buttons or links, allowing for multiple user actions.
   * @see CtaButtonProps
   * @default []
   */
  ctas?: CtaButtonProps[];
  /**
   * The visual content to display, such as an image, illustration, or a video component.
   * This node is placed opposite the text content based on the `layout` prop.
   */
  visualContent?: ReactNode;
  /**
   * Controls the arrangement of the text and visual content.
   * - 'text-left': Text content on the left, visual content on the right.
   * - 'text-right': Text content on the right, visual content on the left.
   * @default 'text-left'
   */
  layout?: 'text-left' | 'text-right';
  /** Optional custom CSS class to be applied to the root section element. */
  className?: string;
  /** Optional ID for the root section element, useful for anchor links. */
  id?: string;
}

/**
 * Framer Motion animation variants for staggering the appearance of child elements.
 * This container will orchestrate the animation of its children.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

/**
 * Framer Motion animation variants for individual items fading in and moving up.
 * This will be used for each text element and the visual content block.
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

/**
 * @name headlineVariants
 * @description Animation for the headline, combining a fade-in, upward movement, and a gradient text reveal.
 */
const headlineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      y: { type: 'spring', stiffness: 100 },
      opacity: { duration: 0.5 },
    },
  },
};

/**
 * @name floatingVariants
 * @description A continuous, gentle floating animation for the main visual illustration.
 */
const floatingVariants: Variants = {
  animate: {
    y: ['0rem', '-1.5rem', '0rem'],
    transition: {
      duration: 5,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

/**
 * @name pulseVariants
 * @description A continuous, subtle pulsing animation for the primary Call-to-Action button.
 * It combines a scale and box-shadow animation to draw attention.
 */
const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 0.5,
    },
  },
};

/**
 * @name HeroSection
 * @description A versatile and animated hero section component for homepages or landing pages.
 * It features a headline, subheadline, call-to-action buttons, and a slot for visual content.
 * The layout is configurable and the component is animated on entry using Framer Motion.
 *
 * @example
 * ```tsx
 * <HeroSection
 *   id="home"
 *   headline="Build Your Future with Us"
 *   subheadline="Experience the next generation of web development tools, designed for performance and developer happiness."
 *   ctas={[
 *     { text: "Get Started", to: "/signup" },
 *     { text: "Learn More", onClick: () => console.log('Learn more clicked!'), variant: 'secondary' }
 *   ]}
 *   visualContent={<img src="/path/to/your/image.svg" alt="Feature illustration" />}
 *   layout="text-left"
 * />
 * ```
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  headline,
  subheadline,
  ctas = [],
  visualContent,
  layout = 'text-left',
  className,
  id,
}): JSX.Element => {
  const MotionLink = motion(Link);

  // Define shared button styles
  const baseClasses =
    'inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900';
  const primaryClasses =
    'border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
  const secondaryClasses =
    'border-2 border-indigo-600 bg-transparent text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-500/10 focus:ring-indigo-500';

  return (
    <motion.section
      id={id}
      className={`relative w-full overflow-hidden bg-white px-4 py-20 dark:bg-slate-900 sm:px-6 md:py-32 lg:px-8 ${className || ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants as Variants}
      aria-labelledby={id ? `${id}-headline` : undefined}
    >
      <div
        className={`container mx-auto flex w-full flex-col items-center gap-12 lg:gap-16 ${
          layout === 'text-right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
        }`}
      >
        {/* Text Content: This div is a stagger container for its children */}
        <motion.div
          className={`flex flex-col items-center text-center lg:basis-1/2 ${
            layout === 'text-right'
              ? 'lg:items-end lg:text-right'
              : 'lg:items-start lg:text-left'
          }`}
        >
          <motion.h1
            id={id ? `${id}-headline` : undefined}
            className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
            variants={headlineVariants as Variants}
          >
            {headline}
          </motion.h1>

          {subheadline && (
            <motion.p
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400 md:text-xl"
              variants={itemVariants as Variants}
            >
              {subheadline}
            </motion.p>
          )}

          {ctas.length > 0 && (
            <motion.div
              className={`mt-10 flex flex-wrap items-center justify-center gap-4 ${
                layout === 'text-right' ? 'lg:justify-end' : 'lg:justify-start'
              }`}
              variants={itemVariants as Variants}
            >
              {ctas.map((cta, index) => {
                const isPrimary = cta.variant !== 'secondary';
                const buttonClasses = `${baseClasses} ${
                  isPrimary ? primaryClasses : secondaryClasses
                } ${cta.className || ''}`.trim();

                const commonMotionProps = {
                  whileHover: { scale: 1.05, y: -2 },
                  whileTap: { scale: 0.98 },
                  transition: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 17,
                  },
                };

                const CtaComponent = cta.to ? MotionLink : motion.button;
                const ctaProps = cta.to
                  ? { to: cta.to }
                  : { onClick: cta.onClick };

                return (
                  <motion.div
                    key={`${cta.text}-${index}`}
                    variants={isPrimary ? pulseVariants : ({} as Variants)}
                    animate="animate"
                  >
                    <CtaComponent
                      className={buttonClasses}
                      {...ctaProps}
                    >
                      {cta.text}
                    </CtaComponent>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Visual Content: This animates in as a single item */}
        {visualContent && (
          <motion.div
            className="flex w-full items-center justify-center lg:basis-1/2"
            variants={itemVariants as Variants}
          >
            <motion.div variants={floatingVariants as Variants} animate="animate">
              {visualContent}
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default HeroSection;