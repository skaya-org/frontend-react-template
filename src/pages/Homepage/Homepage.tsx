import React, { JSX, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

// As per the instructions, all components are defined within this single file.

// --- ANIMATION VARIANTS ---

/**
 * @reason Variants for the main page container to stagger its direct children (header, sections).
 */
const pageContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

/**
 * @reason Variants for individual sections/cards to fade and slide in as part of the initial page load.
 */
const sectionItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * @reason Variants for lists that need to stagger their items' appearance on scroll.
 */
const listStaggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/**
 * @reason Variants for individual items within a staggered, scroll-triggered list.
 */
const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

/**
 * @reason Variants for the floating dock, controlling its entrance and staggering tabs.
 */
const dockVariants: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
      staggerChildren: 0.1,
      delay: 0.5, // Delay so it appears after the main content has started animating.
    },
  },
};

/**
 * @reason Variants for each tab in the floating dock, including entrance, hover and tap effects.
 */
const tabVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  hover: { scale: 1.1, transition: { type: 'spring', stiffness: 300 } },
  tap: { scale: 0.9 },
};


// --- SVG ICONS (as React Components) ---

/**
 * @reason Icon for the 'Home' tab in the floating dock.
 */
const HomeIcon = (): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

/**
 * @reason Icon for the 'Services' tab in the floating dock.
 */
const ServicesIcon = (): JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0l2-2m0 0l2 2m-2-2v2" />
    </svg>
);

/**
 * @reason Icon for the 'Contact' tab in the floating dock.
 */
const ContactIcon = (): JSX.Element => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);


// --- REUSABLE UI COMPONENTS ---

/**
 * @reason A small, pill-shaped component to display a single skill or medical service.
 */
const SkillPill = ({ skill }: { skill: string }): JSX.Element => (
  <span className="m-1 inline-block rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-800">
    {skill}
  </span>
);

/**
 * @reason A component to display a single entry in the experience or departments section.
 */
const ExperienceItem = ({ logo, title, details, duration }: { logo: string, title: string, details: string, duration: string }): JSX.Element => (
  <div className="flex gap-4 py-4">
    <img src={logo} alt={`${title} logo`} className="h-12 w-12 flex-shrink-0 object-contain" />
    <div className="flex flex-1 flex-col">
      <h3 className="m-0 text-base font-semibold text-gray-900">{title}</h3>
      <p className="my-0.5 text-sm text-gray-600">{details}</p>
      <p className="my-0.5 text-xs text-gray-500">{duration}</p>
    </div>
  </div>
);

/**
 * @reason A reusable card component that serves as a container for different sections of the profile.
 */
const ProfileSectionCard = ({ title, children }: { title: string, children: ReactNode }): JSX.Element => (
  <motion.div 
    className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white"
    variants={sectionItemVariants as Variants}
  >
    <div className="border-b border-gray-200 px-6 py-4">
      <h2 className="m-0 text-xl font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="px-6 py-4">
      {children}
    </div>
  </motion.div>
);

/**
 * @reason Represents a single clickable tab within the floating dock.
 */
const DockTab = ({ icon, label }: { icon: JSX.Element, label: string }): JSX.Element => (
    <motion.button 
        className="flex w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg py-2 text-white transition-colors duration-200 hover:bg-white/10 focus:bg-white/20 focus:outline-none"
        variants={tabVariants as Variants}
        whileHover="hover"
        whileTap="tap"
    >
      <div className="h-6 w-6">{icon}</div>
      <span className="text-xs">{label}</span>
    </motion.button>
);


// --- PROFILE SECTION COMPONENTS ---

/**
 * @reason The main header component for the Apollo Hospital profile page.
 */
const ProfileHeader = (): JSX.Element => {
    const profileData = {
        bannerUrl: 'https://picsum.photos/300/150.jpg',
        logoUrl: 'https://picsum.photos/200/300',
        name: 'Apollo Hospitals',
        tagline: 'Touching Lives',
        location: 'Chennai, India · 2,000,000+ followers',
    };

    return (
        <motion.div 
          className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white"
          variants={sectionItemVariants as Variants}
        >
            <div className="relative">
                <img src={profileData.bannerUrl} alt="Hospital banner" className="h-48 w-full object-cover" />
                <div className="absolute left-6 top-[120px] h-[150px] w-[150px] rounded-full border-4 border-white bg-white p-1 shadow-md">
                    <img src={profileData.logoUrl} alt="Apollo Hospital logo" className="h-full w-full rounded-full object-contain" />
                </div>
            </div>
            <div className="px-6 pb-6 pt-[70px]">
                <h1 className="mb-1 text-2xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="mb-2 text-base text-gray-800">{profileData.tagline}</p>
                <p className="m-0 text-sm text-gray-500">{profileData.location}</p>
            </div>
        </motion.div>
    );
};

