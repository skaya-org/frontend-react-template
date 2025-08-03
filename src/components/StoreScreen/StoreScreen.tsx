import React, { JSX, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';
import StoreItem from '../StoreItem/StoreItem';

// As per the prompt, StoreItem is an existing component. For type-safety within
// StoreScreen, we define the props we expect StoreItem to accept.
// This is a local definition and does not alter the actual StoreItem component.
/**
 * @interface StoreItemProps
 * @description Defines the properties expected by the StoreItem component.
 * @property {string} id - A unique identifier for the item.
 * @property {string} name - The name of the item.
 * @property {string} description - A brief description of the item.
 * @property {string} price - The price of the item, formatted as a string (e.g., "$9.99").
 * @property {string} imageUrl - The URL for the item's image.
 */
interface StoreItemProps {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

/**
 * @interface StoreSection
 * @description Represents a section within the store, containing a title and a list of items.
 * @property {string} id - A unique identifier for the section.
 * @property {string} title - The display title for the store section.
 * @property {StoreItemProps[]} items - An array of items available in this section.
 */
interface StoreSection {
  id: string;
  title: string;
  items: StoreItemProps[];
}

/**
 * @const STORE_DATA
 * @description Hardcoded constant data for the store's sections and items.
 * This ensures the component is self-contained and does not require props.
 */
const STORE_DATA: StoreSection[] = [
  {
    id: 'cosmetic_upgrades',
    title: 'Cosmetic Upgrades',
    items: [
      {
        id: 'cu001',
        name: 'Celestial Armor',
        description: 'Glimmers with the light of a thousand stars.',
        price: '$14.99',
        imageUrl: 'https://picsum.photos/200/300.webp?random=1',
      },
      {
        id: 'cu002',
        name: 'Volcanic Weapon Skin',
        description: 'Forged in the heart of a volcano. Handle with care.',
        price: '$9.99',
        imageUrl: 'https://picsum.photos/200/300.webp?random=2',
      },
      {
        id: 'cu003',
        name: 'Holographic Cape',
        description: 'A stylish, high-tech cape that ripples with light.',
        price: '$7.99',
        imageUrl: 'https://picsum.photos/200/300.webp?random=3',
      },
    ],
  },
  {
    id: 'power_packs',
    title: 'Power Packs',
    items: [
      {
        id: 'pp001',
        name: 'Starter Resource Pack',
        description: 'A bundle of essential resources to kickstart your journey.',
        price: '$4.99',
        imageUrl: 'https://picsum.photos/200/300.webp?random=4',
      },
      {
        id: 'pp002',
        name: 'Mega Energy Boost',
        description: 'Instantly refills your energy and doubles capacity for 24 hours.',
        price: '$19.99',
        imageUrl: 'https://picsum.photos/200/300.webp?random=5',
      },
      {
        id: 'pp003',
        name: 'Time-Saver Pack',
        description: 'Skip 12 hours of waiting time on any active upgrade.',
        price: '$2.99',
        imageUrl: 'https://picsum.photos/200/300.webp?random=6',
      },
    ],
  },
];

/**
 * @constant containerVariants
 * @description Animation variants for the main container to stagger children's animations.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * @constant itemVariants
 * @description Animation variants for individual items for a subtle fade-in and slide-up effect.
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

/**
 * Renders a fallback UI when a rendering error occurs within the component.
 * @param {FallbackProps} props - Props provided by React Error Boundary.
 * @param {Error} props.error - The error that was caught.
 * @param {() => void} props.resetErrorBoundary - A function to reset the component's state.
 * @returns {JSX.Element} A simple error message UI.
 */
const StoreErrorFallback = ({ error, resetErrorBoundary }: FallbackProps): JSX.Element => (
  <div
    role="alert"
    className="flex flex-col items-center justify-center rounded-lg border border-red-700 bg-red-950 p-8 text-center"
  >
    <h2 className="mb-2 text-xl font-bold text-red-300">Oops, something went wrong.</h2>
    <p className="mb-4 text-gray-200">The store couldn't be loaded. Please try again.</p>
    <pre className="mb-4 max-w-full overflow-x-auto rounded bg-gray-900 p-2 text-xs text-gray-400">
      {error.message}
    </pre>
    <button
      onClick={resetErrorBoundary}
      className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-500 bg-transparent px-4 py-2 text-base text-gray-100 transition-colors duration-200 hover:border-red-600 hover:bg-red-800"
    >
      Try Again
    </button>
  </div>
);

/**
 * The StoreScreen component serves as the main in-app shop.
 * It displays various items for purchase, organized into static sections.
 * This component is self-contained, fetching its data from a local constant,
 * and manages its own navigation state.
 *
 * @returns {JSX.Element} The rendered in-app store screen.
 */
const StoreScreen = (): JSX.Element => {
  const navigate = useNavigate();

  /**
   * Navigates back to the previous screen in the history stack.
   */
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <motion.div
      className="flex h-screen flex-col bg-gray-900 font-sans text-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants as Variants}
    >
      <motion.header
        className="flex flex-shrink-0 items-center justify-between border-b border-gray-700 bg-gray-800 px-6 py-4"
        variants={containerVariants as Variants}
      >
        <motion.button
          onClick={handleGoBack}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-500 bg-transparent px-4 py-2 text-base text-gray-100 transition-colors duration-200 hover:border-gray-400 hover:bg-gray-700"
          aria-label="Go back"
          variants={itemVariants as Variants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span aria-hidden="true">←</span> Back
        </motion.button>
        <motion.h1 className="m-0 text-2xl font-semibold" variants={itemVariants as Variants}>
          Store
        </motion.h1>
        <div className="w-[88px]" /> {/* Spacer to balance the header, approximates button width */}
      </motion.header>

      <main className="flex-1 overflow-y-auto p-6">
        <ErrorBoundary FallbackComponent={StoreErrorFallback}>
          <motion.div
            className="flex flex-col gap-10"
            variants={containerVariants as Variants}
          >
            {STORE_DATA.map((section) => (
              <motion.section
                key={section.id}
                className="rounded-xl bg-gray-800 p-6"
                variants={itemVariants as Variants}
              >
                <h2 className="mb-6 border-b border-gray-700 pb-3 text-xl font-bold">
                  {section.title}
                </h2>
                <motion.div
                  className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]"
                  variants={containerVariants as Variants}
                >
                  {section.items.map((item) => (
                    <motion.div key={item.id} variants={itemVariants as Variants}>
                      <StoreItem
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            ))}
          </motion.div>
        </ErrorBoundary>
      </main>
    </motion.div>
  );
};

export default StoreScreen;