import React, { JSX } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

// ============================================================================
// #region TYPE DEFINITIONS
// ============================================================================

/**
 * @typedef {object} NavLinkItem
 * @property {string} label - The visible text for the navigation link.
 * @property {string} href - The URL path for the navigation link.
 */
type NavLinkItem = {
	label: string;
	href: string;
};

// #endregion

// ============================================================================
// #region CONSTANTS
// ============================================================================

/**
 * The text content for the logo.
 * @type {string}
 */
const LOGO_TEXT: string = 'Stellar';

/**
 * An array of navigation link objects for the main menu.
 * Each object contains a label and a destination href.
 * Using `as const` creates a readonly tuple, ensuring data integrity.
 * @type {readonly NavLinkItem[]}
 */
const NAVIGATION_LINKS = [
	{ label: 'Services', href: '/services' },
	{ label: 'Pricing', href: '/pricing' },
	{ label: 'Contact Us', href: '/contact' },
] as const;

/**
 * The configuration for the primary Call-to-Action button.
 * @type {NavLinkItem}
 */
const CTA_BUTTON: NavLinkItem = {
	label: 'Schedule Now',
	href: '/schedule',
};

// #endregion

// ============================================================================
// #region ANIMATION VARIANTS
// ============================================================================

/**
 * Framer Motion variants for the main header container.
 * Animates opacity and vertical position for a smooth entrance.
 * @type {Variants}
 */
const headerVariants: Variants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: 'easeInOut',
		},
	},
};

/**
 * Framer Motion variants for the navigation link container.
 * Creates a staggered entrance effect for its children.
 * @type {Variants}
 */
const navContainerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

/**
 * Framer Motion variants for individual navigation items.
 * Animates opacity and vertical position for each link.
 * @type {Variants}
 */
const navItemVariants: Variants = {
	hidden: { opacity: 0, y: -15 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
			ease: 'easeOut',
		},
	},
};

// #endregion

// ============================================================================
// #region COMPONENT
// ============================================================================

/**
 * Renders the main navigation header for the application.
 *
 * This component is fully self-contained, defining its own data, styles,
 * and animations. It features a logo, a list of navigation links, and a
 * prominent call-to-action button. It uses `react-router-dom`'s `NavLink`
 * for semantic navigation and active link styling, and `framer-motion`
 * for subtle, professional animations.
 *
 * As a best practice, this static and resilient component should be wrapped
 * in a React Error Boundary at a higher level in the component tree (e.g., in the main layout)
 * to handle any unexpected rendering errors gracefully.
 *
 * @returns {JSX.Element} The rendered header component.
 */
const Header = (): JSX.Element => {
	/**
	 * Determines the className for a NavLink based on its active state.
	 * @param {object} props - The properties provided by NavLink.
	 * @param {boolean} props.isActive - Whether the link is currently active.
	 * @returns {string} The computed className string for the link.
	 */
	const getNavLinkClassName = ({
		isActive,
	}: {
		isActive: boolean;
	}): string => {
		const baseClasses =
			'text-base font-medium no-underline transition-colors duration-300 ease-in-out';
		const activeClasses = 'text-blue-600';
		const inactiveClasses = 'text-gray-600 hover:text-blue-600';
		return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
	};

	return (
		<motion.header
			className="sticky top-0 z-[1000] flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4 font-sans"
			variants={headerVariants as Variants}
			initial="hidden"
			animate="visible"
			aria-label="Main Navigation"
		>
			<motion.div variants={navItemVariants as Variants}>
				<NavLink
					to="/"
					className="text-2xl font-bold text-gray-900 no-underline"
					aria-label="Homepage"
				>
					{LOGO_TEXT}
				</NavLink>
			</motion.div>

			<nav className="flex items-center gap-8">
				<motion.ul
					className="flex list-none items-center gap-6 p-0"
					variants={navContainerVariants as Variants}
					initial="hidden"
					animate="visible"
				>
					{NAVIGATION_LINKS.map((link) => (
						<motion.li
							key={link.href}
							variants={navItemVariants as Variants}
						>
							<NavLink to={link.href} className={getNavLinkClassName}>
								{link.label}
							</NavLink>
						</motion.li>
					))}
				</motion.ul>

				<motion.div variants={navItemVariants as Variants}>
					<NavLink
						to={CTA_BUTTON.href}
						className="inline-block rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white no-underline transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105 active:scale-100"
					>
						{CTA_BUTTON.label}
					</NavLink>
				</motion.div>
			</nav>
		</motion.header>
	);
};

export default Header;
// #endregion