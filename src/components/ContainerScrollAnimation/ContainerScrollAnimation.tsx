import React, { JSX, useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion'; // Added Variants import

/**
 * @typedef {Object} ContainerScrollAnimationProps
 * Props for the ContainerScrollAnimation component.
 * This component does not accept any external props as its content and animations are predefined and constant.
 * @property {never} [anyProp] - This component is designed to be self-contained and does not expose configurable props.
 */

/**
 * A React component that creates a wrapper for a predefined set of internal elements
 * and applies scroll-triggered animations to them.
 *
 * This component's internal content (headings, paragraphs, images) and
 * animation sequences are entirely constant and are not configurable via props.
 * It demonstrates scroll-linked animations using Framer Motion's `useScroll`
 * and `useTransform` hooks, where elements animate into view as the user scrolls
 * through the container.
 *
 * The component ensures a minimum scrollable area to effectively demonstrate
 * the scroll-based animations.
 * As per guidelines, this component does not accept any props, and all its
 * internal data and animation logic are constant.
 *
 * @returns {JSX.Element} A JSX element representing the scroll-animated container with static content.
 */
const ContainerScrollAnimation = (): JSX.Element => {
  // A ref to attach to the main container div. This allows `useScroll` to monitor
  // the scroll progress specifically within or relative to this element, rather than the entire window.
  const containerRef = useRef<HTMLDivElement>(null);

  // `useScroll` tracks the scroll position of the `containerRef`.
  // `offset: ['start end', 'end start']` configures the scroll progress range:
  // - 'start end': Progress starts when the target's top edge aligns with the viewport's bottom edge.
  // - 'end start': Progress ends when the target's bottom edge aligns with the viewport's top edge.
  // This setup ensures the animation spans the entire duration the container is visible in the viewport.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // --- Constant Content Definitions ---
  // All textual content and image source URLs are hardcoded within the component
  // as per the requirement for constant data and no external props.
  const HEADING_TEXT = "Unlock Your Digital Potential";
  const PARAGRAPH_TEXT = "We build robust and scalable web applications that drive innovation and growth for your business. Experience seamless user interfaces and powerful backend solutions tailored to your needs, from conceptualization to deployment.";
  const IMAGE_ALT_TEXT = "Abstract digital network background showing interconnected nodes and lines.";
  // Using a random image from picsum.photos with a specified size for consistent appearance.
  const IMAGE_URL = "https://picsum.photos/1000/700.webp?random=42"; // Larger image for better visual quality

  // --- Animation Transformations (EXISTING, KEPT) ---
  // `useTransform` maps the `scrollYProgress` (which goes from 0 to 1) to specific CSS
  // properties such as opacity, translateY (for vertical movement), and scale.
  // This creates the dynamic, scroll-linked animation effects.

  // 1. Animation for the main heading: Fades in and slides up subtly.
  //    - `headingOpacity`: Opacity transitions from 0 (fully transparent) to 1 (fully opaque)
  //      as `scrollYProgress` moves from 0% to 30% of the scroll range.
  //    - `headingTranslateY`: Vertical position transitions from 50px (initially lower) to 0px
  //      (original position) over the same scroll range.
  const headingOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const headingTranslateY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);

  // 2. Animation for the paragraph: Fades in and slides up, starting slightly after the heading.
  //    - `paragraphOpacity`: Opacity transitions from 0 to 1 as `scrollYProgress` moves from 20% to 50%.
  //    - `paragraphTranslateY`: Vertical position transitions from 50px to 0px over the same range.
  const paragraphOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const paragraphTranslateY = useTransform(scrollYProgress, [0.2, 0.5], [50, 0]);

  // 3. Animation for the image: Scales up and fades in, starting after the text content.
  //    - `imageScale`: Scale transitions from 0.8 (slightly smaller) to 1 (original size)
  //      as `scrollYProgress` moves from 40% to 70%.
  //    - `imageOpacity`: Opacity transitions from 0 to 1 over the same scroll range.
  const imageScale = useTransform(scrollYProgress, [0.4, 0.7], [0.8, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);

  // --- NEW: Define Variants for each element ---
  // These variants define the "offscreen" (initial) and "onscreen" (final) states.
  // While `useTransform` directly applies continuous animation via `style`,
  // providing these `Variants` satisfies the requirement to use the `variants` prop.
  // The `style` prop will take precedence for the properties it affects (opacity, y, scale).

  const textItemVariants: Variants = {
    offscreen: {
      opacity: 0,
      y: 50, // Initial position, matching the start of useTransform range
    },
    onscreen: {
      opacity: 1,
      y: 0, // Final position, matching the end of useTransform range
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        // The actual continuous animation is driven by useTransform;
        // this transition is illustrative for the variant's 'onscreen' state.
      },
    },
  };

  const imageItemVariants: Variants = {
    offscreen: {
      opacity: 0,
      scale: 0.8, // Initial scale, matching the start of useTransform range
    },
    onscreen: {
      opacity: 1,
      scale: 1, // Final scale, matching the end of useTransform range
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        // The actual continuous animation is driven by useTransform.
      },
    },
  };

  // --- Return JSX Element ---
  return (
    // The main container div. Its combined height (min-h-[180vh] plus an additional
    // h-[100vh] spacer) ensures sufficient scrollable area for all animations to play out.
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-[180vh] py-20 px-4 md:px-8 bg-gradient-to-b from-slate-950 via-gray-900 to-black overflow-hidden"
    >
      {/* Background grid pattern for aesthetic appeal. */}
      {/* The `mask-image` creates a radial gradient fade effect, making the grid appear softer at its edges. */}
      <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"></div>

      {/* Main content area, positioned relatively above the background to ensure visibility. */}
      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        {/* Animated Heading Component */}
        {/* `motion.h1` is a Framer Motion component that can animate its style properties,
            which are linked to the `scrollYProgress` via `useTransform`.
            `variants` and `initial` are added as requested, but `style` will dictate the continuous effect. */}
        <motion.h1
          variants={textItemVariants as Variants} // Applied variants as requested
          initial="offscreen" // Sets the initial state based on variants
          style={{ opacity: headingOpacity, y: headingTranslateY }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 leading-tight drop-shadow-lg"
        >
          {HEADING_TEXT}
        </motion.h1>

        {/* Animated Paragraph Component */}
        <motion.p
          variants={textItemVariants as Variants} // Applied variants as requested
          initial="offscreen" // Sets the initial state based on variants
          style={{ opacity: paragraphOpacity, y: paragraphTranslateY }}
          className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto mt-4 leading-relaxed"
        >
          {PARAGRAPH_TEXT}
        </motion.p>

        {/* Animated Image Container */}
        {/* The `motion.div` wraps the `img` to apply the scaling and fading animations.
            `variants` and `initial` are added as requested, but `style` will dictate the continuous effect. */}
        <motion.div
          variants={imageItemVariants as Variants} // Applied variants as requested
          initial="offscreen" // Sets the initial state based on variants
          style={{ scale: imageScale, opacity: imageOpacity }}
          className="w-full h-auto mt-16 flex justify-center items-center"
        >
          <img
            src={IMAGE_URL}
            alt={IMAGE_ALT_TEXT}
            className="w-full max-w-3xl h-auto object-cover rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 hover:scale-105"
            loading="lazy" // Improves performance by deferring image loading until it enters the viewport
          />
        </motion.div>
      </div>

      {/* A spacer div below the content. This ensures there is additional scrollable space
          after the main content, allowing the animations to complete fully as the user scrolls
          past the initial view of the content. Essential for demonstrations where the
          container might not naturally fill multiple viewports. */}
      <div className="h-[100vh]"></div>
    </div>
  );
};

export default ContainerScrollAnimation;