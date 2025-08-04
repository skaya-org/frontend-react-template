import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import FeatureCard from '../FeatureCard/FeatureCard';

/**
 * @typedef {object} Feature
 * @property {string} id - A unique identifier for the feature.
 * @property {string} title - The title of the feature.
 * @property {string} description - A brief description of the feature.
 * @property {string} imageUrl - The URL for the feature's representative image.
 * @property {string} imageAlt - The alt text for the feature's image.
 */
type Feature = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

/**
 * Constant data for the features to be displayed.
 * This component is self-contained and does not require props for its data,
 * ensuring modularity and ease of use.
 * NOTE: This approach assumes the imported `FeatureCard` component accepts props
 * to display unique content, which is a standard React pattern for reusable components.
 * The `FeatureCard` itself would be responsible for its own layout and styling.
 * @const {Feature[]} FEATURES_DATA
 */
const FEATURES_DATA: Feature[] = [
  {
    id: 'feature-react',
    title: 'Powered by React',
    description: 'Built with the latest React features, including functional components and hooks, for a declarative and efficient UI.',
    imageUrl: 'https://picsum.photos/seed/react/400/300.webp',
    imageAlt: 'Abstract representation of React framework',
  },
  {
    id: 'feature-pluggable',
    title: 'Pluggable Architecture',
    description: 'Easily extend and customize functionality. Our modular design allows for seamless integration of new features and plugins.',
    imageUrl: 'https://picsum.photos/seed/pluggable/400/300.webp',
    imageAlt: 'Interlocking puzzle pieces representing a pluggable architecture',
  },
  {
    id: 'feature-translations',
    title: 'Ready for Translations',
    description: 'Internationalization (i18n) support is baked in, making it simple to adapt your product for a global audience.',
    imageUrl: 'https://picsum.photos/seed/translate/400/300.webp',
    imageAlt: 'Globe with various language characters',
  },
];

/**
 * Animation variants for the text block (title and subtitle).
 * @const {Variants}
 */
const textBlockVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

/**
 * Animation variants for individual text elements (h2, p).
 * @const {Variants}
 */
const textVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14 },
  },
};

/**
 * Animation variants for the grid container to orchestrate card animations.
 * @const {Variants}
 */
const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

/**
 * Animation variants for each feature card item.
 * @const {Variants}
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

/**
 * A section component that showcases the key features of the product.
 * It uses a responsive grid to display multiple `FeatureCard` components,
 * each populated with hardcoded data defined within this component.
 * This self-contained approach ensures the component is easy to drop into any page
 * without needing to pass down props.
 *
 * @component
 * @returns {JSX.Element} The rendered FeaturesSection component.
 */
const FeaturesSection = (): JSX.Element => {
  return (
    <section className="bg-gray-50 py-12 dark:bg-gray-900 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          variants={textBlockVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.h2
            className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl"
            variants={textVariants as Variants}
          >
            Key Features
          </motion.h2>
          <motion.p
            className="mt-4 text-lg leading-6 text-gray-500 dark:text-gray-400"
            variants={textVariants as Variants}
          >
            Discover what makes our product stand out.
          </motion.p>
        </motion.div>

        {/*
          A motion-enhanced grid for displaying feature cards.
          The `motion.div` uses variants to create a staggered animation effect
          for a more engaging user experience.
          Proper error boundaries would typically wrap this mapping function in a production application
          to gracefully handle potential rendering errors, although with static data the risk is minimal.
        */}
        <motion.div
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={gridContainerVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {FEATURES_DATA.map((feature) => (
            <motion.div key={feature.id} variants={itemVariants as Variants}>
              {/*
                The FeatureCard component is imported and used here.
                We are passing the constant data as props to each card.
                This allows for a single, reusable FeatureCard component
                while enabling this FeaturesSection to control and display
                a unique set of features.
              */}
              <FeatureCard
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;