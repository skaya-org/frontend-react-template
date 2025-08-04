import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @typedef {object} UserProfileData
 * @property {string} name - The user's full name.
 * @property {string} email - The user's email address.
 * @property {string} bio - A short biography of the user.
 * @property {string} jobTitle - The user's current job title.
 * @property {string} location - The user's geographical location.
 * @property {string} avatarUrl - The URL for the user's profile picture.
 * @property {object} stats - A collection of user statistics.
 * @property {number} stats.followers - The number of followers the user has.
 * @property {number} stats.following - The number of users the user is following.
 * @property {number} stats.projects - The number of projects the user has.
 */

/**
 * Constant holding all the static data for the user profile.
 * This ensures the component is self-contained and does not require props.
 * @const
 * @type {UserProfileData}
 */
const USER_DATA = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  bio: 'Senior Fullstack Developer with a passion for creating beautiful, functional, and user-centered digital experiences. I specialize in TypeScript, React, and Node.js.',
  jobTitle: 'Senior Fullstack Developer',
  location: 'San Francisco, CA',
  avatarUrl: 'https://picsum.photos/200/200.webp',
  stats: {
    followers: 1450,
    following: 320,
    projects: 42,
  },
};

/**
 * A self-contained component that displays a user's profile information.
 * It uses internally defined constant data, requiring no props from parent components.
 * The component is designed to be a standalone piece of the UI, showcasing user details
 * in a clean, card-style layout with subtle animations.
 *
 * For a real-world application, this component would typically be wrapped in an ErrorBoundary
 * higher up in the component tree to handle any unexpected rendering errors gracefully.
 *
 * @component
 * @returns {JSX.Element} The rendered user profile content.
 */
const ProfileContent = (): JSX.Element => {
  // Variants for the main container to orchestrate the animations of its children.
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  // Generic variants for most child elements to fade and slide in.
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  // Specific variants for the avatar for a subtle pop-in effect.
  const avatarVariants: Variants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.6, 0.05, -0.01, 0.9] }, // Custom spring-like easing
    },
  };

  // Variants for the divider lines to animate their width.
  const hrVariants: Variants = {
    hidden: { opacity: 0, scaleX: 0 },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center  p-4 font-sans">
      <motion.div
        variants={cardVariants as Variants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl shadow-slate-200/60"
      >
      

        {/* Divider */}
        <motion.hr
          variants={hrVariants as Variants}
          className="my-6 origin-center border-t border-slate-200"
        />

        {/* Statistics Section */}
        <motion.div variants={itemVariants as Variants} className="flex justify-around text-center">
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold text-slate-800">{USER_DATA.stats.followers.toLocaleString()}</p>
            <p className="text-sm font-medium text-slate-500">Followers</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold text-slate-800">{USER_DATA.stats.following.toLocaleString()}</p>
            <p className="text-sm font-medium text-slate-500">Following</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold text-slate-800">{USER_DATA.stats.projects}</p>
            <p className="text-sm font-medium text-slate-500">Projects</p>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.hr
          variants={hrVariants as Variants}
          className="my-6 origin-center border-t border-slate-200"
        />

        {/* Bio Section */}
        <motion.div variants={itemVariants as Variants} className="text-left">
          <h2 className="mb-2 text-lg font-semibold text-slate-800">About Me</h2>
          <p className="leading-relaxed text-slate-600">{USER_DATA.bio}</p>
        </motion.div>

        {/* Action Button */}
        <motion.div variants={itemVariants as Variants} className="mt-8">
          <motion.button
            type="button"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            // onClick is omitted as per requirement for a non-functional button.
            // In a real app, this would trigger a modal or navigation:
            // onClick={() => console.log('Edit profile clicked')}
          >
            Edit Profile
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileContent;