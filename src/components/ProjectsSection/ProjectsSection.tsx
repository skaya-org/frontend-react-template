import React from 'react';
import { motion, Variants } from 'framer-motion';

// Dummy data for demonstration purposes
const projects = [
  {
    id: 1,
    title: 'Project Alpha',
    href: '#',
    description:
      'A platform designed to streamline team collaboration and project management, featuring real-time updates and integrated communication tools.',
    imageUrl:
      'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80',
    date: 'Mar 16, 2023',
    datetime: '2023-03-16',
    category: { title: 'Web Development', href: '#' },
  },
  {
    id: 2,
    title: 'Project Beta',
    href: '#',
    description:
      'An innovative mobile application for personal finance tracking, helping users to manage their budgets, savings, and investments with an intuitive interface.',
    imageUrl:
      'https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80',
    date: 'Feb 12, 2023',
    datetime: '2023-02-12',
    category: { title: 'Mobile App', href: '#' },
  },
  {
    id: 3,
    title: 'Project Gamma',
    href: '#',
    description:
      'A comprehensive design system created to ensure brand consistency across all digital products, including a full suite of reusable UI components.',
    imageUrl:
      'https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80',
    date: 'Jan 29, 2023',
    datetime: '2023-01-29',
    category: { title: 'Design System', href: '#' },
  },
];

// Animation variants for the main grid container
const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25, // Stagger the animation of child elements
    },
  },
};

// Animation variants for each project card
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 }, // Start off-screen and invisible
  show: {
    opacity: 1,
    y: 0, // Animate to its original position
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Animation for the header text elements
const headerTextVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const ProjectShowcase = () => {
  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ staggerChildren: 0.3 }}
        >
          <motion.h2
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
            variants={headerTextVariants as Variants}
          >
            From the Portfolio
          </motion.h2>
          <motion.p
            className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400"
            variants={headerTextVariants as Variants}
          >
            A selection of my recent work, showcasing my skills in design and development.
          </motion.p>
        </motion.div>
        <motion.div
          className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          variants={gridContainerVariants as Variants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }} // Start animation when 10% of the grid is visible
        >
          {projects.map((project) => (
            <motion.article
              key={project.id}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              variants={cardVariants as Variants}
              whileHover={{ scale: 1.05, y: -8 }} // Scale up and lift on hover
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <img src={project.imageUrl} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                <time dateTime={project.datetime} className="mr-8">
                  {project.date}
                </time>
                <div className="-ml-4 flex items-center gap-x-4">
                  <svg viewBox="0 0 2 2" className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50">
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <div className="flex gap-x-2.5">
                    <a href={project.category.href} className="hover:text-white">{project.category.title}</a>
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                <a href={project.href}>
                  <span className="absolute inset-0" />
                  {project.title}
                </a>
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-300 line-clamp-2">
                {project.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectShowcase;