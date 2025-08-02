import React from 'react';
import { motion, Variants } from 'framer-motion';

// Helper components for icons to keep the main JSX clean
const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
  </svg>
);

// Animation variants for the card and its children
const cardVariants: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, -0.01, 0.9], // Custom ease for a more refined feel
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

const imageVariants: Variants = {
  initial: { scale: 1.1, opacity: 0.8 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.05, -0.01, 0.9],
    },
  },
};


const ProjectCard = ({
  imageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
  title = "Project Title",
  description = "A brief and engaging description of the project, highlighting its main purpose and features. This section is designed to grow, pushing the content below to the bottom.",
  techStack = ["React", "Tailwind CSS", "Vite"],
  liveUrl = "#",
  sourceUrl = "#"
}) => {
  return (
    <motion.div
      className="flex flex-col max-w-sm bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:shadow-2xl"
      variants={cardVariants as Variants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div 
        className="w-full h-48 overflow-hidden" 
        variants={itemVariants as Variants}
      >
        <motion.img
            className="w-full h-full object-cover"
            src={imageUrl}
            alt={`Screenshot of ${title}`}
            variants={imageVariants as Variants}
        />
      </motion.div>
      
      <div className="p-6 flex flex-col flex-grow">
        <motion.h3 
            className="text-2xl font-bold text-slate-100 mb-2" 
            variants={itemVariants as Variants}
        >
            {title}
        </motion.h3>
        
        <motion.p 
            className="text-slate-400 text-base flex-grow mb-4" 
            variants={itemVariants as Variants}
        >
            {description}
        </motion.p>
        
        <motion.div className="mb-6" variants={itemVariants as Variants}>
          <p className="text-slate-500 text-sm font-medium mb-3">Technologies Used:</p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="bg-sky-900/50 text-sky-300 text-xs font-semibold px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
            className="mt-auto flex items-center justify-start gap-6 border-t border-slate-700 pt-4" 
            variants={itemVariants as Variants}
        >
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-300 font-semibold hover:text-sky-400 transition-colors"
          >
            <ExternalLinkIcon />
            Live Demo
          </a>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-300 font-semibold hover:text-sky-400 transition-colors"
          >
            <GitHubIcon />
            Source Code
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;