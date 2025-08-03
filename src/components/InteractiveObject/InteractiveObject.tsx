import React, { useState, useCallback, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// #region TYPE DEFINITIONS

/**
 * Defines the type of action to be performed on click.
 * 'preview': Opens a modal-like holographic preview.
 * 'link': Navigates to an external URL.
 */
type ActionType = 'preview' | 'link';

/**
 * Represents the data for the content displayed in the HolographicPreview.
 */
type PreviewData = {
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
};

/**
 * Represents the core data structure for the InteractiveObject.
 * This data is defined internally and not passed as props, ensuring the component is self-contained.
 */
type InteractiveObjectData = {
  readonly id: string;
  readonly type: ActionType;
  readonly ariaLabel: string;
  readonly model: {
    readonly imageUrl: string;
    readonly altText: string;
  };
  readonly action: {
    // URL for 'link', PreviewData for 'preview'
    readonly data: PreviewData | string;
  };
};

/**
 * Props for the internal HolographicPreview component.
 * @internal
 */
interface HolographicPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: PreviewData;
}

// #endregion

// #region CONSTANT DATA

/**
 * The internal data defining the object's properties and behavior.
 * This constant ensures the component is self-sufficient and does not require props for its core content.
 */
const INTERACTIVE_OBJECT_DATA: InteractiveObjectData = {
  id: 'project-bookshelf-01',
  type: 'preview',
  ariaLabel: 'Click to view project details',
  model: {
    imageUrl: 'https://picsum.photos/seed/bookshelf/400/600',
    altText: 'A futuristic bookshelf representing projects',
  },
  action: {
    data: {
      title: 'Project Archives',
      subtitle: 'A Showcase of Past Work',
      content:
        'This collection represents a decade of dedication to crafting high-quality, scalable, and user-centric web applications. Each project, from complex enterprise systems to elegant user interfaces, was built with a passion for clean code and robust architecture. Explore the archives to see the evolution of technology and technique.',
      imageUrl: 'https://picsum.photos/seed/tech/600/400',
    },
  },
};

// #endregion

// #region ANIMATION VARIANTS

const cardVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    rotateY: 45,
    y: 50,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateY: 25,
    rotateX: 10,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      delay: 0.2,
    },
  },
  hover: {
    rotateY: 0,
    rotateX: 0,
    scale: 1.1,
    boxShadow: '0 20px 40px rgba(0, 191, 255, 0.4)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  tap: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
};

const cardOverlayVariants: Variants = {
  hover: { backgroundColor: 'rgba(25, 28, 38, 0.1)' },
};

const hintTextVariants: Variants = {
  hover: {
    opacity: 1,
    y: -10,
    transition: { delay: 0.2 },
  },
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 200 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: { type: 'spring', damping: 20, stiffness: 200 },
  },
};

// #endregion


// #region HELPER COMPONENTS

/**
 * A fallback component to display when an error occurs within the InteractiveObject.
 * @param {object} props - The props object.
 * @param {Error} props.error - The error that was thrown.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const ErrorFallback = ({ error }: { error: Error }): JSX.Element => (
  <div
    role="alert"
    className="w-full max-w-[400px] p-8 border border-red-500 rounded-lg bg-red-500/10 text-red-200"
  >
    <h2 className="mb-4 text-xl font-bold text-red-400">Component Error</h2>
    <p>Something went wrong rendering this interactive element.</p>
    <pre className="p-4 mt-4 text-sm bg-black/20 rounded whitespace-pre-wrap break-all text-red-200">
      {error.message}
    </pre>
  </div>
);

/**
 * A modal-like preview component with a holographic theme.
 * It is rendered internally by InteractiveObject when its type is 'preview'.
 * @param {HolographicPreviewProps} props The props for the component.
 * @returns {JSX.Element | null} The rendered holographic preview.
 * @internal
 */
const HolographicPreview = ({ isOpen, onClose, data }: HolographicPreviewProps): JSX.Element => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          className=" inset-0 z-[100] bg-black/70 backdrop-blur-lg"
          variants={backdropVariants as Variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        />
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-5">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-title"
            className="relative w-full max-w-[700px] max-h-[90vh] overflow-y-auto p-8 border border-cyan-300/40 rounded-2xl bg-sky-950/85 text-slate-100 shadow-[0_0_40px_rgba(0,191,255,0.5)] backdrop-blur-[20px]"
            variants={modalVariants as Variants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-xl text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close preview"
            >
              &times;
            </button>
            <img
              src={data.imageUrl}
              alt={data.title}
              className="mb-6 h-auto w-full max-h-[300px] rounded-lg object-cover"
            />
            <h2 id="preview-title" className="mb-2 text-3xl text-cyan-400">{data.title}</h2>
            <h3 className="mb-6 font-normal text-lg text-slate-400">{data.subtitle}</h3>
            <p className="text-base leading-relaxed text-slate-300">{data.content}</p>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);

// #endregion

// #region MAIN COMPONENT

/**
 * A generic, clickable 3D-like object for a scene.
 * This component is self-contained, defining its own data and behavior internally.
 * On click, it can either open an external link or display a holographic preview
 * with more information, based on its internal configuration.
 */
const InteractiveObject = (): JSX.Element => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOpenPreview = useCallback(() => setIsPreviewOpen(true), []);
  const handleClosePreview = useCallback(() => setIsPreviewOpen(false), []);

  /**
   * Handles the click event on the object, triggering the configured action.
   */
  const handleClick = useCallback(() => {
    const { type, action } = INTERACTIVE_OBJECT_DATA;
    if (type === 'preview') {
      handleOpenPreview();
    } else if (type === 'link' && typeof action.data === 'string') {
      window.open(action.data, '_blank', 'noopener,noreferrer');
    }
  }, [handleOpenPreview]);

  return (
    <>
      <div className="flex h-full min-h-[400px] items-center justify-center overflow-hidden [perspective:1200px]">
        <motion.div
          className="h-[350px] w-[250px] cursor-pointer [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent]"
          // Subtle floating animation
          animate={{ y: [-5, 5, -5] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={INTERACTIVE_OBJECT_DATA.ariaLabel}
            onClick={handleClick}
            onKeyPress={(e) => e.key === 'Enter' && handleClick()}
            className="relative h-full w-full rounded-2xl border border-white/20 bg-cover bg-center shadow-xl [transform-style:preserve-3d]"
            style={{
              backgroundImage: `url(${INTERACTIVE_OBJECT_DATA.model.imageUrl})`,
            }}
            variants={cardVariants as Variants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
          >
            {/* Overlay to enhance hover effect and show hint */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-slate-900/40 transition-colors duration-300 ease-in-out"
              variants={cardOverlayVariants as Variants}
            >
              <motion.div
                className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-xl bg-black/50 py-2 px-4 text-center text-sm font-medium text-white opacity-0"
                variants={hintTextVariants as Variants}
              >
                Click to Explore
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {INTERACTIVE_OBJECT_DATA.type === 'preview' && (
        <HolographicPreview
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          data={INTERACTIVE_OBJECT_DATA.action.data as PreviewData}
        />
      )}
    </>
  );
};

// #endregion

/**
 * A wrapper component that provides an error boundary for the main InteractiveObject.
 * This ensures that any unexpected errors within the component do not crash the entire application.
 * This is the component that should be imported and used in the application.
 */
const InteractiveObjectWithBoundary = (): JSX.Element => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <InteractiveObject />
  </ErrorBoundary>
);

export default InteractiveObjectWithBoundary;