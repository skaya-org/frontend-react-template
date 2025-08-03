import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @typedef {object} ProfileSectionType
 * @description Defines the structure for a single section of the profile.
 * This type ensures that all section data adheres to a consistent shape.
 * @property {string} id - A unique identifier for the section, used as a key for mapping.
 * @property {string} title - The title of the section displayed in the card's header.
 * @property {JSX.Element | string} content - The main content of the section. It can be a simple string or complex JSX for rich content rendering.
 */
type ProfileSectionType = {
  id: string;
  title: string;
  content: JSX.Element | string;
};

/**
 * @const {ProfileSectionType[]} PROFILE_SECTIONS_DATA
 * @description An immutable array of objects containing all data for the profile sections.
 * This component is self-contained by design, holding its own data. This approach
 * removes the need for prop drilling and simplifies its integration into any part of an application,
 * as it requires no configuration from the parent component.
 */
const PROFILE_SECTIONS_DATA: readonly ProfileSectionType[] = [
  {
    id: 'about-me',
    title: 'About Me',
    content: (
      <p>
        A senior fullstack developer with 10+ years of experience in creating production-grade components.
        Dedicated to writing clean, maintainable, and scalable TypeScript code. Proficient in modern
        frameworks like React and passionate about building intuitive and performant user interfaces.
        Always eager to embrace new challenges and contribute to impactful projects.
      </p>
    ),
  },
  {
    id: 'experience',
    title: 'Experience',
    content: (
      <ul className="list-disc space-y-4 pl-5">
        <li>
          <strong>Lead Architect at Cloud-Native Solutions</strong> (2020 - Present)
          <br />
          Designing and implementing microservices architecture for enterprise-level applications. Leading
          the adoption of React 19 and modern state management patterns.
        </li>
        <li>
          <strong>Senior Engineer at Digital Innovations Co.</strong> (2016 - 2020)
          <br />
          Developed and maintained high-traffic e-commerce platforms, focusing on performance
          optimization and component reusability.
        </li>
      </ul>
    ),
  },
];

/**
 * @const {Variants} containerVariants
 * @description Framer Motion variants for the main container element.
 * This orchestrates the animation of its children, making them appear one after another.
 * - `hidden`: The initial state before the animation begins.
 * - `visible`: The final state, which triggers a staggered animation for child elements.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Controls the delay between each card animating in
    },
  },
};

/**
 * @const {Variants} cardVariants
 * @description Framer Motion variants for each individual card.
 * Defines how each card animates into view.
 * - `hidden`: The initial state of the card (invisible and slightly shifted down).
 * - `visible`: The final state of the card (fully visible and at its original position).
 */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};


/**
 * Renders a single, styled card for a profile section.
 * This internal component encapsulates the logic and styling for one card.
 *
 * @param {object} props - The component props.
 * @param {ProfileSectionType} props.section - The data for the section to render.
 * @returns {JSX.Element} A motion-enhanced div representing a section card.
 */
const SectionCard = ({ section }: { section: ProfileSectionType }): JSX.Element => (
  <motion.div
    className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
    variants={cardVariants as Variants}
  >
    <header className="border-b border-gray-200 bg-gray-50 px-6 py-4">
      <h2 className="m-0 font-semibold text-lg text-gray-800">{section.title}</h2>
    </header>
    <main className="p-6 text-base leading-relaxed text-gray-600">
      {section.content}
    </main>
  </motion.div>
);

/**
 * ProfileSectionCard Component
 *
 * @description
 * A self-contained and reusable component that renders a collection of profile section cards.
 * It is designed to work out-of-the-box without requiring any props from its parent,
 * as all content is defined internally via the `PROFILE_SECTIONS_DATA` constant.
 * This ensures visual and structural consistency wherever it's used.
 *
 * Each section is displayed within its own card, featuring a header and a content area,
 * with a staggered entry animation powered by `framer-motion` variants.
 *
 * @example
 * // To use this component, simply import and render it. No props are necessary.
 *
 * import ProfileSectionCard from './components/ProfileSectionCard';
 *
 * function UserProfilePage() {
 *   return (
 *     <main>
 *       <h1>User Profile</h1>
 *       <ProfileSectionCard />
 *     </main>
 *   );
 * }
 *
 * @remarks
 * For production applications, it is a best practice to wrap this component with an
 * `ErrorBoundary` to gracefully handle any potential rendering errors and prevent
 * a crash in the entire application tree.
 *
 * ```jsx
 * import { ErrorBoundary } from 'react-error-boundary';
 *
 * <ErrorBoundary FallbackComponent={MyErrorFallbackUI}>
 *   <ProfileSectionCard />
 * </ErrorBoundary>
 * ```
 *
 * @returns {JSX.Element} A fragment containing a list of profile section cards.
 */
const ProfileSectionCard = (): JSX.Element => {
  return (
    <motion.div
      className="mx-auto my-8 flex max-w-3xl flex-col gap-6 px-4 font-sans"
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      {PROFILE_SECTIONS_DATA.map((section) => (
        <SectionCard key={section.id} section={section} />
      ))}
    </motion.div>
  );
};

export default ProfileSectionCard;