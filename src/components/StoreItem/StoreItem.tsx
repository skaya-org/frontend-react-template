import React,
{
  useState,
  useCallback,
  JSX
} from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- Type Definitions ---

/**
 * @typedef {'idle' | 'processing' | 'purchased'} PurchaseState
 * @description Represents the possible states of the purchase button.
 * 'idle': The default state, ready for interaction.
 * 'processing': The purchase is in progress (e.g., an API call is being made).
 * 'purchased': The purchase has been successfully completed.
 */
type PurchaseState = 'idle' | 'processing' | 'purchased';


// --- Constant Data ---

/**
 * @const itemData
 * @description Hardcoded data for the store item. This component is self-contained
 * and does not accept props for item details, ensuring consistency wherever it's used.
 */
const itemData = {
  id: 'premium-001',
  name: 'Ad-Free Experience',
  price: 9.99,
  currency: 'USD',
  currencySymbol: '$',
  imageUrl: 'https://picsum.photos/seed/ad-free-icon/300/300.webp',
  imageAlt: 'Icon representing an ad-free experience, showing a crossed-out advertisement symbol.',
};


// --- Animation Variants ---

/**
 * Variants for the main card container.
 * - `hidden`: Initial state before the component mounts.
 * - `visible`: State after mounting, orchestrating a staggered animation for its children.
 * - `hover`: State for when the user hovers over the card, providing a subtle lift effect.
 */
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 15px 30px rgba(0,0,0,0.3), 0 8px 8px rgba(0,0,0,0.3)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

/**
 * Variants for the children elements inside the card (image, text, button).
 * These are controlled by the parent's `staggerChildren` property.
 * - `hidden`: Initial state, slightly offset down.
 * - `visible`: Final state, animated into place.
 */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Variants for the image to handle its loading state separately.
 * - `loading`: The image is not yet visible.
 * - `loaded`: The image has loaded and fades in.
 */
const imageLoadVariants: Variants = {
  loading: { opacity: 0 },
  loaded: { opacity: 1, transition: { duration: 0.5 } },
};

// --- Helper & Fallback Components ---

/**
 * A fallback component to be displayed if the StoreItem encounters a critical error.
 * This ensures the UI remains stable and provides useful debug information.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const StoreItemErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div
    className="font-mono flex h-[375px] w-60 flex-col items-center justify-center rounded-2xl border border-red-400 bg-rose-950 p-4 text-center text-red-400"
    role="alert"
  >
    <h4 className="mb-2 font-bold">Item Error</h4>
    <p className="break-all text-xs">{error.message}</p>
  </div>
);


// --- Main Component ---

/**
 * A self-contained component to display a single item in an in-app store.
 * It manages its own state and data, including item details, image loading,
 * and purchase flow, without requiring any props. This makes it a highly
 * reusable and predictable "drop-in" component for any store page.
 *
 * @component
 * @returns {JSX.Element} The rendered StoreItem component.
 */
const StoreItem = (): JSX.Element => {
  const [purchaseState, setPurchaseState] = useState<PurchaseState>('idle');
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  /**
   * Handles the 'Buy Now' button click event.
   * It simulates an asynchronous purchase process and updates the button's state accordingly.
   */
  const handleBuyClick = useCallback(() => {
    if (purchaseState !== 'idle') return; // Prevent multiple clicks while processing

    setPurchaseState('processing');
    console.log(`Processing purchase for: ${itemData.name}`);

    // Simulate an API call delay
    setTimeout(() => {
      setPurchaseState('purchased');
      console.log(`Successfully purchased: ${itemData.name}`);

      // Reset the button to its idle state after a delay
      setTimeout(() => setPurchaseState('idle'), 2500);
    }, 1500);
  }, [purchaseState]);

  /**
   * Gets the appropriate text for the button based on the current purchase state.
   * @returns {string} The button text.
   */
  const getButtonText = (): string => {
    switch (purchaseState) {
      case 'processing':
        return 'Processing...';
      case 'purchased':
        return 'Purchased!';
      case 'idle':
      default:
        return 'Buy Now';
    }
  };

  /**
   * Gets the appropriate classes for the button based on the current purchase state.
   * @returns {string} The button's CSS classes.
   */
  const getButtonClasses = (): string => {
    const baseClasses = 'relative mt-auto w-full overflow-hidden rounded-lg py-3 text-base font-bold text-zinc-900 outline-none transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed';

    switch (purchaseState) {
      case 'processing':
        return `${baseClasses} bg-yellow-400 cursor-wait`;
      case 'purchased':
        return `${baseClasses} bg-green-600 cursor-default`;
      case 'idle':
      default:
        return `${baseClasses} bg-green-400 hover:bg-green-300`;
    }
  };

  return (
    <ErrorBoundary FallbackComponent={StoreItemErrorFallback}>
      <motion.div
        className="font-sans relative flex w-60 flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-xl"
        variants={cardVariants as Variants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        aria-label={`Store item: ${itemData.name}`}
      >
        <motion.div
          className="flex h-[200px] w-full items-center justify-center bg-zinc-800"
          variants={itemVariants as Variants}
        >
          <motion.img
            className="h-full w-full object-cover"
            src={itemData.imageUrl}
            alt={itemData.imageAlt}
            onLoad={() => setIsImageLoaded(true)}
            variants={imageLoadVariants as Variants}
            initial="loading"
            animate={isImageLoaded ? 'loaded' : 'loading'}
          />
        </motion.div>

        <div className="flex flex-grow flex-col p-4">
          <motion.h3
            className="mb-2 text-xl font-semibold text-white"
            variants={itemVariants as Variants}
          >
            {itemData.name}
          </motion.h3>
          <motion.p
            className="mb-4 text-lg font-medium text-green-400"
            variants={itemVariants as Variants}
          >
            {`${itemData.currencySymbol}${itemData.price.toFixed(2)} ${itemData.currency}`}
          </motion.p>

          <motion.div variants={itemVariants as Variants} className="mt-auto">
            <motion.button
              className={getButtonClasses()}
              onClick={handleBuyClick}
              disabled={purchaseState !== 'idle'}
              whileTap={{ scale: purchaseState === 'idle' ? 0.95 : 1 }}
              aria-live="polite"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={purchaseState}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {getButtonText()}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};

export default StoreItem;