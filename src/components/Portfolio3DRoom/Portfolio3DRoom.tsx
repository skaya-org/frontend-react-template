import React, { useState, useRef, JSX, Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
// Import motion, useScroll, useTransform, Variants, and AnimatePresence from framer-motion
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// As per the prompt, we are importing components that are assumed to exist.
// These components are designed to be self-contained or receive data derived from constants within this file.
const InteractiveObject = lazy(() => import("../InteractiveObject/InteractiveObject"));
const VRToggle = lazy(() => import("../VRToggle/VRToggle"));
const HolographicPreview = lazy(() => import("../HolographicPreview/HolographicPreview"));

/**
 * @typedef {object} InteractiveObjectData
 * @property {string} id - A unique identifier for the object.
 * @property {'bookshelf' | 'screen' | 'poster'} type - The type of interactive object.
 * @property {string} title - The title of the object, e.g., "Project A".
 * @property {string} description - A short description of the content.
 * @property {string} image - URL for the object's preview image.
 * @property {string} link - The navigation link for the object's content (e.g., a case study or blog post).
 * @property {{ x: string; y: string; z: number }} position - The 3D position in the room.
 * @property {number} scale - The initial scale of the object.
 */
export interface InteractiveObjectData {
  id: string;
  type: 'bookshelf' | 'screen' | 'poster';
  title: string;
  description: string;
  image: string;
  link: string;
  position: {
    x: string;
    y: string;
    z: number;
  };
  scale: number;
}

/**
 * Constant data for all interactive elements within the 3D room.
 * This ensures the component is self-contained and does not require props for its primary content.
 * @const {InteractiveObjectData[]}
 */
const INTERACTIVE_OBJECTS_DATA: readonly InteractiveObjectData[] = [
  {
    id: 'case-study-a',
    type: 'screen',
    title: 'Project Phoenix: E-commerce Platform',
    description: 'A complete overhaul of a legacy e-commerce system, resulting in a 200% increase in performance and a 40% growth in conversions.',
    image: 'https://picsum.photos/seed/projectA/400/300.webp',
    link: '/portfolio/project-phoenix',
    position: { x: '-40vw', y: '5vh', z: -300 },
    scale: 1.1,
  },
  {
    id: 'case-study-b',
    type: 'screen',
    title: 'DataViz Pro: Analytics Dashboard',
    description: 'Developed a real-time data visualization dashboard for a leading fintech company, handling over 1 million data points per second.',
    image: 'https://picsum.photos/seed/projectB/400/300.webp',
    link: '/portfolio/dataviz-pro',
    position: { x: '40vw', y: '10vh', z: -450 },
    scale: 1.0,
  },
  {
    id: 'blog-shelf',
    type: 'bookshelf',
    title: 'The Tech Bookshelf',
    description: 'A collection of deep-dive articles on modern TypeScript, performance optimization, and system design patterns.',
    image: 'https://picsum.photos/seed/bookshelf/400/300.webp',
    link: '/blog',
    position: { x: '10vw', y: '25vh', z: 100 },
    scale: 1.3,
  },
  {
      id: 'about-me-poster',
      type: 'poster',
      title: 'About Me',
      description: 'Learn more about my journey, skills, and passion for creating exceptional digital experiences.',
      image: 'https://picsum.photos/seed/aboutme/300/400.webp',
      link: '/about',
      position: { x: '-25vw', y: '30vh', z: 250 },
      scale: 0.9,
  }
];

// --- Animation Variants ---

/**
 * Variants for the main room container to orchestrate staggered animations for its children.
 */
const roomContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2, // Each child will animate in 0.2s after the previous one
    },
  },
};

/**
 * Variants for the background layer for a smooth, deep fade-in effect.
 */
const backgroundVariants: Variants = {
    hidden: { opacity: 0, scale: 4.5 }, // Start slightly more zoomed to add depth
    visible: {
        opacity: 1,
        scale: 4, // Animate to its final scale, creating a subtle zoom-out
        transition: { duration: 2, ease: "easeOut" }
    }
};

/**
 * Variants for each interactive object, creating a gentle "pop-in" effect.
 */
const objectVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1, // Will be overridden by the inline style scale, but we need it for the animation
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};


/**
 * A fallback component to display when an error occurs within the Portfolio3DRoom.
 * @returns {JSX.Element} The error fallback UI.
 */
