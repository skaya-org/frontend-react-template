import React, { JSX, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';

// --- Constants and Data ---

/**
 * @constant ASSET_DATA
 * @description Hardcoded data for the blockchain asset.
 * This object contains all the necessary information to display the asset card,
 * ensuring the component is self-contained and requires no external props.
 * This approach guarantees data consistency and simplifies component usage.
 */
const ASSET_DATA = {
  imageUrl: 'https://picsum.photos/300/300.webp?random=1',
  name: 'Galactic Etheroid #42',
  description:
    'A unique, algorithmically generated digital art piece from the far reaches of the metaverse. Belongs to the Crypto-Nebula collection.',
};

// --- Animation Variants ---

/**
 * @constant cardVariants
 * @description Animation variants for the main card container.
 * - `hidden`: Initial state before the card enters the viewport (invisible and slightly down).
 * - `visible`: Animated state when the card is visible, orchestrating a staggered animation for its children.
 * - `hover`: State for when the mouse is hovering over the card, lifting it and adding a deeper shadow.
 */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
      staggerChildren: 0.15, // Animate children with a 0.15s delay between them
    },
  },
  hover: {
    y: -5,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

/**
 * @constant itemVariants
 * @description Generic animation variants for child elements within the card.
 * Used for the staggered fade-in and slide-up effect inherited from the parent.
 */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// --- Component ---

/**
 * AssetCard Component
 *
 * @description
 * A self-contained card component for displaying a single blockchain-based asset (NFT).
 * It presents a static image, name, and description of the asset. All data is
 * hardcoded within the component, so it requires no props, making it a "drop-in"
 * UI element. The component includes interactive hover effects and a 'View Details'
 * button with a placeholder action. Its design is robust, and it can be safely
 * wrapped in an ErrorBoundary by its parent.
 *
 * @returns {JSX.Element} The rendered AssetCard component.
 */
const AssetCard = (): JSX.Element => {
  /**
   * Handles the click event for the 'View Details' button.
   * In a real-world application, this would likely trigger a navigation event
   * or open a modal. Here, it logs a message to the console for demonstration.
   * Encapsulated within useCallback for performance consistency, although not
   * strictly necessary here due to the static nature of dependencies.
   */
  const handleViewDetailsClick = useCallback((): void => {
    // In a production app, this could use react-router-dom's useNavigate hook
    // or call a function to open a details modal.
    console.log(`'View Details' button clicked for asset: "${ASSET_DATA.name}"`);
    alert(`Displaying details for: ${ASSET_DATA.name}`);
  }, []);

  return (
    <motion.div
      className="flex h-full max-w-xs flex-col gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 font-sans shadow-lg"
      variants={cardVariants as Variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <motion.div
        className="relative aspect-square w-full overflow-hidden rounded-xl"
        variants={itemVariants as Variants}
      >
        <motion.img
          src={ASSET_DATA.imageUrl}
          alt={ASSET_DATA.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: 'circOut' }}
        />
      </motion.div>

      <motion.div
        className="flex flex-grow flex-col gap-3 px-2"
        variants={itemVariants as Variants}
      >
        <h3 className="text-xl font-bold leading-tight text-gray-900">
          {ASSET_DATA.name}
        </h3>
        <p className="text-sm leading-relaxed text-gray-600">
          {ASSET_DATA.description}
        </p>
      </motion.div>

      <motion.div
        className="mt-auto px-2 pb-2"
        variants={itemVariants as Variants}
      >
        <motion.button
          className="w-full cursor-pointer rounded-lg bg-blue-600 px-6 py-3 text-center text-base font-medium text-white outline-none transition-colors duration-200 ease-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          onClick={handleViewDetailsClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          aria-label={`View details for ${ASSET_DATA.name}`}
        >
          View Details
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default AssetCard;