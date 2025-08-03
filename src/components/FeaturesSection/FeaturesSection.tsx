import React, { ReactNode, JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import { FeatureCard } from '../FeatureCard/FeatureCard';

/**
 * @interface IFeatureItem
 * @description Defines the structure for a single feature item.
 * This interface is exported to allow parent components to easily construct the features array.
 */
export interface IFeatureItem {
  /**
   * The icon representing the feature.
   * @type {ReactNode}
   * @example <SvgIconComponent />
   */
  icon: ReactNode;

  /**
   * The title of the feature.
   * @type {string}
   * @example "24/7 Support"
   */
  title: string;

  /**
   * A brief description of the feature.
   * @type {string}
   * @example "Our team is available around the clock to assist you."
   */
  description: string;
}

/**
 * @interface FeaturesSectionProps
 * @description Defines the props for the FeaturesSection component.
 */
export interface FeaturesSectionProps {
  /**
   * The main title of the features section.
   * @type {string}
   */
  title: string;

  /**
   * An array of feature objects to be displayed.
   * @type {IFeatureItem[]}
   */
  features: IFeatureItem[];

  /**
   * A unique identifier for the section, useful for anchor links and testing.
   * @type {string}
   * @optional
   */
  id?: string;

  /**
   * An optional CSS class name to apply to the root section element for custom styling.
   * @type {string}
   * @optional
   */
  className?: string;

  /**
   * An optional subtitle or a short introductory text for the section.
   * @type {string}
   * @optional
   */
  subtitle?: string;
}

/**
 * Framer Motion variants for the animation of the container and its items.
 * This allows for a staggered animation effect as the section comes into view.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};


/**
 * @component FeaturesSection
 * @description A section component designed to showcase a list of key features for a service.
 * It uses framer-motion for subtle animations and is built with a flexible and strongly-typed API.
 *
 * @param {FeaturesSectionProps} props - The props for the component.
 * @returns {JSX.Element} The rendered FeaturesSection component.
 *
 * @example
 * const features = [
 *   { icon: <Icon1 />, title: "Eco-Friendly", description: "We use biodegradable detergents." },
 *   { icon: <Icon2 />, title: "Fast Delivery", description: "Get your laundry back in 24 hours." },
 *   { icon: <Icon3 />, title: "Affordable Prices", description: "Premium service without the premium cost." }
 * ];
 *
 * <FeaturesSection
 *   id="laundry-features"
 *   title="Why Choose Us?"
 *   subtitle="Experience the best laundry service in town with these amazing benefits."
 *   features={features}
 * />
 */
const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  id,
  className = '',
  title,
  subtitle,
  features,
}): JSX.Element => {
  // Defensive check to prevent rendering issues if features array is empty or not provided.

  return (
    <section id={id} className={`w-full bg-gray-50 py-16 px-4 sm:py-24 lg:px-8 ${className}`}>
      <motion.div
        className="mx-auto max-w-7xl text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants as Variants}
      >
        <motion.h2
          className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          variants={itemVariants as Variants}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600"
            variants={itemVariants as Variants}
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          className="mt-16 grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-3"
          // This nested container creates a cascade effect: header animates, then the grid items animate.
          variants={containerVariants as Variants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={`${feature.title}-${index}`}
              variants={itemVariants as Variants}
            >
              <FeatureCard
                iconName={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;