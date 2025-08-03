import React, { JSX } from 'react';
import InfoCard,{ InfoCardProps } from 'src/components/InfoCard/InfoCard';
import { motion, Variants } from 'framer-motion';

/**
 * @interface ContentSectionProps
 * @description Defines the props for the ContentSection component.
 * @property {string} title - The heading for the content section.
 * @property {InfoCardProps[]} items - An array of item props to be passed to the InfoCard component.
 */
export interface ContentSectionProps {
  title: string;
  items: InfoCardProps[];
}

/**
 * Animation variants for the main container to orchestrate staggered animations for its children.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Animation variants for the title, making it fade in and slide down slightly.
 */
const titleVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            duration: 0.5,
            ease: "easeOut" 
        } 
    },
};

/**
 * Animation variants for each grid item (InfoCard), making them fade in and slide up.
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
        duration: 0.5,
        ease: "easeOut"
    }
  },
};


/**
 * @name ContentSection
 * @description A flexible section component for displaying content, such as a grid of features or services.
 * It uses the InfoCard component to display individual items.
 * @param {ContentSectionProps} { title, items } - The props for the component.
 * @returns {JSX.Element} A section element containing a title and a grid of InfoCard components.
 */
const ContentSection = ({ title, items }: ContentSectionProps): JSX.Element => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl lg:text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={titleVariants as Variants}
        >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {title}
            </h2>
        </motion.div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <motion.div 
            className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants as Variants}
          >
            {items.map((item, index) => (
              <motion.div key={`${item.title}-${index}`} variants={itemVariants as Variants}>
                <InfoCard
                  title={item.title}
                  description={item.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;