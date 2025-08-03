import React, { JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// --- CONSTANT DATA ---

/**
 * @typedef {object} ProjectData
 * @property {string} title - The title of the project.
 * @property {string} id - A unique identifier for the project.
 * @property {string} description - A brief summary of the project.
 * @property {string} imageUrl - The URL for the project's preview image.
 * @property {string[]} techStack - An array of technologies used in the project.
 * @property {string} status - The current status of the project.
 */

/**
 * Static data for the project to be displayed in the holographic preview.
 * This ensures the component is self-contained and does not require props.
 * @type {ProjectData}
 */
const PROJECT_DATA = {
  id: 'PROJ-AI-001',
  title: 'Project: Chimera',
  description: 'An advanced AI-driven data synthesis platform designed to accelerate research and development cycles by generating high-fidelity, privacy-preserving synthetic datasets.',
  imageUrl: 'https://picsum.photos/seed/chimera/400/300.webp',
  techStack: ['TypeScript', 'React', 'Node.js', 'Python', 'CUDA'],
  status: 'ONLINE',
};

// --- ERROR BOUNDARY FALLBACK ---

/**
 * A fallback component to display when a critical error occurs within the HolographicPreview.
 * It maintains the holographic aesthetic to provide a consistent user experience.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} The rendered error fallback UI.
 */
const HolographicErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div className="relative w-[clamp(320px,90vw,800px)] font-[orbitron,sans-serif,monospace] bg-[rgba(15,35,55,0.8)] backdrop-blur-lg border border-[rgba(255,0,0,0.4)] rounded-lg p-6 text-[#ff8a8a] [text-shadow:0_0_5px_#ff4d4d] shadow-[0_0_15px_rgba(255,0,0,0.2),_0_0_30px_rgba(255,0,0,0.1)_inset] overflow-hidden">
    <div className="p-5 text-center">
      <h2 className="m-0 text-2xl text-[#ff8a8a] uppercase">SYSTEM MALFUNCTION</h2>
      <p className="my-2.5 text-lg">Holographic display driver crashed.</p>
      <pre className="bg-red-900/30 border border-red-500/50 p-2.5 rounded whitespace-pre-wrap break-all text-left text-xs mt-4">
        {error?.message}
      </pre>
    </div>
  </div>
);


// --- MAIN COMPONENT ---

/**
 * A futuristic, self-contained holographic project preview component.
 * It displays static project information with dynamic, generative animations
 * to simulate a high-tech interface. The component is designed to be
 * entirely self-sufficient, fetching no props and managing its own state.
 *
 * @returns {JSX.Element} The rendered HolographicPreview component.
 */
