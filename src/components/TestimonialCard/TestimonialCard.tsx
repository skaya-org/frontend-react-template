// New component TestimonialCard
import React, { useRef, MouseEvent, JSX } from 'react';
import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';

/**
 * Interface for TestimonialCard props.
 * Exported to be available for other components.
 */
export interface TestimonialCardProps {
  quote: string;
  author: string;
  title: string;
  avatar: string;
}

/**
 * Animation variants for the main card container.
 * Controls the entrance animation of the card itself.
 */
const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.2, // Ensures child elements animate in sequence
    },
  },
};

/**
 * Animation variants for the child elements within the card.
 * Orchestrated by the parent's `staggerChildren` transition.
 */
const childVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
    },
  },
};

/**
 * A card component to display a single testimonial.
 * Features a 3D tilt effect on hover for a more dynamic and engaging user experience.
 */
const TestimonialCard = ({ quote, author, title, avatar }: TestimonialCardProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values to track mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Use springs for a smoother, more natural animation
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30, restDelta: 0.001 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30, restDelta: 0.001 });

  // Transform mouse position into 3D rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  // Event handler for mouse movement over the card
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Normalize mouse position to a range of -0.5 to 0.5
    const normalizedX = (mouseX / width) - 0.5;
    const normalizedY = (mouseY / height) - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
    scale.set(1.05); // Scale up on hover
  };

  // Event handler for when the mouse leaves the card
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1); // Reset scale
  };

  return (
    <div className="[perspective:1000px]">
      <motion.div
        ref={ref}
        variants={cardVariants as Variants}
        initial="initial"
        animate="animate"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
        }}
        className="relative flex w-[350px] flex-col items-center justify-center gap-4 rounded-3xl border border-white/20 bg-zinc-800/50 p-8 text-center text-white shadow-2xl shadow-black/40 backdrop-blur-[10px] [transform-style:preserve-3d]"
      >
        <motion.img
          variants={childVariants as Variants}
          src={avatar}
          alt={`${author}'s avatar`}
          className="mb-2 h-20 w-20 rounded-full border-4 border-white object-cover [transform:translateZ(60px)]"
        />
        <motion.blockquote
          variants={childVariants as Variants}
          className="mb-4 text-base italic leading-relaxed [transform:translateZ(40px)]"
        >
          "{quote}"
        </motion.blockquote>
        <motion.div variants={childVariants as Variants} className="[transform:translateZ(20px)]">
          <p className="text-lg font-bold">{author}</p>
          <p className="mt-1 text-sm opacity-80">{title}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TestimonialCard;