/**
 * @reason A section dedicated to the 'About Us' information for Apollo Hospital.
 */
const AboutSection = (): JSX.Element => {
    const aboutText = "Apollo Hospitals Enterprise Limited is an Indian multinational healthcare group headquartered in Chennai. It is the largest hospital chain in India, with a network of 71 owned and managed hospitals. Along with the eponymous hospital chain, the company also operates pharmacies, primary care and diagnostic centres, and telehealth clinics through its subsidiaries.";

    return (
        <ProfileSectionCard title="About">
            <p className="m-0 text-sm leading-relaxed text-gray-700">
                {aboutText}
            </p>
        </ProfileSectionCard>
    );
};

/**
 * @reason A section that displays the hospital's key departments or historical milestones.
 */
const ExperienceSection = (): JSX.Element => {
    const departmentsData = [
        {
            logo: 'https://cdn-icons-png.flaticon.com/512/2833/2833778.png',
            title: 'Cardiology Department',
            details: 'Pioneering cardiac care in India since 1983.',
            duration: 'Key Achievement: First successful heart transplant in the region.'
        },
        {
            logo: 'https://cdn-icons-png.flaticon.com/512/3034/3034808.png',
            title: 'Oncology Center',
            details: 'Comprehensive cancer care with advanced technology.',
            duration: 'Key Technology: Proton Therapy Center'
        },
        {
            logo: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
            title: 'Neurology & Neurosurgery',
            details: 'Treating a wide range of neurological disorders.',
            duration: 'Team of 50+ world-renowned neurologists.'
        },
    ];

    return (
        <ProfileSectionCard title="Departments">
            <motion.div 
              className="-my-4 divide-y divide-gray-200"
              variants={listStaggerVariants as Variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
                {departmentsData.map((exp, index) => (
                    <motion.div key={index} variants={listItemVariants as Variants}>
                      <ExperienceItem
                          logo={exp.logo}
                          title={exp.title}
                          details={exp.details}
                          duration={exp.duration}
                      />
                    </motion.div>
                ))}
            </motion.div>
        </ProfileSectionCard>
    );
};

/**
 * @reason A section to showcase the various medical services and specialties offered by Apollo Hospital.
 */
const SkillsSection = (): JSX.Element => {
    const skillsData = [
        'Robotic Surgery', 'Proton Therapy', 'Emergency Care', 'Telemedicine', 'Diagnostic Services',
        'Organ Transplantation', 'Preventive Health Checks', 'Maternity & Child Care', 'Advanced Research', 'Medical Education'
    ];

    return (
        <ProfileSectionCard title="Services & Specialties">
            <motion.div 
              className="-m-1 flex flex-wrap"
              variants={listStaggerVariants as Variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
                {skillsData.map((skill, index) => (
                    <motion.div key={index} variants={listItemVariants as Variants}>
                        <SkillPill skill={skill} />
                    </motion.div>
                ))}
            </motion.div>
        </ProfileSectionCard>
    );
};


// --- FLOATING DOCK COMPONENT ---

/**
 * @reason A container that is fixed to the bottom of the viewport, acting as a navigation dock.
 */
const FloatingDock = (): JSX.Element => {
    const tabsData = [
        { icon: <HomeIcon />, label: 'Home' },
        { icon: <ServicesIcon />, label: 'Services' },
        { icon: <ContactIcon />, label: 'Contact' },
    ];

    return (
        <motion.div
            className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-2xl bg-slate-800 p-2 shadow-lg"
            variants={dockVariants as Variants}
            initial="hidden"
            animate="visible"
        >
            {tabsData.map((tab, index) => (
                <DockTab key={index} icon={tab.icon} label={tab.label} />
            ))}
        </motion.div>
    );
};


// --- MAIN PAGE COMPONENT ---

/**
 * @reason The main page component that assembles the entire LinkedIn-style profile for Apollo Hospital.
 */
const ApolloProfilePage = (): JSX.Element => {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <motion.main 
              className="mx-auto max-w-3xl p-5"
              variants={pageContainerVariants as Variants}
              initial="hidden"
              animate="visible"
            >
                <ProfileHeader />
                <AboutSection />
                <ExperienceSection />
                <SkillsSection />
            </motion.main>
            <FloatingDock />
        </div>
    );
};

/**
 * This is the main component for the Homepage.tsx file.
 * It renders the complete Apollo Hospital profile page.
 */
const Homepage = (): JSX.Element => {
  return (
    <ApolloProfilePage />
  );
};

export default Homepage;