const ErrorFallback = ({ error }: { error: Error }): JSX.Element => (
  <div role="alert" className="flex h-screen w-full flex-col items-center justify-center bg-slate-900 p-4 text-slate-100">
    <h2 className="mb-4 text-center text-3xl font-bold text-slate-50">Something went wrong in the 3D Experience.</h2>
    <p className="mb-6 text-center text-lg text-slate-300">We are sorry for the inconvenience. Please try refreshing the page.</p>
    <pre className="mt-4 max-w-4xl w-full overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-sm text-red-400 sm:w-[80%]">{error.message}</pre>
  </div>
);

/**
 * A simple loading spinner to be used with React.Suspense.
 * @returns {JSX.Element} The loading indicator UI.
 */
const LoadingSpinner = (): JSX.Element => (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a1a] font-sans text-white">
        <div className="mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-[#61DAFB]"></div>
        <p className="text-lg tracking-wider">Constructing 3D Environment...</p>
    </div>
);


/**
 * The Portfolio3DRoom component serves as the main 3D environment for the portfolio.
 * It orchestrates the entire scene, including static and interactive elements,
 * parallax effects, and the display of detailed previews. This component is
 * self-contained, using constant data to populate its content, thus requiring no props.
 *
 * @component
 * @returns {JSX.Element} The rendered Portfolio3DRoom component.
 */
const Portfolio3DRoom = (): JSX.Element => {
  const [selectedObject, setSelectedObject] = useState<InteractiveObjectData | null>(null);

  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end end'],
  });
  
  // Parallax transformations for different layers in the room
  const backgroundTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  
  /**
   * Handles the selection of an interactive object.
   * @param {InteractiveObjectData} objectData - The data of the selected object.
   */
  const handleSelectObject = (objectData: InteractiveObjectData): void => {
    setSelectedObject(objectData);
  };

  /**
   * Handles closing the holographic preview.
   */
  const handleClosePreview = (): void => {
    setSelectedObject(null);
  };
                  const yTransform = useTransform(scrollYProgress, [0, 1], ['0%', `${-60 + 100 / 10}%`]);
  
  return (
          <div className=" min-h-[150vh] pt-[100px]">
            <motion.div 
              className="relative h-full w-full " 
              style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
              variants={roomContainerVariants as Variants}
              initial="hidden"
              animate="visible"
            >

              {/* Background Layer with entrance animation */}
              <motion.div 
                className=" top-0 left-0 h-[0%] w-full bg-[radial-gradient(circle_at_center,#1a1a3a,#0a0a1a)] bg-cover"
                style={{ y: backgroundTransform, transform: 'translateZ(-800px) scale(4)' }}
                variants={backgroundVariants as Variants}
              />
              
              {/* VRToggle: Allows switching to a 360-degree view. It's animated as part of the room. */}
              {/* This wrapper ensures the component animates in with the scene */}
              <motion.div variants={objectVariants as Variants} className="absolute top-4 right-4 z-50">
                <VRToggle />
              </motion.div>


              {/* Interactive Objects Layer */}
              {INTERACTIVE_OBJECTS_DATA.map((objectData) => {
                  // Apply different parallax speeds based on object's depth (z-index)
                  return (
                      <motion.div
                          key={objectData.id}
                          className="absolute left-1/2 top-1/2 cursor-pointer"
                          style={{
                            y: yTransform,
                            x: objectData.position.x,
                            top: objectData.position.y,
                            transform: `translateZ(${objectData.position.z}px) scale(${objectData.scale})`,
                            transformStyle: 'preserve-3d',
                          }}
                          variants={objectVariants as Variants}
                          whileHover={{ 
                            // Enhance hover by slightly increasing the scale and adding a subtle glow
                            scale: objectData.scale * 1.05,
                            boxShadow: "0px 0px 30px 5px rgba(128, 222, 234, 0.4)",
                            transition: { duration: 0.3 } 
                          }}
                          onClick={() => handleSelectObject(objectData)}
                      >
                          {/* 
                            This component demonstrates clean composition. Portfolio3DRoom manages layout and state,
                            while InteractiveObject is responsible for its own appearance and internal logic.
                            The onSelect prop connects the child's action to the parent's state.
                          */}
                          <InteractiveObject 
                          />
                      </motion.div>
                  );
              })}

            </motion.div>
            
            {/* Holographic Preview: Wrapped in AnimatePresence for graceful enter/exit animations */}
            <AnimatePresence>
              {selectedObject && (
                <HolographicPreview 
                  key={selectedObject.id} // Key is crucial for AnimatePresence
                />
              )}
            </AnimatePresence>
          </div>
  );
};

export default Portfolio3DRoom;