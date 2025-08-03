import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// --- Interfaces ---

/**
 * Represents a single item in the timeline.
 */
export interface TimelineItem {
  id: number | string;
  date: string;
  title: string;
  description: string;
  side: 'left' | 'right';
}

/**
 * Props for the Homepage component.
 */
export interface HomepageProps {
  heroText?: string;
  heroSubtitle?: string;
  timelineTitle?: string;
  timelineData?: TimelineItem[];
}

// --- Helper Components & Data ---

// Mock data for the timeline section, used as a default
const defaultTimelineData: TimelineItem[] = [
  {
    id: 1,
    date: 'Q1 2022',
    title: 'DeFi Lending Protocol Launch',
    description: 'Architected and launched a decentralized lending protocol on Ethereum, handling over $10M in TVL within the first month.',
    side: 'left',
  },
  {
    id: 2,
    date: 'Q3 2022',
    title: 'NFT Marketplace Smart Contracts',
    description: 'Developed and audited the ERC-721 and ERC-1155 smart contracts for a high-volume NFT marketplace, ensuring security and gas efficiency.',
    side: 'right',
  },
  {
    id: 3,
    date: 'Q1 2023',
    title: 'Zero-Knowledge Proof Integration',
    description: 'Led the integration of ZK-SNARKs for a private transaction feature on a Layer 2 scaling solution, enhancing user privacy.',
    side: 'left',
  },
  {
    id: 4,
    date: 'Q4 2023',
    title: 'Security Audit & Tokenomics',
    description: 'Conducted comprehensive security audits for multiple protocols and designed sustainable tokenomics models for new blockchain ventures.',
    side: 'right',
  },
  {
    id: 5,
    date: 'Q2 2024',
    title: 'Real-World Asset Tokenization',
    description: 'Pioneered a platform for tokenizing real-world assets (RWA), bridging traditional finance with decentralized networks.',
    side: 'left',
  },
];

// --- Animation Variants ---

// Variants for the typewriter text container
const sentenceVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.06,
    },
  },
};

// Variants for each letter in the typewriter text
const letterVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 200,
    },
  },
};

// Variants for the timeline container to stagger its children
const timelineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

// Variants for individual timeline items, animating from the sides
const timelineItemVariants: Variants = {
  hidden: (side: 'left' | 'right') => ({
    opacity: 0,
    x: side === 'left' ? -100 : 100,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 50,
      damping: 15,
    },
  },
};

// --- Main Component ---

const Homepage = ({
  heroText = "Blockchain Developer",
  heroSubtitle = "Architecting the Future of Decentralized Systems",
  timelineTitle = "My Journey & Contributions",
  timelineData = defaultTimelineData
}: HomepageProps): JSX.Element => {
  const letters = Array.from(heroText);

  return (
    <div className="bg-gray-900 text-gray-50 font-sans overflow-x-hidden">
      {/* HERO SECTION with Typewriter Animation */}
      <section className="min-h-screen flex flex-col justify-center items-center p-8 text-center">
        <motion.h1
          className="font-extrabold tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          variants={sentenceVariants as Variants}
          initial="hidden"
          animate="visible"
        >
          {letters.map((letter, index) => (
            <motion.span key={`${letter}-${index}`} variants={letterVariants as Variants}>
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h1>
        <p className="mt-4 max-w-3xl text-lg md:text-xl lg:text-2xl text-gray-400">
          {heroSubtitle}
        </p>
      </section>

      {/* TIMELINE SECTION with Scroll-based Animations */}
      <section className="relative w-full max-w-5xl mx-auto py-16 px-4 md:px-8">
        <h2 className="text-center font-bold text-3xl md:text-4xl lg:text-5xl mb-24">
          {timelineTitle}
        </h2>
        
        {/* Animated central line */}
        <motion.div
          className="absolute top-48 bottom-0 w-1 bg-gray-700 left-5 md:left-1/2 md:-ml-[2px] origin-top"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <motion.div
          className="relative flex flex-col items-start"
          variants={timelineContainerVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {timelineData.map((item) => (
            <motion.div
              key={item.id}
              custom={item.side}
              variants={timelineItemVariants as Variants}
              className={`relative mb-12 flex w-full justify-start pl-12 md:w-1/2 md:pl-0 ${
                item.side === 'left' 
                ? 'md:justify-end md:pr-8' 
                : 'md:self-end md:pl-8'
              }`}
            >
              {/* Timeline Dot */}
              <div
                className={`absolute top-1 h-5 w-5 rounded-full bg-sky-400 border-4 border-gray-900 z-10 left-[10px] ${
                  item.side === 'left' 
                  ? 'md:left-auto md:right-[-10px]' 
                  : 'md:left-[-10px]'
                }`}
              />
              {/* Timeline Card */}
              <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-800 p-6 text-left shadow-lg">
                <time className="block text-sm font-medium text-gray-400 mb-2">
                  {item.date}
                </time>
                <h3 className="text-xl font-semibold text-sky-400">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-gray-400">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Homepage;