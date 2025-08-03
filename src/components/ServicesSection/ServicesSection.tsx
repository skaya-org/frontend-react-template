import React, { JSX, memo } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';
import ServiceCard from '../ServiceCard/ServiceCard';

// #region TYPE DEFINITIONS
/**
 * Defines the shape of a service object.
 * This type is used for the constant data that populates the ServiceCard components.
 * @property {string} id - A unique identifier for the service, used as a key for mapping.
 * @property {JSX.Element} icon - The icon component representing the service.
 * @property {string} title - The title of the service.
 * @property {string} description - A brief description of the service.
 */
type Service = {
	readonly id: string;
	readonly icon: JSX.Element;
	readonly title: string;
	readonly description: string;
};
// #endregion

// #region MOCK ICONS
/**
 * A mock SVG icon for a washing machine.
 * In a real application, this would likely be imported from an icon library or an SVG file.
 * @returns {JSX.Element} The washing machine SVG icon.
 */
const WashingMachineIcon = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="48"
		height="48"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
		<circle cx="12" cy="13" r="4" />
		<path d="M12 8v.01" />
		<path d="M17 3v2" />
		<path d="M7 3v2" />
	</svg>
);

/**
 * A mock SVG icon for an iron.
 * @returns {JSX.Element} The iron SVG icon.
 */
const IronIcon = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="48"
		height="48"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="M3 16l-2 5h20l-2-5" />
		<path d="M11 12H5c-1.66 0-3-1.34-3-3 0-2 2-3 4-3 1.33 0 2.5.5 3 1.25" />
		<path d="M12 12h7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3" />
	</svg>
);

/**
 * A mock SVG icon for dry cleaning.
 * @returns {JSX.Element} The dry cleaning SVG icon.
 */
const DryCleaningIcon = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="48"
		height="48"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="M16 22a2 2 0 0 0 2-2V7l-5-5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9Z" />
		<path d="M12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
		<path d="M12 12v4" />
		<path d="M10 14h4" />
		<path d="M7 2v5h5" />
	</svg>
);
// #endregion

// #region CONSTANT DATA
/**
 * @const SERVICES_DATA
 * @description An array of service objects to be displayed in the ServicesSection.
 * This static data is used to populate the ServiceCard components, making the
 * component self-contained and independent of parent props.
 */
const SERVICES_DATA: Readonly<Service[]> = [
	{
		id: 'wash-and-fold',
		icon: <WashingMachineIcon />,
		title: 'Wash & Fold',
		description: 'Perfect for everyday laundry. We wash, dry, and fold your clothes with meticulous care, ready for your closet.',
	},
	{
		id: 'ironing-service',
		icon: <IronIcon />,
		title: 'Press & Ironing',
		description: 'Get sharp, wrinkle-free clothes with our professional pressing and ironing service for all types of garments.',
	},
	{
		id: 'dry-cleaning',
		icon: <DryCleaningIcon />,
		title: 'Dry Cleaning',
		description: 'Specialized care for your delicate fabrics. Our eco-friendly dry cleaning process keeps your finest clothes pristine.',
	},
];
// #endregion

// #region ANIMATION VARIANTS
const sectionVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.5,
			when: 'beforeChildren',
			staggerChildren: 0.2,
		},
	},
};

const headingVariants: Variants = {
	hidden: { y: -20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			duration: 0.6,
			ease: 'easeOut',
		},
	},
};

const cardVariants: Variants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			duration: 0.5,
			ease: 'easeOut',
		},
	},
};
// #endregion

// #region ERROR BOUNDARY FALLBACK
/**
 * A fallback component to be rendered if an error occurs within the service grid.
 * It provides a user-friendly message and a way to retry the render.
 * @param {FallbackProps} props - The props provided by `react-error-boundary`, including `error` and `resetErrorBoundary`.
 * @returns {JSX.Element} A simple error message UI.
 */
const ServicesErrorFallback = ({ error, resetErrorBoundary }: FallbackProps): JSX.Element => (
	<div role="alert" className="max-w-2xl mx-auto p-6 bg-red-50 border border-red-300 rounded-lg text-center">
		<h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
		<p className="mt-1 text-sm text-red-700">We couldn't display our services at the moment. Please try again.</p>
		<pre className="mt-4 p-3 bg-red-100 text-red-900 rounded-md text-xs text-left whitespace-pre-wrap">{error.message}</pre>
		<button
			onClick={resetErrorBoundary}
			className="mt-6 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
		>
			Try again
		</button>
	</div>
);
// #endregion

// #region MAIN COMPONENT
/**
 * @component ServicesSection
 * @description A section component that displays a grid of available services.
 * It uses a static, self-contained data source (`SERVICES_DATA`) and requires no props.
 * Each service is rendered using the `ServiceCard` component. The entire grid
 * is wrapped in an ErrorBoundary to ensure robustness.
 * The section and its contents are animated using Framer Motion to appear on scroll.
 *
 * @returns {JSX.Element} The rendered services section.
 *
 * @example
 * <ServicesSection />
 */
const ServicesSection = (): JSX.Element => {
	return (
		<motion.section
			className="bg-gray-50 py-16 sm:py-20 lg:py-24"
			variants={sectionVariants as Variants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.3 }}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div className="text-center" variants={headingVariants as Variants}>
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Our Services
					</h2>
				</motion.div>
				<div className="mt-12">
					<ErrorBoundary FallbackComponent={ServicesErrorFallback}>
						<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
							{SERVICES_DATA.map(service => (
								<motion.div key={service.id} variants={cardVariants as Variants}>
									<ServiceCard
									/>
								</motion.div>
							))}
						</div>
					</ErrorBoundary>
				</div>
			</div>
		</motion.section>
	);
};

export default memo(ServicesSection);