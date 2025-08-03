import React, { useState, useEffect, useCallback, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * @interface CTAButton
 * @description Defines the properties for a Call to Action button within the HeroSection.
 */
export interface CTAButton {
  /** The text content displayed on the button. */
  text: string;
  /** The URL the button navigates to. Uses React Router's Link component. */
  link: string;
  /**
   * The visual style of the button.
   * 'primary': A filled, prominent button.
   * 'secondary': An outlined, less prominent button.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
  /** Optional icon element to display to the left of the button text. */
  icon?: React.ReactNode;
}

/**
 * @interface HeroSectionProps
 * @description Defines the props for the HeroSection component.
 */
export interface HeroSectionProps {
  /** The main static part of the title, appearing before the typewriter text. */
  title: string | React.ReactNode;
  /**
   * An array of strings to be displayed with a typewriter effect.
   * The component will cycle through these strings.
   * @default ['Creative.', 'Powerful.', 'Modern.']
   */
  typewriterTexts?: string[];
  /**
   * The subtitle or descriptive text displayed below the main title.
   * @default 'Experience the next generation of web components, built for performance and style.'
   */
  subtitle?: string;
  /**
   * An array of call-to-action button objects.
   * @see CTAButton
   * @default [{ text: 'Get Started', link: '/signup', variant: 'primary' }, { text: 'Learn More', link: '/about', variant: 'secondary' }]
   */
  ctaButtons?: CTAButton[];
  /**
   * An optional URL for a background image.
   * A dark overlay is applied to ensure text readability.
   */
  backgroundImageUrl?: string;
  /** Additional CSS class names to apply to the root element for custom styling. */
  className?: string;
  /**
   * The delay in milliseconds between typing each character.
   * @default 120
   */
  typingDelay?: number;
  /**
   * The delay in milliseconds after a word is typed and before it starts deleting.
   * @default 2000
   */
  pauseDelay?: number;
  /**
   * The delay in milliseconds between deleting each character.
   * @default 50
   */
  deletingDelay?: number;
}

/**
 * A fallback component to render if the HeroSection encounters an unrecoverable error.
 * @param {object} props - The props object.
 * @param {Error} props.error - The error that was caught.
 * @returns {JSX.Element} The fallback UI.
 */
const HeroErrorFallback = ({ error }: { error: Error }): JSX.Element => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8 text-center text-red-500">
    <h2 className="mb-4 text-3xl font-bold">Oops! Something went wrong.</h2>
    <p className="mb-6 text-xl">The hero section could not be displayed.</p>
    <pre className="max-w-4/5 overflow-x-auto rounded-lg bg-gray-800 p-4 font-mono text-left">
      {error.message}
    </pre>
  </div>
);

/**
 * @component HeroSection
 * @description A modern, animated hero section for a homepage featuring a prominent title, a typewriter text effect, a subtitle, and call-to-action buttons. It's designed to be the main introductory visual element of a page.
 *
 * @param {HeroSectionProps} props - The props for configuring the HeroSection.
 * @returns {JSX.Element} A fully functional and styled HeroSection component.
 */
const HeroSection = (props: HeroSectionProps): JSX.Element => {
  // == DEFAULT PROPS & DESTRUCTURING ==
  const {
    title,
    typewriterTexts = ['Creative.', 'Powerful.', 'Modern.'],
    subtitle = 'Experience the next generation of web components, built for performance and style.',
    ctaButtons = [
      { text: 'Get Started', link: '/signup', variant: 'primary' },
      { text: 'Learn More', link: '/about', variant: 'secondary' },
    ],
    backgroundImageUrl,
    className = '',
    typingDelay = 120,
    pauseDelay = 2000,
    deletingDelay = 50,
  } = props;

  // == STATE MANAGEMENT ==
  const [loopIndex, setLoopIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [charTypedTime, setCharTypedTime] = useState(typingDelay);

  // == TYPEWRITER EFFECT LOGIC ==
  const handleTypingEffect = useCallback(() => {
    const validTexts = typewriterTexts.filter(t => typeof t === 'string' && t.length > 0);
    if (validTexts.length === 0) {
      setCurrentText('Welcome.');
      return;
    }

    const i = loopIndex % validTexts.length;
    const fullText = validTexts[i];

    if (isDeleting) {
      setCurrentText(prev => prev.substring(0, prev.length - 1));
      setCharTypedTime(deletingDelay);
    } else {
      setCurrentText(prev => fullText.substring(0, prev.length + 1));
      setCharTypedTime(typingDelay);
    }

    if (!isDeleting && currentText === fullText) {
      setIsDeleting(true);
      setCharTypedTime(pauseDelay);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setLoopIndex(prev => prev + 1);
      setCharTypedTime(typingDelay);
    }
  }, [
    loopIndex,
    isDeleting,
    currentText,
    typewriterTexts,
    typingDelay,
    pauseDelay,
    deletingDelay,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleTypingEffect();
    }, charTypedTime);
    return () => clearTimeout(timer);
  }, [currentText, handleTypingEffect, charTypedTime]);

  // == ANIMATION VARIANTS ==
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.6, 0.05, -0.01, 0.9] },
    },
  };
  
  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2, ease: 'easeInOut' },
    },
  };

  // == RENDER LOGIC ==
  const renderCtaButtons = () => {
    if (!ctaButtons || ctaButtons.length === 0) return null;

    return (
      <motion.div variants={itemVariants as Variants} className="flex flex-wrap justify-center gap-4">
        {ctaButtons.map((button, index) => {
          const isPrimary = button.variant === 'primary' || button.variant === undefined;
          
          const baseClasses = "inline-flex min-w-[150px] items-center justify-center rounded-full border-2 px-7 py-3 text-base font-semibold no-underline transition-all duration-300 ease-in-out";
          const primaryClasses = "border-blue-500 bg-blue-500 text-white hover:border-blue-600 hover:bg-blue-600";
          const secondaryClasses = "border-white bg-transparent text-white hover:bg-white hover:text-gray-900";

          return (
            <motion.div
              key={`${button.link}-${index}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={button.link} className={`${baseClasses} ${isPrimary ? primaryClasses : secondaryClasses}`}>
                {button.icon && <span className="mr-2 flex items-center">{button.icon}</span>}
                {button.text}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={HeroErrorFallback}>
      <motion.section
        style={{
          backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
        }}
        className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-900 bg-cover bg-center px-8 text-center text-white ${className}`}
        variants={containerVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
            className="absolute inset-0 z-10 bg-black/60" 
            variants={overlayVariants as Variants}
        />
        <div className="relative z-20 flex max-w-7xl flex-col items-center">
          <motion.h1 variants={itemVariants as Variants} className="mb-4 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight">
            {title}{' '}
            <span className="inline-block text-cyan-400">
              {currentText}
              <motion.span
                className="ml-1 font-bold text-cyan-400"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
              >
                |
              </motion.span>
            </span>
          </motion.h1>

          {subtitle && (
            <motion.p variants={itemVariants as Variants} className="mb-10 max-w-3xl text-[clamp(1rem,2vw,1.25rem)] leading-relaxed opacity-90">
              {subtitle}
            </motion.p>
          )}

          <AnimatePresence>{renderCtaButtons()}</AnimatePresence>
        </div>
      </motion.section>
    </ErrorBoundary>
  );
};

export default HeroSection;