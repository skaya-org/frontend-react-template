import React, { JSX, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { m, LazyMotion, domAnimation, Variants, motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * @typedef {object} AppIconData
 * @description Defines the static data structure for an application icon.
 * In a real-world scenario with multiple icons, this would likely be part
 * of an array of objects. Per the requirements, this component is self-contained
 * and does not receive props, so its data is defined as an internal constant.
 * @property {string} label - The text label displayed below the icon.
 * @property {string} iconSrc - The URL for the icon's image.
 * @property {string} routePath - The react-router-dom path to navigate to when the icon is clicked.
 */
const APP_ICON_DATA = {
  label: 'Photos',
  iconSrc: 'https://picsum.photos/seed/gallery/128/128.webp',
  routePath: '/app/photos',
};

/**
 * @description Framer Motion variants for the icon's interactive states.
 * This object defines the properties for hover and tap animations,
 * allowing for a clean separation of animation logic from the component's JSX.
 */
const iconVariants: Variants = {
  hover: {
    scale: 1.05,
    y: -5,
  },
  tap: {
    scale: 0.95,
  },
};


/**
 * @description A fallback component to render if the AppIcon encounters a rendering error.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const AppIconErrorFallback = (): JSX.Element => (
  <div className="flex flex-col items-center justify-center w-20 h-[90px] p-1 font-sans bg-red-100 rounded-lg">
    <div className="flex items-center justify-center w-16 h-16 mb-2 rounded-2xl bg-red-500 text-white text-3xl font-bold">
      !
    </div>
    <p className="text-xs font-bold text-red-700">Icon Error</p>
  </div>
);

/**
 * Represents a single, clickable application icon for the SmartphoneSimulator.
 *
 * @component
 * @example
 * // This component is self-contained and requires no props.
 * // It should be placed within a container that is a child of a `BrowserRouter`.
 * <AppIcon />
 *
 * @description
 * The `AppIcon` component is designed to be a self-sufficient element within the
 * smartphone's home screen UI. It uses internally defined constant data for its
 * label, image, and navigation path, strictly adhering to the "no props" requirement.
 *
 * It leverages `react-router-dom` for navigation, changing the view when clicked.
 * Subtle animations from `framer-motion` are used to provide visual feedback on hover and tap,
 * defined using a `variants` object for better organization.
 * The component is wrapped in a `LazyMotion` provider to optimize animation library loading
 * and an `ErrorBoundary` to gracefully handle any unexpected rendering errors.
 */
const AppIcon = (): JSX.Element => {
  const navigate = useNavigate();

  /**
   * Handles the click event on the icon.
   * Navigates to the predefined route path using the `useNavigate` hook.
   * Wrapped in `useCallback` for memoization, which is a good practice,
   * especially if this component were to be part of a larger, memoized list.
   */
  const handleIconClick = useCallback(() => {
    navigate(APP_ICON_DATA.routePath);
  }, [navigate]);

  return (
    <ErrorBoundary FallbackComponent={AppIconErrorFallback}>
      <LazyMotion features={domAnimation}>
        <motion.div
          onClick={handleIconClick}
          className="flex flex-col items-center justify-start w-20 h-[90px] p-1 font-sans cursor-pointer select-none"
          variants={iconVariants as Variants}
          whileHover="hover"
          whileTap="tap"
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          aria-label={`Open ${APP_ICON_DATA.label} application`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleIconClick()}
        >
          <img
            src={APP_ICON_DATA.iconSrc}
            alt={`${APP_ICON_DATA.label} app icon`}
            className="w-16 h-16 rounded-2xl shadow-lg mb-2 object-cover bg-gray-100"
            width="64"
            height="64"
            loading="lazy"
          />
          <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-xs font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
            {APP_ICON_DATA.label}
          </span>
        </motion.div>
      </LazyMotion>
    </ErrorBoundary>
  );
};

export default AppIcon;