const HolographicPreview = (): JSX.Element => {
  /**
   * Animation variants for the main container using Framer Motion.
   * Defines the 'hidden' and 'visible' states for the enter animation.
   */
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  /**
   * Animation variants for child elements, creating a staggered fade-in effect.
   */
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120 },
    },
  };

  /**
   * Variants for the image reveal, animating clip-path for a focused reveal effect.
   */
  const imageRevealVariants: Variants = {
    hidden: { opacity: 0, clipPath: 'inset(45% 45% 45% 45% round 8px)' },
    visible: {
      opacity: 0.8,
      clipPath: 'inset(0% 0% 0% 0% round 0px)',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 },
    },
  };

  /**
   * Variants for orchestrating letter-by-letter text animation.
   */
  const sentenceVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.015,
        delayChildren: 0.5,
      },
    },
  };

  /**
   * Variants for individual letters, creating a "typed" or "streamed" effect.
   */
  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 15, stiffness: 200 },
    },
  };

  /**
   * Variants for orchestrating the tech stack list animation.
   */
  const techListVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.6,
      },
    },
  };
  
  /**
   * Variants for individual tech stack items.
   */
  const techItemVariants: Variants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 120 },
    },
  };
  
  const cornerBracketBase = "absolute w-[20px] h-[20px] border-solid border-[rgba(0,255,255,0.7)] cursor-pointer";
  const descriptionChars = PROJECT_DATA.description.split('');

  return (
    <ErrorBoundary FallbackComponent={HolographicErrorFallback}>
      <AnimatePresence>
        <motion.div
          className="relative w-[clamp(320px,90vw,800px)] font-[orbitron,sans-serif,monospace] bg-[rgba(15,35,55,0.8)] backdrop-blur-lg border border-[rgba(0,255,255,0.4)] rounded-lg p-6 text-[#e0faff] [text-shadow:0_0_5px_rgba(0,255,255,0.5),_0_0_10px_rgba(0,255,255,0.3)] shadow-[0_0_15px_rgba(0,255,255,0.2),_0_0_30px_rgba(0,255,255,0.1)_inset] overflow-hidden"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants as Variants}
        >
          {/* Static and animated decorative elements for holographic effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[rgba(0,255,255,0.1)] to-transparent animate-[scan_4s_linear_infinite]" />
          <motion.div
            className="absolute inset-0 w-full h-full bg-[rgba(0,255,255,0.5)] pointer-events-none"
            animate={{ opacity: [0, 0.05, 0.02, 0.08, 0.03, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div variants={itemVariants as Variants} whileHover={{ scale: 1.2, borderColor: 'rgba(255,255,255,1)' }} className={`${cornerBracketBase} top-[10px] left-[10px] border-t-2 border-l-2`} />
          <motion.div variants={itemVariants as Variants} whileHover={{ scale: 1.2, borderColor: 'rgba(255,255,255,1)' }} className={`${cornerBracketBase} top-[10px] right-[10px] border-t-2 border-r-2`} />
          <motion.div variants={itemVariants as Variants} whileHover={{ scale: 1.2, borderColor: 'rgba(255,255,255,1)' }} className={`${cornerBracketBase} bottom-[10px] left-[10px] border-b-2 border-l-2`} />
          <motion.div variants={itemVariants as Variants} whileHover={{ scale: 1.2, borderColor: 'rgba(255,255,255,1)' }} className={`${cornerBracketBase} bottom-[10px] right-[10px] border-b-2 border-r-2`} />

          {/* Header Section */}
          <motion.header className="flex justify-between items-center border-b border-[rgba(0,255,255,0.3)] pb-4 mb-4" variants={itemVariants as Variants}>
            <div className="flex flex-col">
              <h1 className="m-0 text-3xl text-white tracking-[2px] uppercase">{PROJECT_DATA.title}</h1>
              <span className="text-xs text-[rgba(0,255,255,0.8)] mt-1">ID: {PROJECT_DATA.id}</span>
            </div>
            <div className="flex items-center gap-2 bg-[rgba(0,255,255,0.1)] py-1.5 px-3 rounded border border-[rgba(0,255,255,0.2)]">
              <span className="w-2.5 h-2.5 bg-[#00ff00] rounded-full shadow-[0_0_8px_#00ff00] animate-[pulse_1.5s_infinite]" />
              <span className="text-sm font-bold text-[#00ff99]">{PROJECT_DATA.status}</span>
            </div>
          </motion.header>

          {/* Main Content Area */}
          <main className="flex flex-col md:flex-row gap-6">
            <motion.div className="relative flex-1 min-w-[250px] border border-[rgba(0,255,255,0.3)] p-1 bg-black/30" variants={itemVariants as Variants}>
              <motion.img src={PROJECT_DATA.imageUrl} alt={PROJECT_DATA.title} className="w-full h-auto block object-cover mix-blend-screen opacity-80" variants={imageRevealVariants as Variants} />
              <div className="absolute inset-0 w-full h-full [background-image:linear-gradient(rgba(0,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.15)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none" />
            </motion.div>
            <motion.div className="flex-[2] flex flex-col gap-3" variants={itemVariants as Variants}>
              <h2 className="mt-2 mb-1 text-base text-[#00ffff] uppercase tracking-[1px] border-b border-[rgba(0,255,255,0.2)] pb-1">DATA-STREAM</h2>
              <motion.p className="m-0 text-base leading-relaxed text-[#d0f0ff]" variants={sentenceVariants as Variants}>
                {descriptionChars.map((char, index) => (
                  <motion.span key={`${char}-${index}`} variants={letterVariants as Variants}>
                    {char}
                  </motion.span>
                ))}
              </motion.p>
              
              <h2 className="mt-2 mb-1 text-base text-[#00ffff] uppercase tracking-[1px] border-b border-[rgba(0,255,255,0.2)] pb-1">TECH MODULES</h2>
              <motion.div className="flex flex-wrap gap-2 mt-1" variants={techListVariants as Variants}>
                {PROJECT_DATA.techStack.map((tech) => (
                  <motion.span 
                    key={tech} 
                    className="bg-[rgba(0,255,255,0.1)] border border-[rgba(0,255,255,0.3)] rounded-[3px] py-1 px-2 text-[0.85rem] text-[#99feff]"
                    variants={techItemVariants as Variants}
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </main>
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
  );
};

// Add keyframes to the document's head for animations
// This is necessary because Tailwind's JIT compiler cannot generate
// keyframes without a config file, which is disallowed by the prompt.
if (typeof window !== 'undefined' && !document.getElementById('holographic-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'holographic-styles';
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
    
    @keyframes scan {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 5px #00ff00; }
      50% { box-shadow: 0 0 15px #00ff00, 0 0 5px #ffffff; }
      100% { box-shadow: 0 0 5px #00ff00; }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default HolographicPreview;