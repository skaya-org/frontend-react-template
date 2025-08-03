import React, { JSX, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
// Import 'Variants' from 'framer-motion' for type-safe animation definitions
import { motion, Variants } from 'framer-motion';

// The NFTGallery component is expected to be self-contained and is responsible for
// fetching and displaying its own data. It is designed to read URL search
// parameters ('q' and 'category') to apply filtering, thus decoupling it from
// the Marketplace controls and adhering to the "no props" requirement.
import NFTGallery from '../NFTGallery/NFTGallery';

// --- CONSTANTS ---

/**
 * Defines the available categories for filtering marketplace items.
 * The 'All' category is used to clear any active category filter.
 * @constant
 * @type {Readonly<string[]>}
 */
const FILTER_CATEGORIES: Readonly<string[]> = ['All', 'Avatars', 'Wearables', 'Vehicles'];

// --- ANIMATION VARIANTS ---

/**
 * Variants for the main page container.
 * This orchestrates the staggering of child animations for a smooth, sequential entry effect.
 */
const pageContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2, // Animate children with a 0.2s delay between them
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

/**
 * Generic variants for child elements within the page.
 * Creates a subtle "fade in and slide up" effect. Reusable for multiple sections.
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// --- ERROR FALLBACK ---

/**
 * A simple fallback component rendered by the ErrorBoundary when a child
 * component throws an error. It provides basic error information and guidance.
 * @param {object} props - The props object provided by React Error Boundary.
 * @param {Error} props.error - The error that was caught.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const MarketplaceErrorFallback = ({ error }: { error: Error }): JSX.Element => (
  <div role="alert" className="p-8 bg-red-50 border border-red-300 rounded-lg text-center text-red-700">
    <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
    <p>We encountered an issue displaying the marketplace items.</p>
    <pre className="mt-4 mb-6 p-4 bg-red-100 text-red-900 rounded font-mono whitespace-pre-wrap break-all text-left">
      {error.message}
    </pre>
    <button
      onClick={() => window.location.reload()}
      className="py-2 px-5 rounded-lg bg-red-700 text-white font-semibold cursor-pointer hover:bg-red-800 transition-colors"
    >
      Try refreshing the page
    </button>
  </div>
);


// --- MAIN COMPONENT ---

/**
 * The Marketplace component serves as the central hub for the digital economy.
 * It features top-level controls for searching and filtering assets by category.
 * The actual grid of assets is rendered by the `NFTGallery` component.
 *
 * This component's state (search term, active category) is managed via URL
 * search parameters (`?q=...&category=...`). This modern approach allows for
 * shareable, bookmarkable filtered views and effectively decouples the
 * `Marketplace` controls from the `NFTGallery` display, satisfying the strict
 * requirement that `NFTGallery` accepts no props.
 *
 * @component
 * @returns {JSX.Element} The rendered Marketplace component.
 */
const Marketplace = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive state directly from URL search parameters to maintain a single source of truth.
  const searchTerm = searchParams.get('q') || '';
  const activeCategory = searchParams.get('category') || 'All';

  /**
   * Handles changes to the search input field. It updates the 'q' search
   * parameter in the URL.
   * Note: For a production environment, this function should be debounced
   * to prevent excessive URL updates and re-renders on every keystroke.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const newSearchTerm = event.target.value;
    const newParams = new URLSearchParams(searchParams);

    if (newSearchTerm) {
      newParams.set('q', newSearchTerm);
    } else {
      newParams.delete('q');
    }

    // `replace: true` is used to avoid polluting browser history with every keystroke.
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  /**
   * Handles clicks on the category filter buttons. It updates the 'category'
   * search parameter in the URL. Selecting 'All' removes the parameter.
   * @param {string} category - The category string to filter by.
   */
  const handleCategoryChange = useCallback((category: string): void => {
    const newParams = new URLSearchParams(searchParams);

    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }

    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <motion.div
      variants={pageContainerVariants as Variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-7xl mx-auto py-8 px-6 text-gray-800 min-h-screen"
    >
      <motion.header
        variants={itemVariants as Variants}
        className="text-center mb-10"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 tracking-tight">Marketplace</h1>
        <p className="text-lg text-gray-600">Discover, buy, and sell unique digital assets.</p>
      </motion.header>

      <motion.div
        variants={itemVariants as Variants}
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12"
      >
        <div className="w-full md:flex-grow md:max-w-md">
          <input
            type="search"
            placeholder="Search for items, collections, and accounts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full py-3 px-4 text-base rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            aria-label="Search for marketplace items"
          />
        </div>
        
        <div className="flex justify-center flex-wrap gap-3" role="group" aria-label="Filter by category">
          {FILTER_CATEGORIES.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`py-2 px-5 text-sm font-semibold rounded-full border border-transparent cursor-pointer transition-colors duration-200 
                ${activeCategory === category 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={activeCategory === category}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      <motion.main
        variants={itemVariants as Variants}
        className="mt-8"
      >
        <ErrorBoundary FallbackComponent={MarketplaceErrorFallback}>
          <NFTGallery />
        </ErrorBoundary>
      </motion.main>
    </motion.div>
  );
};

export default Marketplace;