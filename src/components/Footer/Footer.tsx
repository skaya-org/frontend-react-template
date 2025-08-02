import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// Icon components defined for clarity and reusability within the footer.
// Using `fill="currentColor"` allows the SVG to inherit its color from the parent's `text-` class.

export interface SocialLink {
  name: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

const socialLinks: SocialLink[] = [
  {
    name: 'Twitter',
    href: '#',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.931ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: '#',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'Dribbble',
    href: '#',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10c5.523 0 10-4.477 10-10S17.523 2 12 2zm6.604 7.461c-1.13 2.64-3.14 4.862-5.744 6.326a.75.75 0 01-.99-.226c-.322-.444-.4-1.01-.216-1.528.11-.308.243-.608.394-.9.41-1.018.664-2.1.722-3.21.05-.938-.036-1.87-.25-2.758a.75.75 0 01.32-.82c.243-.16.547-.18.81-.073.8.324 1.563.76 2.26 1.3.125.097.24.203.35.316.71.69 1.28 1.49 1.7 2.38.16.34.3.7.42 1.06a.75.75 0 01-.686.924zm-4.148 7.37c1.19-.943 2.24-2.027 3.1-3.25.3-.42.57-.86.8-1.32.413-1.093.633-2.28.6-3.48-.024-.913-.18-1.815-.45-2.674a.75.75 0 00-.73-.593c-.35.03-.65.23-.79.54-.53 1.15-1.28 2.18-2.2 3.06-.96.92-2.06 1.68-3.25 2.27a.75.75 0 00-.5 1.1c.18.31.5.5.86.5.38 0 .76-.1 1.13-.29.8-.4 1.55-.9 2.23-1.49zM8.32 3.832a.75.75 0 01.8-.4c.33.06.6.3.75.58.82 1.5 1.33 3.1 1.48 4.75.12.98.1 1.97-.04 2.94-.13.92-.38 1.83-.75 2.68a.75.75 0 01-1.01.52c-.37-.15-.6-.5-.6-.9.02-.45.03-.9.02-1.36-.08-2.14-.54-4.23-1.35-6.15a.75.75 0 01.7-1.06z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

const Footer = (): JSX.Element => {
  // Main container variant: animates the footer into view and orchestrates child animations.
  const footerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
        staggerChildren: 0.2, // Animates children one by one with a 0.2s delay.
      },
    },
  };

  // Item variant for direct children (socials and copyright).
  // They inherit the stagger from the parent and have their own slide-up/fade-in animation.
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  return (
    <motion.footer
      className="bg-slate-50 dark:bg-slate-900"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }} // Trigger animation when 40% of the footer is visible.
    >
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        {/* The social links container is the first animated item. */}
        <motion.div
          className="flex justify-center space-x-6 md:order-2"
          variants={itemVariants as Variants}
        >
          {socialLinks.map((item) => (
            // Each individual link has an interactive hover effect.
            <motion.a
              key={item.name}
              href={item.href}
              className="text-slate-400 transition-colors duration-300 hover:text-slate-500 dark:hover:text-slate-300"
              whileHover={{ scale: 1.2, y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </motion.a>
          ))}
        </motion.div>
        {/* The copyright text container is the second animated item. */}
        <motion.div
          className="mt-8 md:order-1 md:mt-0"
          variants={itemVariants as Variants}
        >
          <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400 md:text-left">
            &copy; {new Date().getFullYear()} Acme Corporation. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;