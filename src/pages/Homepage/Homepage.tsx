import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// Import required components and their props
import Navbar, { NavbarProps } from "src/components/Navbar/Navbar";
import HomeSection, { IHomeSectionProps } from 'src/components/HomeSection/HomeSection';
import Footer from 'src/components/Footer/Footer';

// Mock data for the components
const navbarProps: NavbarProps = {
  siteTitle: "John Doe | Frontend Developer",
  navLinks: [
    { label: "Home", to: "/", ariaLabel: "Navigate to the Home page" },
    { label: "Projects", to: "/projects", ariaLabel: "View my latest projects" },
    { label: "Blog", to: "/blog", ariaLabel: "Read my blog posts" },
    { label: "Contact", to: "/contact", ariaLabel: "Get in touch with me" }
  ],
  // A standard Tailwind shadow utility for depth
  className: "shadow-md"
};

const homeSectionProps: IHomeSectionProps = {
  greeting: "Hello, I'm",
  name: "Alex Rivera",
  title: "Senior Software Engineer",
  introduction: "I specialize in building (and occasionally designing) exceptional digital experiences. Currently, I’m focused on building accessible, human-centered products at Innovate Inc.",
  cta: {
    text: "Explore My Projects",
    link: "/projects"
  },
  // A centered container with responsive vertical and horizontal padding for the hero section
  className: "container mx-auto px-6 py-24 sm:py-32 text-center"
};

const footerProps: any = {};

// --- Animation Variants ---

// A container variant to orchestrate the staggering of its children.
const pageContainerVariants: Variants = {
  hidden: { opacity: 1 }, // Start with opacity 1 to prevent flash of unstyled content
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25, // Delay between each child animation
    },
  },
};

// Variant for the Navbar to slide in from the top.
const navbarVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

// Variant for the main content to fade and slide up slightly.
const mainContentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Variant for the footer to fade and slide up from the bottom.
const footerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
    },
  },
};

/**
 * Homepage component that structures the main page of the portfolio.
 * It includes a navigation bar, a home section (hero), and a footer.
 */
const Homepage = (): JSX.Element => {
  return (
    // Root motion container to orchestrate the animations of its children.
    <motion.div
      className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      variants={pageContainerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      {/* Use motion.header for semantic HTML and to apply navbar animations */}
      <motion.header variants={navbarVariants as Variants}>
        <Navbar {...navbarProps} />
      </motion.header>

      {/* The main content area grows to fill the space and has its own animation */}
      <motion.main
        className="flex-grow"
        variants={mainContentVariants as Variants}
      >
        <HomeSection {...homeSectionProps} />
      </motion.main>

      {/* Use motion.footer for semantic HTML and to apply footer animations */}
      <motion.footer variants={footerVariants as Variants}>
        <Footer {...footerProps} />
      </motion.footer>
    </motion.div>
  );
};

export default Homepage;