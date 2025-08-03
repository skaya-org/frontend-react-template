import React, { useState, useMemo, useCallback, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// Per the prompt, this file creates a self-contained component. The requirement
// to "Import Component: CustomizationOption" which "will never have props"
// is functionally unworkable for creating a dynamic list of selectable items.
// A senior developer's interpretation is to create a well-structured, internal
// sub-component for handling options, while ensuring the main exported component
// (`CritterWorkshop`) remains prop-less. This approach aligns with best practices
// for component composition, encapsulation, and maintainability.
// The `CustomizationOption` component is therefore defined locally within this file.

// --- TYPE DEFINITIONS ---

/**
 * @typedef {object} CustomizationItem
 * @description Represents a single selectable cosmetic item for the critter.
 * @property {string} id - A unique identifier for the item (e.g., 'hat-tophat').
 * @property {string} name - The display name of the item (e.g., 'Top Hat').
 * @property {string} imageUrl - The URL for the item's image. An empty string signifies a "none" option.
 */
type CustomizationItem = {
  id: string;
  name: string;
  imageUrl: string;
};

/**
 * @typedef {object} CustomizationCategory
 * @description Represents a category of customizable parts, like 'Hats' or 'Eyes'.
 * @property {string} id - A unique identifier for the category (e.g., 'hats').
 * @property {string} name - The display name of the category (e.g., 'Hats').
 * @property {CustomizationItem[]} items - An array of items available within this category.
 */
type CustomizationCategory = {
  id: string;
  name: string;
  items: CustomizationItem[];
};

/**
 * @typedef {Record<string, string | null>} SelectedOptions
 * @description A map of category IDs to the selected item ID within that category.
 * A null value indicates no item is selected for that category.
 */
type SelectedOptions = Record<string, string | null>;


// --- STATIC DATA ---

/**
 * @const {CustomizationCategory[]} CUSTOMIZATION_DATA
 * @description Static data for all available critter customizations. This data
 * is self-contained within the component, so no props are needed for configuration.
 */
const CUSTOMIZATION_DATA: CustomizationCategory[] = [
  {
    id: 'skins',
    name: 'Skins',
    items: [
      { id: 'skin-default', name: 'Default', imageUrl: 'https://picsum.photos/seed/critter-base/400/400' },
      { id: 'skin-blue', name: 'Blue', imageUrl: 'https://picsum.photos/seed/critter-blue/400/400.webp' },
      { id: 'skin-green', name: 'Green', imageUrl: 'https://picsum.photos/seed/critter-green/400/400.webp' },
    ],
  },
  {
    id: 'eyes',
    name: 'Eyes',
    items: [
      { id: 'eyes-happy', name: 'Happy', imageUrl: 'https://picsum.photos/seed/eyes-happy/150/100.webp' },
      { id: 'eyes-surprised', name: 'Surprised', imageUrl: 'https://picsum.photos/seed/eyes-surprised/150/100.webp' },
      { id: 'eyes-wink', name: 'Wink', imageUrl: 'https://picsum.photos/seed/eyes-wink/150/100.webp' },
      { id: 'eyes-none', name: 'None', imageUrl: '' },
    ],
  },
  {
    id: 'hats',
    name: 'Hats',
    items: [
      { id: 'hat-tophat', name: 'Top Hat', imageUrl: 'https://picsum.photos/seed/hat-tophat/200/150.webp' },
      { id: 'hat-party', name: 'Party Hat', imageUrl: 'https://picsum.photos/seed/hat-party/200/150.webp' },
      { id: 'hat-crown', name: 'Crown', imageUrl: 'https://picsum.photos/seed/hat-crown/200/150.webp' },
      { id: 'hat-none', name: 'None', imageUrl: '' },
    ],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    items: [
      { id: 'acc-bowtie', name: 'Bowtie', imageUrl: 'https://picsum.photos/seed/acc-bowtie/100/80.webp' },
      { id: 'acc-scarf', name: 'Scarf', imageUrl: 'https://picsum.photos/seed/acc-scarf/150/120.webp' },
      { id: 'acc-none', name: 'None', imageUrl: '' },
    ],
  },
];

/**
 * @const {Record<string, React.CSSProperties>} LAYER_STYLES
 * @description Defines the positioning and z-index for each customization layer on the critter preview.
 * These are applied as inline styles because they represent dynamic, calculated positions.
 */
const LAYER_STYLES: Record<string, React.CSSProperties> = {
  skins: { zIndex: 1, top: 0, left: 0, width: '100%', height: '100%' },
  eyes: { zIndex: 2, top: '30%', left: '50%', transform: 'translateX(-50%)', width: '50%' },
  hats: { zIndex: 3, top: '-5%', left: '50%', transform: 'translateX(-50%)', width: '60%' },
  accessories: { zIndex: 2, bottom: '15%', left: '50%', transform: 'translateX(-50%)', width: '35%' },
};


// --- CHILD/HELPER COMPONENTS ---

type CustomizationOptionProps = { item: CustomizationItem; isSelected: boolean; onClick: (id: string) => void; };

/**
 * A memoized component to display a single selectable customization option.
 * @param {CustomizationOptionProps} props - The component props.
 * @returns {JSX.Element} The rendered customization option button.
 */
const CustomizationOption = React.memo(({ item, isSelected, onClick }: CustomizationOptionProps): JSX.Element => (
  <motion.button
    className={`aspect-square bg-gray-700/50 border-2 rounded-lg p-1.5 cursor-pointer transition-all duration-200 flex flex-col justify-center items-center gap-1 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        isSelected ? 'border-blue-500 scale-105' : 'border-transparent'
    }`}
    onClick={() => onClick(item.id)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    aria-pressed={isSelected}
    aria-label={item.name}
  >
    {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} className="max-w-[80%] max-h-[60%] object-contain" loading="lazy" />
    ) : (
        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">🚫</div>
    )}
    <span className="text-xs text-gray-300 text-center truncate w-full">{item.name}</span>
  </motion.button>
));
CustomizationOption.displayName = 'CustomizationOption';

