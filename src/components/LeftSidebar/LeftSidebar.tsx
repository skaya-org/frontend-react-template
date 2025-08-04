import React, { useState, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// To be included in your main HTML file for Tailwind CSS and icons
/*
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/heroicons/2.1.3/24/outline/heroicons.min.css" integrity="sha512-4e5lklsOanmHVEbbOBcOK8pgyLtrbH71v2sCmXhUi1s8D0zA3qKxQk45zkk3A3r2qfS44mSME0P1UTQySrqLwg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
*/

/**
 * @typedef {object} NavigationItem
 * @property {string} id - A unique identifier for the navigation item.
 * @property {string} title - The display text for the link.
 * @property {string} href - The URL target for the navigation link.
 * @property {boolean} [isActive=false] - Determines if the link is styled as active.
 * @property {NavigationItem[]} [children] - An optional array of nested navigation items.
 * @property {boolean} [isExpanded=false] - Determines if the nested section is expanded by default.
 */
type NavigationItem = {
  id: string;
  title: string;
  href: string;
  isActive?: boolean;
  children?: NavigationItem[];
  isExpanded?: boolean;
};

/**
 * Hardcoded navigation data for the sidebar.
 * This constant data ensures the component is self-contained and does not require props.
 * @type {NavigationItem[]}
 */
const NAVIGATION_DATA: NavigationItem[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    href: '#getting-started',
    children: [
      { id: 'gs-installation', title: 'Installation', href: '#installation' },
      { id: 'gs-project-setup', title: 'Project Setup', href: '#project-setup' },
      { id: 'gs-first-component', title: 'Your First Component', href: '#first-component' },
    ],
  },
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    href: '#core-concepts',
    isExpanded: true, // This section will be expanded by default
    children: [
      { id: 'cc-components-props', title: 'Components & Props', href: '#components-props' },
      { id: 'cc-state-lifecycle', title: 'State & Lifecycle', href: '#state-lifecycle', isActive: true }, // This item will be active by default
      { id: 'cc-event-handling', title: 'Handling Events', href: '#event-handling' },
      { id: 'cc-conditional-rendering', title: 'Conditional Rendering', href: '#conditional-rendering' },
    ],
  },
  {
    id: 'advanced-guides',
    title: 'Advanced Guides',
    href: '#advanced-guides',
    children: [
        { id: 'ag-context', title: 'Context', href: '#context' },
        { id: 'ag-hooks', title: 'Hooks at a Glance', href: '#hooks' },
        { id: 'ag-performance', title: 'Performance Optimization', href: '#performance' },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    href: '#api-reference',
    children: [
        { id: 'ar-react', title: 'React', href: '#react' },
        { id: 'ar-react-dom', title: 'ReactDOM', href: '#react-dom' },
    ],
  },
  {
    id: 'contributing',
    title: 'Contributing',
    href: '#contributing',
  },
];

// --- Animation Variants ---

const sidebarVariants: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const sidebarContentVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

const subMenuVariants: Variants = {
    enter: {
        height: 'auto',
        opacity: 1,
        transition: {
            height: { duration: 0.3, ease: "easeOut" },
            opacity: { duration: 0.2, delay: 0.1 },
            when: "beforeChildren",
            staggerChildren: 0.05,
        },
    },
    exit: {
        height: 0,
        opacity: 0,
        transition: {
            height: { duration: 0.3, ease: "easeIn" },
            opacity: { duration: 0.2 },
            when: "afterChildren",
            staggerChildren: 0.05,
            staggerDirection: -1
        },
    },
};

const subItemVariants: Variants = {
  exit: { opacity: 0, x: -10, transition: { duration: 0.2, ease: 'easeOut' } },
  enter: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

/**
 * Renders a single navigation category and its children.
 * Handles expand/collapse state for nested items.
 *
 * @param {object} props - The component props.
 * @param {NavigationItem} props.item - The navigation item to render.
 * @returns {JSX.Element} A list item element representing a navigation category.
 */
const NavCategory = ({ item }: { item: NavigationItem }): JSX.Element => {
    const [isExpanded, setIsExpanded] = useState(item.isExpanded ?? false);

    const hasChildren = item.children && item.children.length > 0;

    const activeLinkStyles = "font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800";
    const inactiveLinkStyles = "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50";

    const isCategoryActive = hasChildren && (item.children ?? []).some(child => child.isActive);

    return (
        <motion.li variants={itemVariants as Variants}>
            <a
                href={item.href}
                onClick={(e) => {
                    if (hasChildren) {
                        e.preventDefault();
                        setIsExpanded(!isExpanded);
                    }
                }}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md cursor-pointer transition-colors duration-150 group ${
                    isCategoryActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                } hover:bg-slate-100 dark:hover:bg-slate-700/50`}
            >
                <span className="font-medium">{item.title}</span>
                {hasChildren && (
                    <motion.svg
                        animate={{ rotate: isExpanded ? 0 : -90 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </motion.svg>
                )}
            </a>
            <AnimatePresence initial={false}>
                {isExpanded && hasChildren && (
                    <motion.ul
                        key="submenu"
                        initial="exit"
                        animate="enter"
                        exit="exit"
                        variants={subMenuVariants as Variants}
                        className="pl-4 ml-2 border-l border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                        {item.children?.map(child => (
                            <motion.li key={child.id} variants={subItemVariants as Variants} className="mt-1 first:mt-2">
                                <a
                                    href={child.href}
                                    className={`relative block w-full pl-4 pr-3 py-1.5 text-sm rounded-md transition-colors duration-150 ${
                                        child.isActive ? activeLinkStyles : inactiveLinkStyles
                                    }`}
                                >
                                    {child.isActive && (
                                        <motion.span
                                            layoutId="active-indicator"
                                            className="absolute left-[-11px] top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
                                        ></motion.span>
                                    )}
                                    {child.title}
                                </a>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </motion.li>
    );
};

/**
 * A fixed-position, independently scrollable left sidebar for documentation navigation.
 * It contains a hardcoded, hierarchical list of topics with one item styled as active by default.
 * The component is self-contained and does not accept any props.
 * It uses framer-motion for subtle animations.
 *
 * @returns {JSX.Element} The rendered LeftSidebar component.
 */
const LeftSidebar = (): JSX.Element => {
  return (
    <motion.aside
      className="fixed top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col"
      variants={sidebarVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={sidebarContentVariants as Variants}
        className="flex items-center justify-start shrink-0 h-16 border-b border-slate-200 dark:border-slate-800 px-4"
      >
        <a href="#" className="flex items-center space-x-3">
            <img src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500" alt="Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-slate-800 dark:text-white">Docs</span>
        </a>
      </motion.div>
      <motion.nav
        variants={sidebarContentVariants as Variants}
        className="flex-1 overflow-y-auto p-4"
      >
        <motion.ul
          className="space-y-1"
          variants={listVariants as Variants}
        >
          {NAVIGATION_DATA.map(item => (
            <NavCategory key={item.id} item={item} />
          ))}
        </motion.ul>
      </motion.nav>
      <motion.div
        variants={sidebarContentVariants as Variants}
        className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0"
      >
        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            © 2024 Your Company, Inc.
        </p>
      </motion.div>
    </motion.aside>
  );
};

export default LeftSidebar;