import React, { useState, useEffect, Suspense, JSX } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';
import HeroSection from '../HeroSection/HeroSection';
import HowItWorksSection from '../HowItWorksSection/HowItWorksSection';
import ServicesSection from '../ServicesSection/ServicesSection';
import TestimonialsSection from '../TestimonialsSection/TestimonialsSection';
import Footer from '../Footer/Footer';

// Import new sections


//==============================================================================
// INTERFACES
//==============================================================================

/**
 * @interface TypewriterProps
 * @description Props for the Typewriter component. In a real application, this
 * would be in its own file (e.g., `src/components/Typewriter/Typewriter.types.ts`).
 */
export interface TypewriterProps {
  /**
   * An array of strings to be displayed with a typewriter effect.
   * @type {string[]}
   */
  texts: string[];
  /**
   * The delay between typing each character, in milliseconds.
   * @default 50
   * @type {number | undefined}
   */
  typingDelay?: number;
  /**
   * The delay before erasing the text and starting the next one, in milliseconds.
   * @default 2000
   * @type {number | undefined}
   */
  nextTextDelay?: number;
}

/**
 * @interface TimelineItem
 * @description Represents a single event or item on the timeline. This would
 * be defined in the Timeline component's type definitions file.
 */
export interface TimelineItem {
  /**
   * A unique identifier for the timeline item.
   * @type {string | number}
   */
  id: string | number;
  /**
   * The date or time period of the event.
   * @type {string}
   */
  date: string;
  /**
   * The title of the timeline event.
   * @type {string}
   */
  title: string;
  /**
   * A detailed description of the timeline event.
   * @type {string}
   */
  description: string;
  /**
   * Optional icon to display for the timeline item.
   * @type {React.ReactNode | undefined}
   */
  icon?: React.ReactNode;
}

/**
 * @interface TimelineProps
 * @description Props for the Timeline component.
 */
export interface TimelineProps {
  /**
   * An array of timeline items to be displayed.
   * @type {TimelineItem[]}
   */
  items: TimelineItem[];
}

/**
 * @interface HomePageProps
 * @description Defines the props for the HomePage component.
 * This allows for easy configuration of the page's content from a higher-level component or data source.
 */
export interface HomePageProps {
  /**
   * An array of strings to be passed to the Typewriter component for the main heading.
   * @type {string[]}
   */
  typewriterStrings: string[];
  /**
   * An array of event objects to be passed to the Timeline component.
   * @type {TimelineItem[]}
   */
  timelineItems: TimelineItem[];
}


//==============================================================================
// MOCK CHILD COMPONENTS (for demonstration)
// In a real application, these would be in separate files and imported.
//==============================================================================

/**
 * A component that displays text with a typewriter animation.
 * It cycles through an array of strings.
 * @param {TypewriterProps} props - The component props.
 * @returns {JSX.Element} The rendered Typewriter component.
 */
const Typewriter = ({ texts, typingDelay = 50, nextTextDelay = 2000 }: TypewriterProps): JSX.Element => {
    const [textIndex, setTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handleTyping = () => {
            const currentText = texts[textIndex];
            if (isDeleting) {
                if (displayedText.length > 0) {
                    setDisplayedText((prev) => prev.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setTextIndex((prev) => (prev + 1) % texts.length);
                }
            } else {
                if (displayedText.length < currentText.length) {
                    setDisplayedText((prev) => prev + currentText.charAt(displayedText.length));
                } else {
                    // Pause before deleting
                    setTimeout(() => setIsDeleting(true), nextTextDelay);
                }
            }
        };

        const timeoutId = setTimeout(handleTyping, isDeleting ? typingDelay / 2 : typingDelay);
        return () => clearTimeout(timeoutId);
    }, [displayedText, isDeleting, textIndex, texts, typingDelay, nextTextDelay]);

    return (
        <h1 className="flex min-h-[2.5em] items-center justify-center text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            {displayedText}
            <motion.span
                className="ml-2 h-[1.2em] border-l-4 border-purple-600"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
            />
        </h1>
    );
};


/**
 * @description Variants for the timeline container to orchestrate child animations.
 */
const timelineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

/**
 * @description Variants for each individual timeline item.
 */
const timelineItemVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * A component that displays a vertical timeline of events.
 * @param {TimelineProps} props - The component props.
 * @returns {JSX.Element} The rendered Timeline component.
 */
const Timeline = ({ items }: TimelineProps): JSX.Element => (
    <motion.div
        className="relative my-8"
        variants={timelineContainerVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
    >
        {/* The line itself is not animated to provide a stable anchor */}
        <div className="absolute left-5 top-6 bottom-0 w-1 rounded-full bg-gray-200" />
        {items.map((item) => (
            <motion.div
                key={item.id}
                className="relative mb-4 p-4 pl-[60px] text-left"
                variants={timelineItemVariants as Variants}
            >
                <div className="absolute left-2 top-6 z-10 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-gray-50 bg-purple-600 font-bold text-white">
                    {item.icon || '✓'}
                </div>
                <h3 className="m-0 text-xl text-gray-800">{item.title}</h3>
                <span className="mt-1 mb-2 block text-sm text-gray-500">{item.date}</span>
                <p className="m-0 leading-relaxed text-gray-600">{item.description}</p>
            </motion.div>
        ))}
    </motion.div>
);


//==============================================================================
// ERROR BOUNDARY FALLBACK
//==============================================================================

/**
 * A fallback component to display when an error occurs within the ErrorBoundary.
 * @param {object} props - The component props.
 * @param {Error} props.error - The error that was caught.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const ErrorFallback = ({ error }: { error: Error }): JSX.Element => (
  <div role="alert" className="my-8 rounded-lg border border-red-200 bg-red-50 p-4 px-8 text-red-700">
    <h2 className="mt-0 font-bold">Something went wrong</h2>
    <p>We encountered an unexpected error while rendering this part of the page.</p>
    <pre className="mt-2 whitespace-pre-wrap rounded-md bg-red-100 p-2 font-mono text-sm">{error.message}</pre>
  </div>
);

//==============================================================================
// ANIMATION VARIANTS
//==============================================================================

/**
 * @description Variants for the main page container to orchestrate section animations.
 */
const pageContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3, // Stagger children for a sequential reveal
        },
    },
};

/**
 * @description Variants for individual content sections to fade and slide in from below.
 */
const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};


//==============================================================================
// HOMEPAGE COMPONENT
//==============================================================================

/**
 * The main page component for the application's landing page.
 * It orchestrates the display of various sections for a modern laundry service website.
 * Each section animates into view sequentially for an engaging user experience.
 * It is wrapped in an ErrorBoundary to ensure robustness.
 *
 * @component
 * @returns {JSX.Element} The rendered HomePage component.
 */
const HomePage = (): JSX.Element => {
  return (
    <motion.main
      className="flex min-h-screen flex-col overflow-x-hidden bg-gray-50 font-sans text-gray-800 antialiased"
      variants={pageContainerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-gray-50 text-xl font-semibold text-gray-600">Loading Page...</div>}>
          
          <motion.div variants={sectionVariants as Variants}>
            <HeroSection />
          </motion.div>
          
          <motion.div variants={sectionVariants as Variants}>
            <HowItWorksSection />
          </motion.div>

          <motion.div variants={sectionVariants as Variants}>
            <ServicesSection />
          </motion.div>

          <motion.div variants={sectionVariants as Variants}>
            <TestimonialsSection />
          </motion.div>

          <motion.div variants={sectionVariants as Variants}>
            <Footer />
          </motion.div>
          
        </Suspense>
      </ErrorBoundary>
    </motion.main>
  );
};

export default HomePage;