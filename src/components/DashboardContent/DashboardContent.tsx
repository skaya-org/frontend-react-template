import React, { useState, useEffect, useMemo, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {Object} StatCardData
 * @property {number} id - Unique identifier for the card.
 * @property {string} title - The title of the statistic (e.g., "Total Revenue").
 * @property {string} value - The main value of the statistic (e.g., "$45,231.89").
 * @property {JSX.Element} icon - A React component representing the icon for the card.
 * @property {string} change - A string representing the change from the previous period (e.g., "+20.1%").
 * @property {'increase' | 'decrease'} changeType - The nature of the change, for styling purposes.
 * @property {string} bgColor - Tailwind CSS class for the card's background color.
 * @property {string} iconBgColor - Tailwind CSS class for the icon's background circle.
 */
type StatCardData = {
  id: number;
  title: string;
  value: string;
  icon: JSX.Element;
  changeType: 'increase' | 'decrease';
  change: string;
  bgColor: string;
  iconBgColor: string;
};

/**
 * @typedef {Object} WelcomeData
 * @property {string} userName - The name of the user to welcome.
 * @property {string} message - A brief welcome message or quote.
 * @property {string} avatarUrl - URL for the user's avatar image.
 */
type WelcomeData = {
  userName: string;
  message: string;
  avatarUrl: string;
};

/**
 * @typedef {Object} ChartDataPoint
 * @property {string} label - The label for the data point (e.g., month or day).
 * @property {number} value - The numerical value, used to determine bar height (0-100).
 */
type ChartDataPoint = {
    label: string;
    value: number;
};


// --- SVG ICONS ---
// Grouping icon components for modularity and reusability.

/**
 * Renders a 'revenue' icon.
 * @returns {JSX.Element} The SVG element.
 */
const RevenueIcon = (): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
  </svg>
);

/**
 * Renders a 'subscribers' icon.
 * @returns {JSX.Element} The SVG element.
 */
const SubscribersIcon = (): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

/**
 * Renders a 'sales' icon.
 * @returns {JSX.Element} The SVG element.
 */
const SalesIcon = (): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
);

/**
 * Renders an 'active' status icon.
 * @returns {JSX.Element} The SVG element.
 */
const ActiveNowIcon = (): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-1.414v.001" />
  </svg>
);


// --- CONSTANT DATA ---
// Self-contained data, ensuring the component does not require props.

const WELCOME_DATA: WelcomeData = {
  userName: 'Alex',
  message: 'Here is your performance snapshot for today.',
  avatarUrl: 'https://picsum.photos/200/200.webp',
};

const STATS_DATA: ReadonlyArray<StatCardData> = [
  { id: 1, title: "Total Revenue", value: "$45,231.89", change: "+20.1%", changeType: 'increase', icon: <RevenueIcon />, bgColor: 'bg-blue-100', iconBgColor: 'bg-blue-200' },
  { id: 2, title: "Subscriptions", value: "+2350", change: "+12.5%", changeType: 'increase', icon: <SubscribersIcon />, bgColor: 'bg-green-100', iconBgColor: 'bg-green-200' },
  { id: 3, title: "Sales", value: "9,870", change: "-2.1%", changeType: 'decrease', icon: <SalesIcon />, bgColor: 'bg-orange-100', iconBgColor: 'bg-orange-200' },
  { id: 4, title: "Active Now", value: "312", change: "+5.0%", changeType: 'increase', icon: <ActiveNowIcon />, bgColor: 'bg-pink-100', iconBgColor: 'bg-pink-200' },
];

const CHART_DATA: ReadonlyArray<ChartDataPoint> = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 59 },
    { label: 'Mar', value: 80 },
    { label: 'Apr', value: 81 },
    { label: 'May', value: 56 },
    { label: 'Jun', value: 55 },
    { label: 'Jul', value: 40 },
    { label: 'Aug', value: 52 },
    { label: 'Sep', value: 78 },
    { label: 'Oct', value: 92 },
];

// --- SUB-COMPONENTS ---

/**
 * A header component displaying a welcome message and user avatar.
 * @returns {JSX.Element} The rendered header.
 */
