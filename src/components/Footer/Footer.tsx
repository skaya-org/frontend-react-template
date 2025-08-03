import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// #region TYPE DEFINITIONS
/**
 * Represents the structure for a social media link.
 * This type is used internally to ensure type safety for social link data.
 * @typedef {object} SocialLink
 * @property {string} name - The accessible name of the social media platform (e.g., "Twitter").
 * @property {string} url - The absolute URL to the company's profile on the platform.
 * @property {JSX.Element} icon - A React component (SVG) representing the platform's logo.
 */
type SocialLink = {
	readonly name: string;
	readonly url: string;
	readonly icon: JSX.Element;
};
// #endregion

// #region SVG ICONS
/**
 * A self-contained SVG icon component for Twitter (X).
 * @returns {JSX.Element} The rendered SVG icon.
 */
const TwitterIcon = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
		stroke="currentColor"
		strokeWidth="0"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM16.91 20.644h2.039L6.486 3.24H4.298l12.612 17.404z" />
	</svg>
);

/**
 * A self-contained SVG icon component for Discord.
 * @returns {JSX.Element} The rendered SVG icon.
 */
const DiscordIcon = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
		stroke="currentColor"
		strokeWidth="0"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4464.8257-.6672 1.2838-2.6143-.956-5.2777-.956-7.892 0-.2208-.4581-.4562-.9085-.6672-1.2838a.077.077 0 0 0-.0785-.0371A19.8665 19.8665 0 0 0 3.683 4.3698a.077.077 0 0 0-.0371.0914C3.8212 6.9602 4.6932 10.7383 4.6932 10.7383a1.942 1.942 0 0 0 1.8009 1.4428.815.815 0 0 0 .3753-.0785c.4581-.1492.879-.3355 1.2628-.5624a1.8495 1.8495 0 0 0 .5624-.3355c-.0785.0371-.1492.0785-.2208.1156a6.2629 6.2629 0 0 1-1.5524.7407.0741.0741 0 0 0-.0371.1156c.421.4952.879.9903 1.3741 1.4428.4581.421.9532.8047 1.4428 1.156a.0741.0741 0 0 0 .0785.0371c.421-.2208.842-.4581 1.2257-.7407a.0741.0741 0 0 0 .0371-.1156c-.0707-.0371-.1413-.0785-.212-.1156a1.824 1.824 0 0 0 .5624.3355c.3753.2208.7963.421 1.2628.5624a.8377.8377 0 0 0 .3753.0785 1.942 1.942 0 0 0 1.8009-1.4428s.872-3.7781 1.0502-6.2785a.077.077 0 0 0-.0371-.0914zM8.02 15.3312c-.7407 0-1.337-1.0148-1.337-2.2539 0-1.2391.5963-2.2539 1.337-2.2539.7779 0 1.337 1.0148 1.337 2.2539.0088 1.2391-.5591 2.2539-1.337 2.2539zm7.96 0c-.7407 0-1.337-1.0148-1.337-2.2539 0-1.2391.5963-2.2539 1.337-2.2539.7779 0 1.337 1.0148 1.337 2.2539s-.5591 2.2539-1.337 2.2539z" />
	</svg>
);

/**
 * A self-contained SVG icon component for YouTube.
 * @returns {JSX.Element} The rendered SVG icon.
 */
const YouTubeIcon = (): JSX.Element => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
		stroke="currentColor"
		strokeWidth="0"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.25,4,12,4,12,4S5.75,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.75,2,12,2,12s0,4.25,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.75,20,12,20,12,20s6.25,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.25,22,12,22,12S22,7.75,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
	</svg>
);
// #endregion

// #region ANIMATION VARIANTS
/**
 * Variants for the main footer container.
 * Controls the staggering animation of its children.
 */
const footerContainerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1,
		},
	},
};

/**
 * Variants for individual items within the footer (text and social icons).
 * Defines the entrance and hover animations.
 */
const itemVariants: Variants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: { type: 'spring', stiffness: 100 },
	},
	hover: {
		scale: 1.15,
		y: -4,
		transition: { type: 'spring', stiffness: 400, damping: 15 },
	},
};
// #endregion

// #region CONSTANT DATA
/**
 * The copyright notice for the game studio.
 * It dynamically updates the year.
 * @type {string}
 */
const COPYRIGHT_NOTICE: string = `© ${new Date().getFullYear()} Nebula Studios. All Rights Reserved.`;

/**
 * An array of social media link objects.
 * This data is constant and self-contained within the component.
 * It's marked as `readonly` to enforce immutability.
 * @type {readonly SocialLink[]}
 */
const SOCIAL_LINKS: readonly SocialLink[] = [
	{
		name: 'Twitter',
		url: 'https://twitter.com/example',
		icon: <TwitterIcon />,
	},
	{
		name: 'Discord',
		url: 'https://discord.gg/example',
		icon: <DiscordIcon />,
	},
	{
		name: 'YouTube',
		url: 'https://www.youtube.com/example',
		icon: <YouTubeIcon />,
	},
];
// #endregion

/**
 * Renders the application's standard footer.
 *
 * This component is fully self-contained, requiring no props. It displays a copyright
 * notice and a list of social media links defined as constant data. It uses
 * `framer-motion` to provide a subtle hover animation on the social icons for
 * a polished user experience, as well as a staggered entrance animation for all
 * footer elements.
 *
 * @returns {JSX.Element} The rendered footer component.
 */
const Footer = (): JSX.Element => {
	return (
		<motion.footer
			className="font-sans bg-neutral-900 text-neutral-400 px-4 py-8 flex flex-col items-center justify-center gap-6 border-t border-neutral-800 text-center"
			variants={footerContainerVariants as Variants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.8 }}
		>
			<motion.p
				className="m-0 text-sm"
				variants={itemVariants as Variants}
			>
				{COPYRIGHT_NOTICE}
			</motion.p>
			<div className="flex gap-7">
				{SOCIAL_LINKS.map((link) => (
					<motion.a
						key={link.name}
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Visit our ${link.name} page`}
						className="inline-block text-neutral-200 hover:text-white"
						variants={itemVariants as Variants}
						whileHover="hover"
					>
						{link.icon}
					</motion.a>
				))}
			</div>
		</motion.footer>
	);
};

export default Footer;