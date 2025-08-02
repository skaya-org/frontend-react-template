import React, { JSX, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';

// --- TYPE IMPORTS FROM CHILD COMPONENTS ---
// These interfaces are assumed to be exported from their respective component files.
// This ensures data consistency and type safety across the application.

/**
 * Props for the ResumeHeader component.
 * @see src/components/ResumeHeader/ResumeHeader.tsx
 */
export interface ResumeHeaderProps {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  portfolio: string;
}

/**
 * Props for the ResumeSection component.
 * @see src/components/ResumeSection/ResumeSection.tsx
 */
export interface ResumeSectionProps {
  title: string;
  children: ReactNode;
}

/**
 * Props for the ExperienceItem component.
 * @see src/components/ExperienceItem/ExperienceItem.tsx
 */
export interface ExperienceItemProps {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string[];
}

/**
 * Props for the EducationItem component.
 * @see src/components/EducationItem/EducationItem.tsx
 */
export interface EducationItemProps {
  degree: string;
  institution: string;
  date: string;
}

/**
 * Props for the SkillsList component.
 * @see src/components/SkillsList/SkillsList.tsx
 */
export interface SkillsListProps {
  skills: string[];
}


// --- COMPONENT IMPORTS ---
import ResumeHeader from 'src/components/ResumeHeader/ResumeHeader';
import ResumeSection from 'src/components/ResumeSection/ResumeSection';
import ExperienceItem from 'src/components/ExperienceItem/ExperienceItem';
// import EducationItem from 'src/components/EducationItem/EducationItem';
// import SkillsList from 'src/components/SkillsList/SkillsList';


// --- COMPONENT-SPECIFIC TYPES ---

/**
 * Defines the structured data for a complete resume.
 * This type aggregates the data required by all child components,
 * serving as the single source of truth for the resume's content.
 */
export interface ResumeData {
  /** Personal information for the resume header. */
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    portfolio: string;
  };
  /** A professional summary or objective statement. */
  summary: string;
  /** An array of work experience entries. */
  experience: ExperienceItemProps[];
  /** An array of education entries. */
  education: EducationItemProps[];
  /** An array of professional skills. */
  skills: SkillsListProps['skills'];
}

/**
 * Defines the props for the ResumePage component.
 */
export interface ResumePageProps {
  /**
   * The complete data object used to render all sections of the resume.
   */
  resumeData: ResumeData;
}


// --- ERROR BOUNDARY FALLBACK ---

/**
 * A fallback component to display when an error occurs within the ResumePage.
 * @param {object} props - The props object.
 * @param {Error} props.error - The error that was caught by the ErrorBoundary.
 * @returns {JSX.Element} The fallback UI.
 */
const ResumeErrorFallback = ({ error }: { error: Error }): JSX.Element => (
  <div role="alert" className="p-5 border border-red-500 rounded-lg bg-red-50">
    <h2 className="text-xl font-bold text-red-700">Failed to Render Resume</h2>
    <p className="mt-2 text-red-600">An unexpected error occurred. Please try again later.</p>
    <pre className="mt-4 p-3 bg-red-100 text-red-800 rounded whitespace-pre-wrap break-all text-sm">{error.message}</pre>
  </div>
);

// --- ANIMATION VARIANTS ---

/**
 * Variants for the main container to orchestrate staggered animations for its children.
 */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/**
 * Variants for individual resume sections to fade in and slide up.
 */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 15,
    },
  },
};


// --- MAIN COMPONENT ---

/**
 * ResumePage is a top-level component that orchestrates the rendering of a full resume.
 * It composes various specialized components to display distinct sections like
 * the header, summary, work experience, education, and skills.
 *
 * @component
 * @param {ResumePageProps} props - The props for the component.
 * @returns {JSX.Element} The fully rendered resume page.
 */
const ResumePage = ({ resumeData }: ResumePageProps): JSX.Element => {
  const { personalInfo, summary, experience, education, skills } = resumeData;

  return (
    <motion.article
      className="font-sans bg-white text-gray-900 max-w-4xl mx-auto my-8 p-8 shadow-2xl rounded-lg"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <ErrorBoundary FallbackComponent={ResumeErrorFallback}>
        {/* Header has a distinct entry animation */}
        <motion.div variants={itemVariants as Variants} initial="hidden" animate="visible">
          {/* <ResumeHeader {...personalInfo} /> */}
        </motion.div>
          {/* <ResumeHeader {...personalInfo} /> */}
        <motion.main
          className="mt-8 space-y-10"
          variants={containerVariants as Variants}
          initial="hidden"
          animate="visible"
        >
          {/* Each section is a motion component to be staggered */}
          <motion.div variants={itemVariants as Variants}>
            <ResumeSection title="Summary">
              <p className="text-gray-700 leading-relaxed">
                {summary}
              </p>
            </ResumeSection>
          </motion.div>

          <motion.div variants={itemVariants as Variants}>
            <ResumeSection title="Work Experience">
              <div className="space-y-8">
                {experience.map((exp, index) => (
                  // Using a combination of company and index for a key,
                  // assuming no unique ID is provided in the data.
                  <ExperienceItem key={`${exp.company}-${index}`} {...exp} />
                ))}
              </div>
            </ResumeSection>
          </motion.div>

          <motion.div variants={itemVariants as Variants}>
            <ResumeSection title="Education">
              <div className="space-y-6">
                {education.map((edu, index) => (
                  edu.institution
                ))}
              </div>
            </ResumeSection>
          </motion.div>

          <motion.div variants={itemVariants as Variants}>
            <ResumeSection title="Skills">
              Skills
              {/* <SkillsList skills={skills} /> */}
            </ResumeSection>
          </motion.div>
        </motion.main>
      </ErrorBoundary>
    </motion.article>
  );
};

export default ResumePage;