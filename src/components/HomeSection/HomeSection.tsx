import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * @interface IHomeSectionProps
 * @description Props for the HomeSection component. Defines the content and behavior of the hero section.
 */
export interface IHomeSectionProps {
  /**
   * The greeting text displayed at the top of the section.
   * @type {string}
   * @default "Hello, I'm"
   */
  greeting?: string;

  /**
   * The name to be prominently displayed. This is a required prop.
   * @type {string}
   * @required
   */
  name: string;

  /**
   * The title or role of the individual (e.g., "Senior Fullstack Developer"). This is a required prop.
   * @type {string}
   * @required
   */
  title: string;

  /**
   * A brief introduction or personal statement. It can be a simple string
   * or a more complex JSX element for richer content. This is a required prop.
   * @type {string | JSX.Element}
   * @required
   */
  introduction: string | JSX.Element;

  /**
   * Optional call-to-action details. If provided, a button/link will be rendered.
   * @type {{ text: string; link: string; }}
   * @optional
   */
  cta?: {
    /**
     * The text to display on the call-to-action button.
     * @type {string}
     */
    text: string;

    /**
     * The destination path for the call-to-action link. This should correspond to a
     * valid route configured in react-router-dom.
     * @type {string}
     */
    link: string;
  };

  /**
   * An optional custom CSS class to be applied to the root section element,
   * allowing for parent-level styling overrides.
   * @type {string}
   * @optional
   */
  className?: string;
}

// Create a motion-compatible component from react-router-dom's Link
const MotionLink = motion(Link);

/**
 * @component HomeSection
 * @description A reusable and animated 'hero' section for a portfolio's landing page.
 * It displays a greeting, name, title, and an introduction, with an optional call-to-action button.
 * The component integrates `framer-motion` for smooth entrance animations and `react-error-boundary`
 * for robustness, especially when rendering complex JSX for the introduction.
 *
 * @param {IHomeSectionProps} props The props for the component.
 * @returns {JSX.Element} The rendered HomeSection component.
 *
 * @example
 * <HomeSection
 *   name="Jane Doe"
 *   title="Creative Technologist & UI/UX Designer"
 *   introduction="I design and code beautifully simple things, and I love what I do."
 *   cta={{ text: "View My Portfolio", link: "/projects" }}
 * />
 */
const HomeSection = ({
  greeting = "Hello, I'm",
  name,
  title,
  introduction,
  cta,
  className = '',
}: IHomeSectionProps): JSX.Element => {
  // --- Animation Variants ---

  // Main container orchestrates the staggering of its direct children.
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // A generic slide-up and fade-in for most text elements.
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  // Special container for the name to stagger each letter individually.
  const nameContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  // Animation for each letter of the name for a dramatic reveal.
  const letterVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 300,
      },
    },
  };

  // Variants for the interactive Call To Action button.
  const ctaVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
    hover: {
      scale: 1.05,
      boxShadow: '0px 0px 15px 0px rgb(34 211 238 / 0.6)',
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
    tap: {
      scale: 0.95,
    },
  };

  // Split the name into an array of characters for the letter-by-letter animation.
  const nameChars = Array.from(name);

  // --- Render ---
  return (
    <section
      id="home"
      className={`flex flex-col justify-center items-center min-h-screen p-8 text-center bg-zinc-900 text-zinc-200 font-sans ${className}`.trim()}
    >
      <ErrorBoundary
        fallback={<div className="text-red-500">Error: Could not render hero content.</div>}
      >
        <motion.div
          className="max-w-3xl w-full"
          variants={containerVariants as Variants}
          initial="hidden"
          animate="visible"
          aria-labelledby="home-name"
        >
          <motion.h2
            className="text-lg md:text-xl font-normal text-zinc-400 mb-2"
            variants={itemVariants as Variants}
          >
            {greeting}
          </motion.h2>

          <motion.h1
            id="home-name"
            className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent flex justify-center"
            variants={nameContainerVariants as Variants}
            aria-label={name} // Provide the full name for screen readers
          >
            {nameChars.map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                className="inline-block" // Ensures transforms work correctly
                variants={letterVariants as Variants}
              >
                {/* Use non-breaking space for spaces to maintain layout */}
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.h3
            className="text-xl md:text-3xl font-medium text-cyan-400 mt-2 mb-6"
            variants={itemVariants as Variants}
          >
            {title}
          </motion.h3>

          <motion.div
            className="text-base md:text-lg leading-relaxed text-zinc-300 max-w-2xl mx-auto mb-10"
            variants={itemVariants as Variants}
          >
            {typeof introduction === 'string' ? <p className="m-0">{introduction}</p> : introduction}
          </motion.div>

          {cta && (
            <motion.div variants={itemVariants as Variants}>
              <MotionLink
                to={cta.link}
                className="inline-block py-3 px-8 text-base font-semibold text-zinc-900 bg-cyan-400 border-2 border-cyan-400 rounded-lg transition-colors duration-300 ease-in-out transform hover:bg-transparent hover:text-cyan-400"
                variants={ctaVariants as Variants}
                whileHover="hover"
                whileTap="tap"
              >
                {cta.text}
              </MotionLink>
            </motion.div>
          )}
        </motion.div>
      </ErrorBoundary>
    </section>
  );
};

export default HomeSection;