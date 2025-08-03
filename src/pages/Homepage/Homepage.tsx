import React, { JSX, useRef } from 'react';
import { motion, Variants, useScroll, useSpring } from 'framer-motion';

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
 * Represents a single project item, matching the ProjectsSection component props.
 */
export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  repoUrl?: string;
}

/**
 * Represents the data structure for the contact form submission.
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Props for the Homepage component.
 */
export interface HomepageProps {
  heroText?: string;
  heroSubtitle?: string;
  timelineTitle?: string;
  timelineData?: TimelineItem[];
  aboutMeTitle?: string;
  aboutMeDescription?: string | React.ReactNode;
  aboutMeImageUrl?: string;
  projectsTitle?: string;
  projectsData?: Project[];
  contactTitle?: string;
  onContactSubmit?: (formData: ContactFormData) => Promise<void>;
}

// --- Helper Data ---

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

// Mock data for the projects section
const defaultProjectsData: Project[] = [
  {
    title: 'Decentralized Exchange Aggregator',
    description: 'A platform that provides the best token swap rates by fetching data from multiple DEXs, ensuring optimal trading for users.',
    imageUrl: 'https://images.unsplash.com/photo-1642104791138-224152542475?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    projectUrl: '#',
    repoUrl: '#',
  },
  {
    title: 'On-Chain Governance Portal',
    description: 'A user-friendly interface for token holders to create and vote on governance proposals, driving community-led protocol development.',
    imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    projectUrl: '#',
  },
  {
    title: 'Cross-Chain NFT Bridge',
    description: 'An innovative solution allowing users to seamlessly transfer their NFTs between Ethereum, Polygon, and other compatible blockchains.',
    imageUrl: 'https://images.unsplash.com/photo-1640459392188-733d36481f19?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    repoUrl: '#',
  },
];

