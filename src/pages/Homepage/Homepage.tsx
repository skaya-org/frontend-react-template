import React, { useState, useEffect, useRef, JSX } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

// As per instructions, interfaces should be created with an export
// so they can be imported in other components.
/**
 * Interface for a single event on the timeline.
 */
export interface ITimelineEvent {
  year: string;
  title: string;
  description:string;
}

// Data and constants are defined outside the component to prevent re-declaration on re-renders.
const TIMELINE_DATA: ITimelineEvent[] = [
  {
    year: "2018",
    title: "Entry into Blockchain",
    description: "Started my journey by exploring Bitcoin and Ethereum. Wrote my first 'Hello World' smart contract on Solidity.",
  },
  {
    year: "2019",
    title: "First dApp Project",
    description: "Developed and deployed a decentralized voting application on the Ropsten testnet, learning about Truffle, Ganache, and Web3.js.",
  },
  {
    year: "2020",
    title: "DeFi Exploration & Security",
    description: "Contributed to an open-source DeFi lending protocol. Focused on security audits and gas optimization for smart contracts.",
  },
  {
    year: "2021",
    title: "Lead Blockchain Developer",
    description: "Led a team to build a cross-chain NFT marketplace, integrating with Layer 2 solutions like Polygon for scalability.",
  },
  {
    year: "2022",
    title: "DAO & Governance Models",
    description: "Architected and implemented a decentralized autonomous organization (DAO) governance model for a community-driven project.",
  },
  {
    year: "2023",
    title: "Web3 Consulting & Mentorship",
    description: "Started consulting for Web3 startups, advising on tokenomics, security best practices, and protocol architecture.",
  },
];

const TYPEWRITER_TEXTS = [
  "Blockchain Developer",
  "Smart Contract Expert",
  "DeFi Architect",
  "Web3 Innovator"
];

const TYPING_SPEED = 120;
const DELETING_SPEED = 60;
const PAUSE_DURATION = 2000;

// --- Animation Variants ---

// Variants for the hero section container to orchestrate staggered animations.
const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

// Variants for individual items within the hero section.
const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
};

// Variants for the "My Journey" title.
const journeyTitleVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Variants for timeline items. Uses a custom prop to determine animation direction.
const timelineItemVariants: Variants = {
  hidden: (isLeft: boolean) => ({
    opacity: 0,
    x: isLeft ? -100 : 100,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Homepage component for a blockchain developer portfolio.
 * Features a typewriter effect in the hero section and an animated timeline of experience.
 */
const Homepage = (): JSX.Element => {
  // --- Typewriter Effect Logic ---
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = TYPEWRITER_TEXTS[wordIndex];
      const nextText = isDeleting
        ? currentWord.substring(0, text.length - 1)
        : currentWord.substring(0, text.length + 1);

      setText(nextText);

      if (!isDeleting && nextText === currentWord) {
        setTimeout(() => setIsDeleting(true), PAUSE_DURATION);
      } else if (isDeleting && nextText === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? DELETING_SPEED : TYPING_SPEED);

    return () => clearTimeout(timer);
  }, [wordIndex, isDeleting, text]);


  // --- Timeline Animation Logic ---
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end end"]
  });

  const timelineLineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="bg-[#0a0a0a] text-gray-200 font-mono min-h-[200vh] overflow-x-hidden">
      {/* Hero Section with Typewriter */}
      <motion.section
        className="h-screen flex flex-col justify-center items-center text-center px-5"
        variants={heroContainerVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="text-2xl text-gray-400" variants={heroItemVariants as Variants}>
          Hello, I'm a
        </motion.p>
        <motion.h1
          className="text-[clamp(2rem,8vw,4.5rem)] font-bold text-[#4dffaf] h-24 flex items-center"
          variants={heroItemVariants as Variants}
        >
          <span>{text}</span>
          <motion.div
            className="inline-block w-1 h-[clamp(2.2rem,8vw,4.7rem)] bg-[#4dffaf] ml-2"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.h1>
      </motion.section>

      {/* Timeline Section */}
      <section id="journey" className="py-24 px-5 relative">
        <motion.h2
          className="text-center text-4xl mb-20 text-white font-bold"
          variants={journeyTitleVariants as Variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          My Journey
        </motion.h2>
        <div className="relative max-w-5xl mx-auto" ref={timelineRef}>
          {/* Background line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-800 -translate-x-1/2"></div>
          {/* Progress line */}
          <motion.div
            className="absolute left-1/2 top-0 w-1 bg-[#4dffaf] -translate-x-1/2"
            style={{ height: timelineLineHeight }}
          />
          {TIMELINE_DATA.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                className={`relative w-1/2 p-2.5 px-10 box-border
                  ${isLeft ? 'left-0' : 'left-1/2'}
                  after:content-[''] after:absolute after:w-[25px] after:h-[25px] after:bg-[#0a0a0a]
                  after:border-4 after:border-[#4dffaf] after:top-[25px] after:rounded-full after:z-10
                  ${isLeft ? 'after:right-[-14.5px]' : 'after:left-[-14.5px]'}`
                }
                key={item.year}
                variants={timelineItemVariants as Variants}
                custom={isLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <div
                  className={`relative p-5 sm:p-7 bg-[#1a1a1a] rounded-md border border-gray-700 shadow-lg shadow-black/20
                    ${isLeft ? 'text-right' : 'text-left'}
                    after:content-[''] after:absolute after:top-7 after:w-0 after:h-0
                    after:border-[10px] after:border-transparent
                    ${isLeft ? 'after:right-[-20px] after:border-l-gray-700' : 'after:left-[-20px] after:border-r-gray-700'}`
                  }
                >
                  <h3 className="text-2xl font-bold text-[#4dffaf] mb-1">{item.year}</h3>
                  <h4 className="text-lg font-bold text-white mb-2.5">{item.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Homepage;