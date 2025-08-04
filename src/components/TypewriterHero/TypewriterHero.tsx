import React, { useState, useEffect, useMemo, JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// --- CONSTANT DATA ---
/**
 * @constant TYPEWRITER_WORDS
 * @description An array of strings to be displayed by the typewriter effect.
 */
const TYPEWRITER_WORDS: string[] = [
  "Fullstack Developer",
  "TypeScript Expert",
  "React Specialist",
  "UI/UX Enthusiast",
  "Problem Solver",
];

/**
 * @constant SUBTITLE
 * @description The static subtitle text displayed below the main headline.
 */
const SUBTITLE: string = "Building modern, scalable, and beautiful web applications from concept to production.";

/**
 * @constant CTA_LABEL
 * @description The text label for the call-to-action button.
 */
const CTA_LABEL: string = "Explore My Work";

/**
 * @constant METEOR_COUNT
 * @description The number of meteor elements to render for the background effect.
 */
const METEOR_COUNT: number = 20;

// --- ANIMATION VARIANTS ---

/**
 * @constant containerVariants
 * @description Variants for the main content container. Orchestrates a staggered animation for its children.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

/**
 * @constant itemVariants
 * @description Variants for individual content items (headline, subtitle, button). Defines a fade-in and slide-up effect.
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.01, -0.05, 0.95], // A gentle ease-out curve
    },
  },
};

// --- HELPER COMPONENTS ---

/**
 * A single, randomly animated meteor element for the background effect.
 * Each meteor has a randomized starting position, animation duration, and delay
 * to create a natural-looking meteor shower.
 * @returns {JSX.Element} The rendered Meteor component.
 */
const Meteor = (): JSX.Element => {
  // useMemo ensures these random values are calculated only once per component instance.
  const top = useMemo(() => `${Math.floor(Math.random() * 100)}vh`, []);
  const left = useMemo(() => `${Math.floor(Math.random() * 200) - 100}vw`, []); // Spread across a wider area to enter from sides
  const duration = useMemo(() => Math.random() * 1.5 + 0.5, []); // Duration between 0.5s and 2s
  const delay = useMemo(() => Math.random() * 10, []); // Delay up to 10s

  return (
    <motion.div
      className="pointer-events-none absolute z-10 h-[2px] w-48 rounded-[9999px] bg-gradient-to-l from-slate-400 to-transparent shadow-[0_0_10px_1px_#ffffff44]"
      initial={{ opacity: 1, transform: 'rotate(215deg) translateX(0)' }}
      animate={{
        opacity: [0, 1, 0],
        transform: 'rotate(215deg) translateX(-1000px)',
      }}
      transition={{
        duration,
        delay,
        ease: 'linear',
        repeat: Infinity,
      }}
      style={{ top, left }}
    />
  );
};

/**
 * Renders a container with a specified number of Meteor components.
 * This component orchestrates the meteor shower effect.
 * @returns {JSX.Element} A fragment containing multiple Meteor components.
 */
const Meteors = (): JSX.Element => {
  const meteors = useMemo(() =>
    Array.from({ length: METEOR_COUNT }).map((_, i) => <Meteor key={`meteor-${i}`} />),
    []
  );

  return <>{meteors}</>;
};

// --- MAIN COMPONENT ---

/**
 * TypewriterHero is a full-screen hero section component.
 * It features a dark background with an animated meteor shower, a headline
 * with a typewriter effect, a subtitle, and a call-to-action button.
 * All content is self-contained and requires no props.
 *
 * @returns {JSX.Element} The complete hero section component.
 */
const TypewriterHero = (): JSX.Element => {
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 75 : 150;
    const currentWord = TYPEWRITER_WORDS[wordIndex];

    const handleTyping = () => {
      if (isDeleting) {
        // Deleting text
        setCurrentText((prev) => prev.substring(0, prev.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
        }
      } else {
        // Typing text
        setCurrentText((prev) => currentWord.substring(0, prev.length + 1));
        if (currentText === currentWord) {
            // Pause at the end of the word before starting to delete
            setTimeout(() => {
                setIsDeleting(true);
            }, 1500);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);

    // Cleanup function to clear the timeout when the component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex]);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 text-white">
      {/* Background Meteor Shower */}
      <Meteors />

      {/* Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center p-4 text-center"
        variants={containerVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants as Variants}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          I am a
          <span className="ml-3 inline-block min-w-[200px] text-sky-400 sm:min-w-[400px] md:min-w-[500px] lg:min-w-[650px]">
            {currentText}
          </span>
          {/* Blinking Cursor */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
            className="inline-block h-full w-[3px] translate-y-1 bg-slate-200"
            aria-hidden="true"
          />
        </motion.h1>
        <motion.p
          variants={itemVariants as Variants}
          className="mt-6 max-w-xl text-lg leading-8 text-slate-300"
        >
          {SUBTITLE}
        </motion.p>
        <motion.div variants={itemVariants as Variants} className="mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-md bg-sky-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition-colors hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {CTA_LABEL}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TypewriterHero;