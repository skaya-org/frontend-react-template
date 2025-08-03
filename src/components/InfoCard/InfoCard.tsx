import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @interface InfoCardProps
 * @description Defines the properties for the InfoCard component.
 * @property {string} title - The title to be displayed on the card.
 * @property {string} description - The description or main content of the card.
 */
export interface InfoCardProps {
  title: string;
  description: string;
}

/**
 * @constant cardVariants
 * @description Animation variants for the InfoCard component.
 * Defines states for `hidden` (initial state before entering viewport),
 * `visible` (state when in viewport), and `hover`.
 */
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -5,
    scale: 1.03,
    boxShadow: '0px 10px 30px -5px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

/**
 * @component InfoCard
 * @description A simple card component to display a piece of information,
 * typically used in a grid layout within a section. It contains a title and a description.
 * It animates into view and has an interactive hover effect.
 * @param {InfoCardProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered card component.
 */
const InfoCard = ({ title, description }: InfoCardProps): JSX.Element => {
  return (
    <motion.div
      className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-md"
      variants={cardVariants as Variants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
    >
      <h3 className="mb-3 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-base leading-relaxed text-gray-600">{description}</p>
    </motion.div>
  );
};

export default InfoCard;