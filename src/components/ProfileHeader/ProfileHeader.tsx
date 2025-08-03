import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @file ProfileHeader.tsx
 * @description This file contains the ProfileHeader component for the Apollo Hospital profile page.
 * It is a self-contained component that uses its own constant data and does not accept any props.
 * It includes Framer Motion animations for a dynamic and engaging presentation.
 */

/**
 * @constant PROFILE_HEADER_DATA
 * @description Contains all the static data required for the ProfileHeader component.
 * This includes image URLs, hospital name, tagline, and location.
 * Centralizing data here ensures easy updates and maintainability without altering the component's logic.
 */
const PROFILE_HEADER_DATA = {
  bannerImageUrl: 'https://picsum.photos/200/300.jpg',
  logoImageUrl: 'https://picsum.photos/200/300.jpg', // A generic medical cross logo for Apollo
  hospitalName: 'Apollo Hospital',
  tagline: 'Touching Lives',
  location: 'Jubilee Hills, Hyderabad',
  alt: {
    banner: 'A modern and clean hospital corridor, representing advanced healthcare facilities.',
    logo: 'Apollo Hospital circular logo with a medical cross.',
  },
};


/**
 * Renders a location icon SVG.
 * @returns {JSX.Element} The SVG element for the location pin.
 */
const LocationIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-4 w-4 fill-current"
    aria-hidden="true"
  >
    <path d="M12 11.5A2.5 2.5 0 019.5 9A2.5 2.5 0 0112 6.5A2.5 2.5 0 0114.5 9A2.5 2.5 0 0112 11.5M12 2A7 7 0 005 9c0 5.25 7 13 7 13s7-7.75 7-13A7 7 0 0012 2z" />
  </svg>
);


/**
 * The main header component for the Apollo Hospital profile page.
 *
 * This component is designed to be fully self-sufficient, managing its own data
 * through a local constant object (`PROFILE_HEADER_DATA`). It features a striking
 * background banner, a prominent circular logo, and key information about the hospital.
 * By not accepting props, it ensures consistent presentation across the application
 * wherever it is used. Framer Motion is used to create a smooth, staggered entrance
 * animation for the header elements.
 *
 * @component
 * @returns {JSX.Element} The rendered ProfileHeader component.
 */
const ProfileHeader = (): JSX.Element => {
  const {
    bannerImageUrl,
    logoImageUrl,
    hospitalName,
    tagline,
    location,
    alt,
  } = PROFILE_HEADER_DATA;

  // Animation variants for Framer Motion
  const bannerVariants: Variants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: 'easeOut' },
    },
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
  };

  const contentContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.5, // Start animating children after the banner is visible
      },
    },
  };

  const logoVariants: Variants = {
    hidden: { scale: 0.5, y: -50, opacity: 0 },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 12 },
    },
  };

  const textContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const textItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };


  return (
    <header className="relative h-[400px] w-full font-sans overflow-hidden" role="banner" aria-label={`${hospitalName} Profile Header`}>
      <motion.img
        src={bannerImageUrl}
        alt={alt.banner}
        className="absolute inset-0 z-10 h-full w-full object-cover"
        variants={bannerVariants as Variants}
        initial="hidden"
        animate="visible"
      />
      <motion.div
        className="absolute inset-0 z-20 bg-black/40"
        variants={overlayVariants as Variants}
        initial="hidden"
        animate="visible"
      />
      <motion.div
        className="relative z-30 flex h-full flex-col items-center justify-center p-5 text-center text-white"
        variants={contentContainerVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="mb-5 flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-white shadow-xl"
          variants={logoVariants as Variants}
        >
          <img
            src={logoImageUrl}
            alt={alt.logo}
            className="h-[90%] w-[90%] object-contain"
          />
        </motion.div>
        <motion.div
          className="flex flex-col gap-2"
          variants={textContainerVariants as Variants}
        >
          <motion.h1
            className="m-0 text-4xl font-bold [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]"
            variants={textItemVariants as Variants}
          >
            {hospitalName}
          </motion.h1>
          <motion.p
            className="m-0 text-xl italic opacity-90 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]"
            variants={textItemVariants as Variants}
          >
            {tagline}
          </motion.p>
          <motion.p
            className="m-0 mt-1 flex items-center justify-center gap-2 text-base opacity-80"
            variants={textItemVariants as Variants}
          >
            <LocationIcon />
            {location}
          </motion.p>
        </motion.div>
      </motion.div>
    </header>
  );
};

export default ProfileHeader;