import React, { ReactNode, useMemo, JSX } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';

// --- TYPE DEFINITIONS ---

/**
 * @interface Project
 * @description Defines the shape of a single project object.
 * This type should be imported and used by any component that renders project data.
 */
export interface Project {
  /**
   * @property {string | number} id - A unique identifier for the project.
   */
  id: string | number;
  /**
   * @property {string} title - The title of the project.
   */
  title: string;
  /**
   * @property {string} description - A brief description of the project.
   */
  description: string;
  /**
   * @property {string} imageUrl - URL for the project's cover image.
   */
  imageUrl: string;
  /**
   * @property {string[]} tags - A list of technologies or tags associated with the project.
   */
  tags: string[];
  /**
   * @property {string} [liveUrl] - Optional URL to the live deployed project.
   */
  liveUrl?: string;
  /**
   * @property {string} [repoUrl] - Optional URL to the project's source code repository.
   */
  repoUrl?: string;
}

/**
 * @interface ProjectsSectionProps
 * @description Defines the props for the ProjectsSection component.
 */
export interface ProjectsSectionProps {
  /**
   * @property {string} [id] - A unique identifier for the section, useful for anchor links.
   * @default 'projects'
   */
  id?: string;
  /**
   * @property {string} [title] - The main heading for the projects section.
   * @default 'My Projects'
   */
  title?: string;
  /**
   * @property {string} [subtitle] - An optional subheading or introductory text.
   * @default 'A collection of my recent work.'
   */
  subtitle?: string;
  /**
   * @property {Project[]} [projects] - An array of project objects to be displayed.
   * @default []
   */
  projects?: Project[];
  /**
   * @property {string} [className] - Optional custom CSS class for the root section element.
   */
  className?: string;
}

// --- PLACEHOLDER/HELPER COMPONENTS ---
// In a real application, these would be in their own files and imported.
// They are included here to make the ProjectsSection component fully functional and demonstrate its usage.

/**
 * @interface PlaceholderProps
 * @description Generic props for placeholder layout components.
 */
interface PlaceholderProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * A placeholder Section component for semantic HTML structure.
 * @param {PlaceholderProps} props - The component props.
 * @returns {JSX.Element} A section element.
 */
const Section = ({ id, className = '', children }: PlaceholderProps): JSX.Element => (
  <section id={id} className={`bg-white dark:bg-slate-900 py-16 sm:py-24 ${className}`}>
    {children}
  </section>
);

/**
 * A placeholder Container component for centering content.
 * @param {PlaceholderProps} props - The component props.
 * @returns {JSX.Element} A div element.
 */
const Container = ({ className = '', children }: PlaceholderProps): JSX.Element => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

/**
 * @interface HeadingProps
 * @description Props for the placeholder Heading component.
 */
interface HeadingProps {
  title: string;
  subtitle?: string;
}

/**
 * A placeholder Heading component for section titles with entrance animations.
 * @param {HeadingProps} props - The component props.
 * @returns {JSX.Element} A header element.
 */
const Heading = ({ title, subtitle }: HeadingProps): JSX.Element => {
    const headingContainerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 },
        },
    };

    const headingItemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 },
        },
    };

    return (
        <motion.div
            className="text-center mb-16 sm:mb-20"
            variants={headingContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
        >
            <motion.h2
                className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
                variants={headingItemVariants as Variants}
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p
                    className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-400"
                    variants={headingItemVariants as Variants}
                >
                    {subtitle}
                </motion.p>
            )}
        </motion.div>
    );
};

/**
 * @interface ProjectCardProps
 * @description Props for the placeholder ProjectCard component.
 */
interface ProjectCardProps {
  project: Project;
}

/**
 * A placeholder ProjectCard component to display a single project.
 * @param {ProjectCardProps} props - The component props.
 * @returns {JSX.Element} A card element for a project.
 */
const ProjectCard = ({ project }: ProjectCardProps): JSX.Element => {
    const {
        title = 'Untitled Project',
        description = 'No description available.',
        imageUrl = 'https://via.placeholder.com/600x400/cccccc/969696?text=No+Image',
        tags = [],
        liveUrl,
        repoUrl,
    } = project;

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-slate-800">
            <div className="overflow-hidden">
                <img
                    src={imageUrl}
                    alt={`Screenshot of ${title}`}
                    className="h-48 w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
            </div>
            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="mt-2 flex-grow text-base text-gray-600 dark:text-gray-400">
                    {description}
                </p>
                <div className="mt-auto pt-6">
                    <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 4).map((tag) => (
                            <span
                                key={tag}
                                className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800 dark:bg-sky-900/50 dark:text-sky-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    {(liveUrl || repoUrl) && (
                        <div className="mt-6 flex items-center gap-x-6 border-t border-gray-900/10 pt-6 dark:border-white/10">
                            {liveUrl && (
                                <a
                                    href={liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm font-semibold leading-6 text-sky-600 transition-colors hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-500"
                                >
                                    Live Demo
                                    <span aria-hidden="true" className="ml-1.5">→</span>
                                </a>
                            )}
                            {repoUrl && (
                                <a
                                    href={repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm font-semibold leading-6 text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    Source Code
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

/**
 * @component ProjectsSection
 * @description A top-level section component to display a portfolio of projects.
 * It gracefully handles missing props and uses an ErrorBoundary to prevent crashes.
 *
 * @param {ProjectsSectionProps} props - The props for the component.
 * @returns {JSX.Element} The rendered ProjectsSection component.
 */
const ProjectsSection = ({
  id = 'projects',
  title = 'My Projects',
  subtitle = 'A collection of my recent work.',
  projects = [],
  className = '',
}: ProjectsSectionProps): JSX.Element => {
  /**
   * Fallback UI to render in case of an error within the projects list.
   * @returns {JSX.Element} A simple error message.
   */
  const renderErrorFallback = (): JSX.Element => (
    <div role="alert" className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
      <h3 className="font-semibold text-red-800 dark:text-red-300">Oops! Something went wrong.</h3>
      <div className="mt-2 text-sm text-red-700 dark:text-red-300/80">
        <p>There was an issue displaying the projects. Please try again later.</p>
      </div>
    </div>
  );
  
  /**
   * Animation variants for the project grid container to stagger children.
   */
  const gridContainerVariants = useMemo((): Variants => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }), []);

  /**
   * Animation variants for individual project cards.
   */
  const cardItemVariants = useMemo((): Variants => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 14,
      },
    },
  }), []);

  /**
   * Animation variants for the "no projects" empty state.
   */
   const emptyStateVariants = useMemo((): Variants => ({
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
  }), []);

  return (
    <Section id={id} className={className}>
      <Container>
        <Heading title={title} subtitle={subtitle} />
        
        <ErrorBoundary FallbackComponent={renderErrorFallback}>
          {projects.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
              variants={gridContainerVariants as Variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {projects.map((project) => (
                <motion.div key={project.id} variants={cardItemVariants as Variants} className="flex">
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-12"
              variants={emptyStateVariants as Variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No projects available</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Please check back later for updates.</p>
            </motion.div>
          )}
        </ErrorBoundary>
      </Container>
    </Section>
  );
};

export default ProjectsSection;