const WelcomeHeader = (): JSX.Element => {
    const headerVariants: Variants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
    };
    const textContentVariants: Variants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 15, stiffness: 100 } },
    };
    const avatarVariants: Variants = {
        hidden: { scale: 0.5, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 150 } },
    };

    return (
        <motion.div
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            variants={headerVariants as Variants}
        >
            <motion.div variants={textContentVariants as Variants}>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome back, {WELCOME_DATA.userName}!</h1>
                <p className="text-gray-500 dark:text-gray-400">{WELCOME_DATA.message}</p>
            </motion.div>
            <motion.img
                src={WELCOME_DATA.avatarUrl}
                alt={`${WELCOME_DATA.userName}'s avatar`}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                variants={avatarVariants as Variants}
            />
        </motion.div>
    );
};


/**
 * A card component to display a single statistic.
 * @param {StatCardData} data - The data for the stat card.
 * @returns {JSX.Element} The rendered statistic card.
 */
const StatCard = ({ data }: { data: StatCardData }): JSX.Element => {
  const changeColor = data.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return (
    <motion.div
      className={`p-4 rounded-lg shadow-sm flex flex-col justify-between ${data.bgColor} dark:bg-gray-800`}
      whileHover={{ y: -5, scale: 1.02, transition: { type: 'spring', stiffness: 300 } }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-600 dark:text-gray-300">{data.title}</h3>
        <div className={`p-2 rounded-full ${data.iconBgColor} dark:bg-gray-700`}>
          <div className="text-gray-800 dark:text-gray-200">{data.icon}</div>
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{data.value}</p>
        <p className={`text-sm mt-1 ${changeColor} font-medium`}>{data.change} from last month</p>
      </div>
    </motion.div>
  );
};

/**
 * A placeholder component for a data chart.
 * @returns {JSX.Element} The rendered chart placeholder.
 */
const ChartPlaceholder = (): JSX.Element => {
    const chartData = useMemo(() => CHART_DATA, []);
    const barContainerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const barVariants: Variants = {
        hidden: { y: '100%', opacity: 0 },
        visible: {
            y: '0%',
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 12 },
        },
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Monthly Performance</h3>
            <motion.div
                className="flex items-end justify-between h-64"
                variants={barContainerVariants as Variants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {chartData.map((point) => (
                    <div key={point.label} className="flex flex-col items-center flex-1 h-full">
                        <div className="flex-grow w-3/5 flex items-end">
                            <motion.div
                                className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-md transition-colors duration-200 hover:bg-blue-600 dark:hover:bg-blue-500"
                                style={{ height: `${point.value}%` }}
                                variants={barVariants as Variants}
                                title={`${point.label}: ${point.value}`}
                            />
                        </div>
                        <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">{point.label}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

// --- ERROR BOUNDARY ---

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * A simple Error Boundary to catch rendering errors in its children.
 * This is a class component as required by React's Error Boundary API.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("DashboardContent Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <h2 className="font-bold text-lg">Something went wrong.</h2>
          <p className="mt-2">This part of the dashboard could not be displayed. Please check the console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- MAIN COMPONENT ---

/**
 * DashboardContent serves as the main content area for a dashboard view.
 * It is a self-contained component that displays a welcome message,
 * summary statistic cards, and a placeholder chart using constant data,
 * requiring no props from parent components.
 *
 * @returns {JSX.Element} The complete dashboard content area.
 */
const DashboardContent = (): JSX.Element => {
  const stats = useMemo(() => STATS_DATA, []);

  const pageContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const sectionVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };
  
  const statsGridVariants: Variants = {
      hidden: {},
      visible: {
          transition: {
              staggerChildren: 0.07,
          }
      }
  }

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 font-sans">
        <motion.div
            className="max-w-7xl mx-auto space-y-6"
            variants={pageContainerVariants as Variants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={sectionVariants as Variants}>
              <WelcomeHeader />
            </motion.div>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={statsGridVariants as Variants}
            >
                {stats.map((stat) => (
                    <motion.div key={stat.id} variants={sectionVariants as Variants}>
                        <StatCard data={stat} />
                    </motion.div>
                ))}
            </motion.div>

            <motion.div variants={sectionVariants as Variants}>
                <ChartPlaceholder />
            </motion.div>
        </motion.div>
      </div>
  );
};

export default DashboardContent;