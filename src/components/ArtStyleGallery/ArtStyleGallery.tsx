import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @typedef {object} GalleryImage
 * @property {number} id - A unique identifier for the image.
 * @property {string} src - The source URL of the image.
 * @property {string} alt - The alternative text for the image, for accessibility.
 */
type GalleryImage = {
  id: number;
  src: string;
  alt: string;
};

/**
 * @const {GalleryImage[]} GALLERY_IMAGES
 * @description A constant array of image data for the art style gallery.
 * This data is hardcoded within the component to ensure it is self-contained
 * and does not require props.
 */
const GALLERY_IMAGES: readonly GalleryImage[] = [
  {
    id: 1,
    src: 'https://picsum.photos/seed/vaporwave1/600/800',
    alt: 'Concept art of a neon-lit cityscape under a purple sky.',
  },
  {
    id: 2,
    src: 'https://picsum.photos/seed/vaporwave2/600/800',
    alt: 'In-game screenshot of a character overlooking a desolate, futuristic landscape.',
  },
  {
    id: 3,
    src: 'https://picsum.photos/seed/vaporwave3/600/800',
    alt: 'A close-up of a holographic interface with glitch art effects.',
  },
  {
    id: 4,
    src: 'https://picsum.photos/seed/vaporwave4/600/800',
    alt: 'Concept art depicting a massive, decaying statue in a digital sea.',
  },
  {
    id: 5,
    src: 'https://picsum.photos/seed/vaporwave5/600/800',
    alt: 'Screenshot of a vehicle speeding down a data-stream highway.',
  },
  {
    id: 6,
    src: 'https://picsum.photos/seed/vaporwave6/600/800',
    alt: 'Art of a serene yet eerie environment with floating geometric shapes.',
  },
];

// Animation Variants for Framer Motion

/**
 * @const {Variants} sectionVariants
 * @description Controls the animation of the entire section, orchestrating the stagger
 * animation of its direct children (heading and gallery grid).
 */
const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Time delay between animating the heading and the grid
    },
  },
};

/**
 * @const {Variants} headingVariants
 * @description Defines the animation for the main heading, making it slide down and fade in.
 */
const headingVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

/**
 * @const {Variants} galleryGridVariants
 * @description Manages the gallery grid container. It fades in and then staggers the
 * animation of each image within it.
 */
const galleryGridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Time delay between each image animating in
    },
  },
};

/**
 * @const {Variants} imageItemVariants
 * @description Defines the animation for each individual gallery image,
 * making them scale up and fade in with a spring-like effect.
 */
const imageItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 12,
    },
  },
};


/**
 * Renders a single image for the gallery. This component is memoized for performance
 * and wrapped in a motion.div to apply individual item animations.
 *
 * @param {{ image: GalleryImage }} props - The props for the component.
 * @param {GalleryImage} props.image - The image object to render.
 * @returns {JSX.Element} A memoized and animated gallery image element.
 */
const MemoizedGalleryImage = React.memo(({ image }: { image: GalleryImage }): JSX.Element => {
  return (
    <motion.div variants={imageItemVariants as Variants}>
      <div
        className="group overflow-hidden rounded-lg border-2 border-[#bd93f9] shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_12px_30px_rgba(189,147,249,0.6)]"
      >
        <img
          src={image.src}
          alt={image.alt}
          className="block h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
      </div>
    </motion.div>
  );
});
MemoizedGalleryImage.displayName = 'MemoizedGalleryImage';


/**
 * `ArtStyleGallery` is a self-contained component that showcases the game's art style.
 * It features a prominent heading and a grid-based gallery of concept art and screenshots.
 * All content is hardcoded, and Framer Motion is used to create an engaging,
 * animated entrance for the component and its contents.
 *
 * @returns {JSX.Element} The rendered art style gallery component.
 */
const ArtStyleGallery = (): JSX.Element => {
  return (
    <motion.section
      className="w-full bg-[#0a0a1a] py-16 px-8 text-center font-sans text-[#e0e0e0]"
      variants={sectionVariants as Variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h2
        className="mb-10 text-5xl font-bold text-[#ff79c6] [text-shadow:0_0_10px_#ff79c6,0_0_20px_#ff79c6]"
        variants={headingVariants as Variants}
      >
        A Vaporwave Vision of a Dying World
      </motion.h2>
      <motion.div
        className="mx-auto grid max-w-6xl gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
        variants={galleryGridVariants as Variants}
      >
        {GALLERY_IMAGES.map((image) => (
          <MemoizedGalleryImage key={image.id} image={image} />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default ArtStyleGallery;