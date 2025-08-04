import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

interface TypewriterEffectProps {}

const TypewriterEffect = (): JSX.Element => {
  const TEXT_CONTENT: string = "Hello, I am a senior fullstack developer specializing in TypeScript and React. I build production-grade web applications.";
  const CHARACTER_ANIMATION_DURATION: number = 0.05;
  const CHARACTER_ANIMATION_STAGGER: number = 0.05;
  const CURSOR_BLINK_DURATION: number = 0.8;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: CHARACTER_ANIMATION_STAGGER,
      },
    },
  };

  const characterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: CHARACTER_ANIMATION_DURATION,
        ease: "easeOut",
      },
    },
  };

  const cursorVariants = {
    blink: {
      opacity: [0, 1, 1, 0],
      transition: {
        duration: CURSOR_BLINK_DURATION,
        repeat: Infinity,
        repeatDelay: 0.1,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4 bg-gray-900 text-white rounded-lg shadow-xl font-mono max-w-full">
      <motion.div
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-left whitespace-pre-wrap flex flex-wrap items-end max-w-full"
        variants={containerVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        {TEXT_CONTENT.split("").map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            variants={characterVariants as Variants}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
        <motion.span
          className="inline-block w-1 bg-white ml-1 h-[1em] relative top-[0.1em]"
          variants={cursorVariants as Variants}
          animate="blink"
        />
      </motion.div>
    </div>
  );
};

export default TypewriterEffect;