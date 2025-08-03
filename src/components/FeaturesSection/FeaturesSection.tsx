import React, { JSX, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';
import FeatureCard from '../FeatureCard/FeatureCard';

/**
 * @typedef {object} Feature
 * @description Defines the structure for a single feature object.
 * @property {string} id - A unique identifier for the feature, used for React keys.
 * @property {string} icon - An emoji or a string identifier for an icon representing the feature.
 * @property {string} title - The title of the feature.
 * @property {string} description - A brief, compelling description of the feature.
 */
type Feature = {
	id: string;
	icon: string;
	title: string;
	description: string;
};

/**
 * @const FEATURES_DATA
 * @description A constant array of feature data. This component is self-contained and
 * does not require props for its content, ensuring consistency and ease of use.
 * The data is defined here to keep component logic and content colocated.
 * @type {Feature[]}
 */
const FEATURES_DATA: readonly Feature[] = [
	{
		id: 'feat-1',
		icon: '🚀',
		title: 'Blazing Fast Performance',
		description:
			'Our infrastructure is optimized for speed, ensuring your experience is seamless and responsive, with sub-millisecond response times.',
	},
	{
		id: 'feat-2',
		icon: '🛡️',
		title: 'Enterprise-Grade Security',
		description:
			'Protect your data with multi-layered security, end-to-end encryption, and proactive threat monitoring. Your security is our top priority.',
	},
	{
		id: 'feat-3',
		icon: '🔄',
		title: 'Seamless Integrations',
		description:
			'Connect with hundreds of third-party tools and services effortlessly. Our robust API makes integration a breeze.',
	},
	{
		id: 'feat-4',
		icon: '💡',
		title: 'Intuitive User Experience',
		description:
			'Designed with you in mind. Our clean, user-friendly interface allows you to get started in minutes, no training required.',
	},
	{
		id: 'feat-5',
		icon: '🌍',
		title: 'Global Scalability',
		description:
			'Scale your operations on demand. Our global network ensures high availability and low latency, no matter where your users are.',
	},
	{
		id: 'feat-6',
		icon: '💬',
		title: '24/7 Expert Support',
		description:
			'Our dedicated support team is available around the clock to help you with any questions or issues you may encounter.',
	},
];

/**
 * @const containerVariants
 * @description Animation variants for the grid container, enabling a staggered-child animation effect.
 * The `whileInView` prop triggers this animation when the container enters the viewport.
 */
const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

/**
 * @const itemVariants
 * @description Animation variants for each individual feature card, creating a subtle fade-in and slide-up effect.
 * This effect is orchestrated by the parent's `staggerChildren` transition.
 */
const itemVariants: Variants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring',
			stiffness: 100,
		},
	},
};

/**
 * A minimal fallback component to display when a FeatureCard encounters a rendering error.
 * This prevents a single card's error from crashing the entire section.
 * @param {{ error: Error }} props - The props object provided by React Error Boundary.
 * @param {Error} props.error - The error that was caught.
 * @returns {JSX.Element} A simple UI indicating that a feature card could not be displayed.
 */
const FeatureCardErrorFallback = ({ error }: { error: Error }): JSX.Element => (
	<div
		role="alert"
		className="flex flex-col items-center justify-center p-6 text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30"
	>
		<p className="font-semibold">Feature failed to load.</p>
		{/* In a real application, we would log this error to a monitoring service */}
		<pre style={{ display: 'none' }}>{error.message}</pre>
	</div>
);

/**
 * @component FeaturesSection
 * @description A self-contained section component that displays a grid of key features.
 * It uses an internal constant for its data, eliminating the need for props and ensuring
 * consistent presentation. Each feature is rendered in a `FeatureCard` component,
 * wrapped with an error boundary for resilience and animated for a polished user experience.
 *
 * @returns {JSX.Element} The rendered features section as a semantic `<section>` element.
 */
const FeaturesSection = (): JSX.Element => {
	return (
		<section id="features" className="py-16 bg-white sm:py-24 dark:bg-gray-900">
			<div className="px-6 mx-auto max-w-7xl lg:px-8">
				<div className="max-w-2xl mx-auto lg:text-center">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
						Why Choose Us?
					</h2>
					<p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
						Discover the powerful features that make our service the best choice for your needs.
					</p>
				</div>

				<motion.div
					className="grid max-w-2xl grid-cols-1 mx-auto mt-16 gap-x-8 gap-y-16 sm:mt-20 lg:mt-24 lg:mx-0 lg:max-w-none lg:grid-cols-3"
					variants={containerVariants as Variants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
				>
					{FEATURES_DATA.map(feature => (
						<ErrorBoundary
							key={feature.id}
							FallbackComponent={FeatureCardErrorFallback}
							// In a production environment, you would log this error to an external service.
							onError={(error, info) => console.error('FeatureCard failed to render:', error, info)}
						>
							<motion.div variants={itemVariants as Variants}>
								<FeatureCard
								/>
							</motion.div>
						</ErrorBoundary>
					))}
				</motion.div>
			</div>
		</section>
	);
};

// Memoizing the component is a performance best practice for components that receive no props,
// preventing unnecessary re-renders if a parent component updates.
export default memo(FeaturesSection);