// Default handler for the contact form submission to ensure functionality
const defaultOnContactSubmit = async (formData: ContactFormData) => {
    console.log("Form submitted:", formData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Thank you, ${formData.name}! Your message has been sent.`);
};


// --- Animation Variants ---

const sentenceVariant: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.04,
    },
  },
};

const letterVariant: Variants = {
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

const timelineTitleVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const timelineItemsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const timelineItemVariant = (side: 'left' | 'right'): Variants => ({
  hidden: { opacity: 0, x: side === 'left' ? -100 : 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
});

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.2
    },
  },
};

// --- NEW VARIANTS ADDED FOR ABOUT, PROJECTS, AND CONTACT ---

const aboutContentVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const aboutImageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const aboutTextVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const projectCardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const formContainerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.15,
    }
  }
};

const formFieldVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};


// --- Main Component ---

const Homepage = ({
  heroText = "Blockchain Developer",
  heroSubtitle = "Architecting the Future of Decentralized Systems",
  timelineTitle = "My Journey & Contributions",
  timelineData = defaultTimelineData,
  aboutMeTitle = "About Me",
  aboutMeDescription = "I am a passionate blockchain engineer with over 5 years of experience in designing, developing, and deploying secure and scalable decentralized applications. My expertise lies in smart contract development, DeFi protocols, and Web3 integration. I am driven by the potential of blockchain to revolutionize industries and create more transparent, efficient, and equitable systems.",
  aboutMeImageUrl = "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
  projectsTitle = "My Projects",
  projectsData = defaultProjectsData,
  contactTitle = "Get In Touch",
  onContactSubmit = defaultOnContactSubmit,
}: HomepageProps): JSX.Element => {
  const timelineRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const data: ContactFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };
    onContactSubmit(data).then(() => {
        formEl.reset();
    });
  };

  return (
    <div className="bg-gray-900 text-gray-50 font-sans overflow-x-hidden antialiased">
      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-grid-gray-700/[0.2]">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {heroSubtitle}
        </motion.h1>
        
        <motion.div
          className="font-mono text-xl md:text-3xl text-gray-300 mt-2 flex items-center"
          variants={sentenceVariant}
          initial="hidden"
          animate="visible"
        >
          <span className="text-blue-400 mr-2">&gt;</span>
          {heroText.split("").map((char, index) => (
            <motion.span key={`${char}-${index}`} variants={letterVariant}>
              {char}
            </motion.span>
          ))}
          <motion.span
            className="w-0.5 h-8 bg-gray-50 ml-2"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          ></motion.span>
        </motion.div>
      </section>

      {/* TIMELINE SECTION */}
      <section ref={timelineRef} className="relative w-full max-w-6xl mx-auto py-20 px-4 md:px-8">
        <motion.h2
          className="text-center font-bold text-3xl md:text-4xl lg:text-5xl mb-24 text-gray-100"
          variants={timelineTitleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {timelineTitle}
        </motion.h2>
        
        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-gray-700 hidden md:block" aria-hidden="true"></div>
          <motion.div 
            className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-blue-500 origin-top hidden md:block" 
            style={{ scaleY }}
            aria-hidden="true"
          />
          
          <motion.div
            className="relative flex flex-col items-center gap-10"
            variants={timelineItemsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {timelineData.map((item) => (
              <motion.div
                key={item.id}
                className={`relative flex w-full items-start
                            md:w-1/2 ${item.side === 'left' ? 'md:self-start' : 'md:self-end'}`}
                variants={timelineItemVariant(item.side)}
              >
                <div className="flex flex-col items-center mr-4 md:hidden">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-gray-900 z-10"></div>
                  <div className="w-0.5 grow bg-gray-700 mt-2"></div>
                </div>

                <div
                  className={`hidden md:block absolute top-2 w-4 h-4 rounded-full bg-blue-500 z-10 border-2 border-gray-900
                              ${item.side === 'left' ? 'right-0 translate-x-[calc(50%+1px)]' : 'left-0 -translate-x-[calc(50%+1px)]'}`}
                  aria-hidden="true"
                ></div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/80 rounded-lg p-6 w-full shadow-lg shadow-black/30">
                  <div
                    className={`hidden md:block absolute top-4 w-4 h-4 bg-gray-800/80 border-gray-700/80
                                ${item.side === 'left' ? 'right-0 translate-x-1/2 border-r border-t rotate-45' : 'left-0 -translate-x-1/2 border-l border-b -rotate-45'}`}
                    aria-hidden="true"
                  ></div>

                  <p className="text-blue-400 font-semibold mb-1 text-sm">{item.date}</p>
                  <h3 className="text-lg font-bold text-gray-50 mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* ABOUT ME SECTION */}
      <motion.section
        className="w-full max-w-6xl mx-auto py-20 px-4 md:px-8"
        variants={sectionVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 className="text-center font-bold text-3xl md:text-4xl lg:text-5xl mb-16 text-gray-100" variants={timelineTitleVariants as Variants}>{aboutMeTitle}</motion.h2>
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16"
          variants={aboutContentVariants as Variants}
        >
          <motion.div 
            className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0"
            variants={aboutImageVariants as Variants}
          >
            <img src={aboutMeImageUrl} alt="A portrait of the developer" className="rounded-full w-full h-full object-cover border-4 border-gray-700 shadow-xl shadow-blue-500/20"/>
          </motion.div>
          <motion.div 
            className="text-center md:text-left max-w-xl"
            variants={aboutTextVariants as Variants}
          >
            <p className="text-lg text-gray-300 leading-relaxed">{aboutMeDescription}</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* PROJECTS SECTION */}
      <motion.section
        className="w-full max-w-7xl mx-auto py-20 px-4 md:px-8"
        variants={sectionVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2 className="text-center font-bold text-3xl md:text-4xl lg:text-5xl mb-16 text-gray-100" variants={timelineTitleVariants as Variants}>{projectsTitle}</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projectsData.map((project, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/80 rounded-xl overflow-hidden shadow-lg shadow-black/30 flex flex-col transition-all duration-300 hover:border-blue-500/80 hover:shadow-blue-500/20 hover:-translate-y-2"
              variants={projectCardVariants as Variants}
            >
              <img src={project.imageUrl} alt={project.title} className="w-full h-52 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-50 mb-2">{project.title}</h3>
                <p className="text-gray-400 text-base leading-relaxed flex-grow mb-6">{project.description}</p>
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-700/50">
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200">
                      View Project
                      <span className="ml-1.5">&#8599;</span>
                    </a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-semibold text-gray-400 hover:text-gray-200 transition-colors duration-200">
                      Code Repo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CONTACT ME SECTION */}
      <motion.section
        className="w-full max-w-4xl mx-auto py-20 px-4 md:px-8"
        variants={sectionVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          className="text-center font-bold text-3xl md:text-4xl lg:text-5xl mb-12 text-gray-100"
          variants={timelineTitleVariants as Variants}
        >
          {contactTitle}
        </motion.h2>
        <motion.div a
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/80 rounded-xl p-8 shadow-2xl shadow-black/40"
          variants={formContainerVariants as Variants}
        >
            <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={formFieldVariants as Variants}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                        <input
                            type="text" id="name" name="name" required
                            className="block w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-600 text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            placeholder="Ada Lovelace"
                        />
                    </motion.div>
                    <motion.div variants={formFieldVariants as Variants}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email" id="email" name="email" required
                            className="block w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-600 text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            placeholder="ada@example.com"
                        />
                    </motion.div>
                </div>
                <motion.div variants={formFieldVariants as Variants}>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                    <textarea
                        id="message" name="message" rows={5} required
                        className="block w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-600 text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-y"
                        placeholder="Your inquiry, project idea, or greeting..."
                    ></textarea>
                </motion.div>
                <motion.div className="text-center md:text-right" variants={formFieldVariants as Variants}>
                    <motion.button
                        type="submit"
                        className="inline-block w-full md:w-auto px-10 py-3 font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(109, 40, 217, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        Send Message
                    </motion.button>
                </motion.div>
            </form>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Homepage;