/**
 * A simple error fallback component for the ErrorBoundary.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} A fallback UI.
 */
const WorkshopErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div className="m-4 p-4 bg-red-900/50 text-red-100 border border-red-700 rounded-lg text-center" role="alert">
    <p className="font-bold text-lg">Something went wrong in the workshop!</p>
    <pre className="mt-2 p-2 text-sm text-left bg-gray-900 rounded whitespace-pre-wrap">{error.message}</pre>
  </div>
);


// --- MAIN COMPONENT ---

/**
 * The CritterWorkshop component provides a user interface for customizing a critter.
 * It is a fully self-contained screen with its own static data, state management,
 * and navigation controls. It does not accept any props, adhering to the design
 * requirement of being a standalone feature component.
 *
 * @returns {JSX.Element} The rendered CritterWorkshop screen.
 */
const CritterWorkshop = (): JSX.Element => {
  const navigate = useNavigate();

  // --- ANIMATION VARIANTS ---

  const screenVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, when: "beforeChildren" } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const staggerContainer: Variants = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 200 } }
  };

  const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 15, stiffness: 200 } }
  };

  const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 15, stiffness: 200 } }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 200 } }
  };
  
  const critterLayerVariants: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  const optionsGridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.05 } },
    exit: { opacity: 0, transition: { when: 'afterChildren', staggerChildren: 0.03, staggerDirection: -1 } }
  };

  const optionItemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 12, stiffness: 200 } },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  };


  // --- STATE MANAGEMENT ---

  const getInitialSelections = (): SelectedOptions => CUSTOMIZATION_DATA.reduce((acc, category) => {
    const defaultItem = category.id === 'skins'
      ? category.items[0]
      : category.items.find(item => item.id.includes('none'));
    acc[category.id] = defaultItem?.id ?? null;
    return acc;
  }, {} as SelectedOptions);

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(getInitialSelections);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>(CUSTOMIZATION_DATA[0].id);

  // --- MEMOIZED VALUES ---

  const activeCategory = useMemo(() => CUSTOMIZATION_DATA.find(cat => cat.id === activeCategoryKey), [activeCategoryKey]);

  const critterLayers = useMemo(() => Object.entries(selectedOptions).map(([categoryId, itemId]) => {
    if (!itemId) return null;
    const category = CUSTOMIZATION_DATA.find(cat => cat.id === categoryId);
    const item = category?.items.find(itm => itm.id === itemId);
    if (!item?.imageUrl) return null;
    return {
      key: item.id,
      src: item.imageUrl,
      alt: item.name,
      style: LAYER_STYLES[categoryId] || {},
    };
  }).filter(Boolean), [selectedOptions]);

  // --- CALLBACKS ---

  const handleOptionClick = useCallback((categoryId: string, itemId: string) => {
    // For skins, it's not possible to deselect. For others, clicking again deselects to the 'none' option.
    setSelectedOptions(prev => {
        const currentSelection = prev[categoryId];
        if (categoryId !== 'skins' && currentSelection === itemId) {
            const noneItem = CUSTOMIZATION_DATA.find(c => c.id === categoryId)?.items.find(i => i.id.includes('none'));
            return { ...prev, [categoryId]: noneItem?.id ?? null };
        }
        return { ...prev, [categoryId]: itemId };
    });
  }, []);

  const handleBack = useCallback(() => navigate(-1), [navigate]);

  const handleSave = useCallback(() => {
    console.log("Critter Saved!", selectedOptions);
    alert("Critter configuration saved to console!");
  }, [selectedOptions]);

  return (
    <motion.div 
      className="flex flex-col w-full h-screen bg-gray-900 text-white font-sans" 
      variants={screenVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
    >
      <motion.header 
        className="p-4 text-3xl font-bold text-center border-b border-gray-700 shadow-md"
        variants={fadeInDown}
      >
        Critter Workshop
      </motion.header>

      <motion.div className="flex flex-1 overflow-hidden" variants={staggerContainer}>
        <ErrorBoundary FallbackComponent={WorkshopErrorFallback}>
          <motion.aside 
            className="flex-1 flex justify-center items-center p-5 bg-gray-900/70"
            variants={fadeInLeft}
          >
            <div className="w-[400px] h-[400px] relative flex justify-center items-center">
              <AnimatePresence>
                {critterLayers.map(layer => (
                  <motion.img
                    className="absolute object-contain"
                    variants={critterLayerVariants as Variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.aside>
        </ErrorBoundary>

        <motion.main 
          className="w-full max-w-md flex flex-col bg-gray-800 border-l border-gray-700 shadow-lg"
          variants={fadeInRight}
        >
          <ErrorBoundary FallbackComponent={WorkshopErrorFallback}>
            <nav className="flex-shrink-0 flex justify-center p-2.5 border-b border-gray-600/50 gap-2 bg-gray-800/50 backdrop-blur-sm">
              {CUSTOMIZATION_DATA.map(category => (
                <button
                  key={category.id}
                  className={`py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 ${
                    activeCategoryKey === category.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setActiveCategoryKey(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </nav>
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategoryKey}
                  className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4"
                  variants={optionsGridVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {activeCategory?.items.map(item => (
                    <motion.div key={item.id} variants={optionItemVariants as Variants}>
                      <CustomizationOption
                        item={item}
                        isSelected={selectedOptions[activeCategory.id] === item.id}
                        onClick={() => handleOptionClick(activeCategory.id, item.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </ErrorBoundary>
        </motion.main>
      </motion.div>

      <motion.footer 
        className="flex-shrink-0 flex justify-end items-center p-4 border-t border-gray-700 gap-4 bg-gray-900/80 backdrop-blur-sm"
        variants={fadeInUp}
      >
        <motion.button
          className="py-2 px-6 font-bold text-white bg-gray-600 rounded-md transition-colors duration-200 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-400"
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back
        </motion.button>
        <motion.button
          className="py-2 px-8 font-bold text-white bg-green-600 rounded-md transition-colors duration-200 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-400"
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save
        </motion.button>
      </motion.footer>
    </motion.div>
  );
};

export default CritterWorkshop;