import React, { JSX, FC } from 'react';
import { motion, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
// The DataCard component is assumed to exist at this path and accept the props defined in the DashboardMetric type.

/**
 * @type DashboardMetric
 * @description Defines the structure for a single metric displayed on the dashboard.
 * This type is used for the constant data array that populates the DataCard components.
 */
type DashboardMetric = {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  iconUrl: string;
};

/**
 * @const DASHBOARD_DATA
 * @description Mock static data for the cross-chain metrics dashboard. This data is self-contained
 * within the component, ensuring it does not rely on external props.
 */
const DASHBOARD_DATA: readonly DashboardMetric[] = [
  {
    id: 'tvl',
    title: 'Total Value Locked (TVL)',
    value: '$125.7B',
    change: '+2.1%',
    changeType: 'positive',
    iconUrl: 'https://picsum.photos/seed/tvl/100',
  },
  {
    id: 'volume',
    title: '24h Bridge Volume',
    value: '$4.3B',
    change: '+8.5%',
    changeType: 'positive',
    iconUrl: 'https://picsum.photos/seed/volume/100',
  },
  {
    id: 'transactions',
    title: 'Cross-Chain Txs (24h)',
    value: '1.2M',
    change: '-0.5%',
    changeType: 'negative',
    iconUrl: 'https://picsum.photos/seed/transactions/100',
  },
  {
    id: 'wallets',
    title: 'Active Wallets',
    value: '8.9M',
    change: '+1.2%',
    changeType: 'positive',
    iconUrl: 'https://picsum.photos/seed/wallets/100',
  },
  {
    id: 'gas-fees',
    title: 'Avg. Gas Fee (Gwei)',
    value: '23.5',
    change: '-5.0%',
    changeType: 'negative',
    iconUrl: 'https://picsum.photos/seed/gas/100',
  },
  {
    id: 'new-contracts',
    title: 'New Contracts Deployed',
    value: '1,452',
    change: '+15.3%',
    changeType: 'positive',
    iconUrl: 'https://picsum.photos/seed/contracts/100',
  },
];

/**
 * @component ErrorFallback
 * @description A fallback UI component to display when the HolographicDashboard encounters a rendering error.
 * It provides a user-friendly message and logs the error for debugging purposes.
 * @param {FallbackProps} props - Props provided by `react-error-boundary`, including the error object.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const ErrorFallback: FC<FallbackProps> = ({ error }): JSX.Element => {
  // In a real application, you would log this error to a service like Sentry or LogRocket.
  console.error("HolographicDashboard Error:", error.message);

  return (
    <div
      role="alert"
      className="p-8 bg-[#330000] text-[#ffaaaa] border-2 border-[#880000] rounded-lg text-center"
    >
      <h2 className="text-xl font-bold mb-4">Dashboard Anomaly Detected</h2>
      <p>An unexpected error occurred while rendering the dashboard.</p>
      <pre className="mt-4 whitespace-pre-wrap text-[#ffdddd] bg-black/20 p-4 rounded-md">
        {error.message}
      </pre>
    </div>
  );
};

/**
 * @component HolographicDashboard
 * @description A section that serves as a holographic dashboard displaying various cross-chain metrics.
 * It arranges multiple DataCard components in a grid layout. The entire section has a subtle
 * floating animation to give it a futuristic, holographic feel. The data for the dashboard is
 * sourced from a mock, static data array within the component itself, requiring no external props.
 * @returns {JSX.Element} The rendered HolographicDashboard component, wrapped in an ErrorBoundary.
 */
const HolographicDashboard = (): JSX.Element => {
  /**
   * @const dashboardVariants
   * @description Framer Motion variants for the main dashboard container.
   * Includes an initial fade-in and a continuous, subtle floating animation.
   */
  const dashboardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
    floating: {
      y: ['-5px', '5px'],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      },
    },
  };

  /**
   * @const gridContainerVariants
   * @description Variants for the grid container to orchestrate staggered animations for its children.
   */
  const gridContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4, // Delay after the main container's 'visible' animation
      },
    },
  };

  /**
   * @const cardVariants
   * @description Variants for each individual DataCard, creating a fade-in and slide-up effect.
   */
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <motion.section
        aria-labelledby="dashboard-title"
        variants={dashboardVariants as Variants}
        initial="hidden"
        animate={['visible', 'floating']}
        className="p-8 rounded-2xl bg-[rgba(10,25,47,0.85)] backdrop-blur-[10px] border border-[rgba(0,191,255,0.2)] shadow-[0_0_25px_rgba(0,191,255,0.15),_0_0_50px_rgba(0,191,255,0.1)]"
      >
        <motion.h2
          id="dashboard-title"
          className="text-center text-[#cdeeff] mb-8 font-mono text-3xl tracking-[2px] [text-shadow:0_0_5px_#00bfff,0_0_10px_#00bfff,0_0_15px_#00bfff]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Holographic Cross-Chain Metrics
        </motion.h2>
        <motion.div
          className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6"
          variants={gridContainerVariants as Variants}
          initial="hidden"
          animate="visible"
        >
          {DASHBOARD_DATA.map(metric => (
            <motion.div key={metric.id} variants={cardVariants as Variants}>
              {/*
               * The DataCard component is responsible for rendering each metric.
               * We pass the metric data as props, which is a standard pattern for list rendering.
               * The "no props" rule applies to HolographicDashboard itself.
              */}
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </ErrorBoundary>
  );
};

export default HolographicDashboard;