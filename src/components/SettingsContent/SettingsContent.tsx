import React, { useState, JSX, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {'toggle' | 'dropdown'} SettingType
 * Represents the type of interactive control for a setting.
 */
type SettingType = 'toggle' | 'dropdown';

/**
 * @typedef {Object} SettingOption
 * Defines the structure for a single setting item.
 * @property {string} id - A unique identifier for the setting.
 * @property {string} label - The display name of the setting.
 * @property {string} description - A short description of what the setting does.
 * @property {JSX.Element} icon - An SVG icon representing the setting.
 * @property {SettingType} type - The type of control for this setting.
 * @property {string[]} [options] - A list of string options, required if type is 'dropdown'.
 */
type SettingOption = {
  id: string;
  label: string;
  description: string;
  icon: JSX.Element;
  type: SettingType;
  options?: string[];
};

/**
 * @typedef {Object.<string, boolean | string>} SettingsState
 * Represents the state of all settings, keyed by their ID.
 * The value can be a boolean for toggles or a string for dropdowns.
 */
type SettingsState = {
  [key: string]: boolean | string;
};


// --- CONSTANT DATA & ICONS ---

/**
 * SVG icon for Notifications.
 * @returns {JSX.Element}
 */
const BellIcon = (): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m8 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

/**
 * SVG icon for Theme.
 * @returns {JSX.Element}
 */
const ThemeIcon = (): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

/**
 * SVG icon for Language.
 * @returns {JSX.Element}
 */
const LanguageIcon = (): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" />
  </svg>
);

/**
 * Constant data for the settings options.
 * This component is self-contained and does not require props for its data.
 * @const {SettingOption[]}
 */
const SETTINGS_DATA: readonly SettingOption[] = [
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Enable or disable all app notifications.',
    icon: <BellIcon />,
    type: 'toggle',
  },
  {
    id: 'theme',
    label: 'Theme',
    description: 'Choose your preferred interface theme.',
    icon: <ThemeIcon />,
    type: 'dropdown',
    options: ['Light', 'Dark', 'System'],
  },
  {
    id: 'language',
    label: 'Language',
    description: 'Select the display language for the app.',
    icon: <LanguageIcon />,
    type: 'dropdown',
    options: ['English', 'Español', 'Français'],
  },
];

/**
 * Initial state for the settings.
 * @const {SettingsState}
 */
const INITIAL_SETTINGS_STATE: SettingsState = {
  notifications: true,
  theme: 'System',
  language: 'English',
};


// --- ANIMATION VARIANTS ---

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.2,
      ease: "easeOut"
    }
  }
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  hover: { scale: 1.02, backgroundColor: "rgba(109, 40, 217, 0.05)", transition: { duration: 0.2 } }
};

const iconVariants: Variants = {
  hover: {
    scale: 1.15,
    rotate: -5,
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  }
};

// --- HELPER COMPONENTS ---

/**
 * A reusable, animated toggle switch component.
 * @param {object} props - The component props.
 * @param {boolean} props.isOn - Whether the toggle is on.
 * @param {() => void} props.onToggle - The function to call when toggled.
 * @param {string} props.ariaLabel - The accessible label for the switch.
 * @returns {JSX.Element} The rendered toggle switch.
 */
const ToggleSwitch = ({ isOn, onToggle, ariaLabel }: { isOn: boolean; onToggle: () => void; ariaLabel: string }): JSX.Element => {
  return (
    <motion.div
      onClick={onToggle}
      className={`flex h-7 w-12 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${isOn ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
      role="switch"
      aria-checked={isOn}
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && onToggle()}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="h-5 w-5 rounded-full bg-white shadow-md"
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        style={{
          marginLeft: isOn ? 'auto' : '0',
        }}
      />
    </motion.div>
  );
};


// --- MAIN COMPONENT ---

/**
 * `SettingsContent` is a self-contained component for displaying and interacting
 * with a list of application settings. It manages its own state and uses
 * constant data, requiring no props from parent components. The interactions
 * are for visual demonstration purposes only.
 *
 * @component
 * @returns {JSX.Element} The rendered settings content section.
 */
const SettingsContent = (): JSX.Element => {
  const [settingsState, setSettingsState] = useState<SettingsState>(INITIAL_SETTINGS_STATE);

  /**
   * Handles state changes for any setting.
   * @param {string} id - The ID of the setting to update.
   * @param {string | boolean} value - The new value for the setting.
   */
  const handleSettingChange = useCallback((id: string, value: string | boolean) => {
    setSettingsState(prevState => ({
      ...prevState,
      [id]: value,
    }));
  }, []);

  /**
   * Renders the appropriate interactive control based on the setting type.
   * @param {SettingOption} setting - The setting object.
   * @returns {JSX.Element} The rendered control (toggle or dropdown).
   */
  const renderControl = (setting: SettingOption): JSX.Element => {
    switch (setting.type) {
      case 'toggle':
        return (
          <ToggleSwitch
            isOn={Boolean(settingsState[setting.id])}
            onToggle={() => handleSettingChange(setting.id, !settingsState[setting.id])}
            ariaLabel={`Toggle ${setting.label}`}
          />
        );
      case 'dropdown':
        return (
          <motion.select
            value={String(settingsState[setting.id])}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            aria-label={`Select ${setting.label}`}
            className="rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </motion.select>
        );
      default:
        // This case should not be reached with proper data, but provides a fallback.
        return <div />;
    }
  };

  return (
    <motion.div 
      className="mx-auto max-w-2xl rounded-xl bg-white p-4 shadow-lg ring-1 ring-black/5 dark:bg-gray-800 sm:p-6 lg:p-8"
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb-6"
        variants={headerVariants as Variants}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Application Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your application preferences and settings.
        </p>
      </motion.div>

      <motion.div 
        className="space-y-4"
        variants={listVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {SETTINGS_DATA.map((setting) => (
            <motion.div
              key={setting.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              variants={itemVariants as Variants}
              whileHover="hover"
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  variants={iconVariants as Variants}
                >
                  {setting.icon}
                </motion.div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {setting.label}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {setting.description}
                  </p>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                {renderControl(setting)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default SettingsContent;