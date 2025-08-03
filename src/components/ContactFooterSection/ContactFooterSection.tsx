import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// #region TYPE DEFINITIONS
/**
 * @typedef {object} SocialLink
 * @property {string} name - The display name of the social media platform (e.g., "GitHub").
 * @property {string} url - The absolute URL to the user's profile on the platform.
 * @property {JSX.Element} icon - The SVG icon representing the social media platform.
 */
type SocialLink = {
	name: string;
	url: string;
	icon: JSX.Element;
};
// #endregion

// #region DATA AND CONFIGURATION
/**
 * A record mapping social media platform names to their respective SVG icons.
 * This allows for easy extension with new social media links.
 * @const
 * @type {Record<string, JSX.Element>}
 */
const ICONS: Record<string, JSX.Element> = {
	github: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.397.1 2.65.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.578.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
			/>
		</svg>
	),
	linkedin: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
		</svg>
	),
	twitter: (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.727-.666 1.581-.666 2.477 0 1.61.82 3.027 2.053 3.863-.764-.024-1.482-.234-2.11-.583v.06c0 2.256 1.605 4.14 3.737 4.568-.39.106-.803.163-1.227.163-.3 0-.593-.028-.877-.082.593 1.85 2.303 3.198 4.338 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.063 1.323 4.522 2.092 7.14 2.092 8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.604.91-.658 1.7-1.47 2.323-2.41z" />
		</svg>
	),
};

/**
 * Hardcoded contact information.
 * @const
 * @type {{email: string, phone: string}}
 */
const CONTACT_INFO = {
	email: 'inquiry@productiongrade.dev',
	phone: '+1 (555) 987-6543',
};

/**
 * An array of social media link objects.
 * Each object conforms to the `SocialLink` type.
 * @const
 * @type {SocialLink[]}
 */
const SOCIAL_LINKS: SocialLink[] = [
	{
		name: 'GitHub',
		url: 'https://github.com/your-org',
		icon: ICONS.github,
	},
	{
		name: 'LinkedIn',
		url: 'https://linkedin.com/company/your-company',
		icon: ICONS.linkedin,
	},
	{
		name: 'Twitter',
		url: 'https://twitter.com/your-handle',
		icon: ICONS.twitter,
	},
];

/**
 * The name of the copyright holder.
 * @const
 * @type {string}
 */
const COPYRIGHT_HOLDER = 'ProductionGrade Components Inc.';
// #endregion

// #region ANIMATION VARIANTS
/**
 * Framer Motion variants for the main footer container animation.
 * The container fades in and orchestrates its children's animations.
 * @const
 * @type {Variants}
 */
const footerContainerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.5,
			ease: 'easeOut',
			when: 'beforeChildren',
			staggerChildren: 0.2,
		},
	},
};

/**
 * Framer Motion variants for individual child elements.
 * Each item fades and slides in from below.
 * @const
 * @type {Variants}
 */
const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: 'easeOut' },
	},
};

/**
 * Framer Motion hover and tap animations for social icons.
 * Provides clear visual feedback on interaction.
 * @const
 */
const socialIconInteraction = {
	whileHover: { scale: 1.2, y: -2, color: '#FFFFFF' },
	whileTap: { scale: 0.9 },
};
// #endregion

/**
 * A self-contained footer component for contact information and social links.
 * It uses hardcoded constant data, requires no props, and includes subtle animations.
 *
 * @component
 * @returns {JSX.Element} The rendered footer section.
 */
const ContactFooterSection = (): JSX.Element => {
	const currentYear = new Date().getFullYear();

	return (
		<motion.footer
			className="bg-gray-900 text-gray-400 py-16 px-8 font-sans leading-relaxed"
			variants={footerContainerVariants as Variants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.3 }}
		>
			<div className="max-w-7xl mx-auto flex flex-col gap-12">
				<div className="flex flex-wrap justify-between gap-12 pb-12 border-b border-gray-700">
					{/* Contact Information Block */}
					<motion.div
						className="flex-1 min-w-[300px]"
						variants={itemVariants as Variants}
					>
						<h3 className="text-gray-50 text-lg font-semibold mb-6">
							Get in Touch
						</h3>
						<a
							href={`mailto:${CONTACT_INFO.email}`}
							className="block mb-2 transition-colors duration-300 ease-in-out hover:text-gray-50"
						>
							{CONTACT_INFO.email}
						</a>
						<p>{CONTACT_INFO.phone}</p>
					</motion.div>

					{/* Social Media Links Block */}
					<motion.div
						className="flex-1 min-w-[300px]"
						variants={itemVariants as Variants}
					>
						<h3 className="text-gray-50 text-lg font-semibold mb-6">
							Follow Us
						</h3>
						<div className="flex gap-6">
							{SOCIAL_LINKS.map((link) => (
								<motion.a
									key={link.name}
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Visit our ${link.name} page`}
									className="text-gray-400"
									{...socialIconInteraction}
								>
									{link.icon}
								</motion.a>
							))}
						</div>
					</motion.div>
				</div>

				{/* Copyright Notice */}
				<motion.div
					className="text-center text-sm"
					variants={itemVariants as Variants}
				>
					<p>
						&copy; {currentYear} {COPYRIGHT_HOLDER}. All Rights Reserved.
					</p>
				</motion.div>
			</div>
		</motion.footer>
	);
};

export default ContactFooterSection;