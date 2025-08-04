import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

const Footer = (): JSX.Element => {
  const currentYear: number = new Date().getFullYear();
  const companyName: string = "Your Company Name"; // Replace with your actual company name
  const socialLinks: { name: string; url: string; icon: string; }[] = [
    { name: 'Facebook', url: 'https://facebook.com/yourcompany', icon: 'f' },
    { name: 'Twitter', url: 'https://twitter.com/yourcompany', icon: 't' },
    { name: 'Instagram', url: 'https://instagram.com/yourcompany', icon: 'i' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/yourcompany', icon: 'l' },
  ];

  // Variants for the overall footer container (the <motion.footer> tag)
  const footerContainerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        when: "beforeChildren", // Animate parent first, then children
        staggerChildren: 0.2, // Stagger the direct children of the <motion.footer>
      },
    },
  };

  // Variants for the inner content container (the div holding copyright and social links)
  // This div itself will animate, and then trigger the stagger of its children.
  const innerFlexContainerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.15, // Stagger copyright text and social links container
      },
    },
  };

  // Variants for individual items like the copyright text
  const itemFadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Variants for the social media links *container*
  // This container needs to animate itself AND stagger its children (individual links).
  const socialLinksContainerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1, // Stagger the individual social links
      },
    },
  };

  // Variants for individual social media links (for their initial staggered appearance and hover effect)
  const socialLinkItemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.1, color: "#fff", transition: { duration: 0.2 } }, // Combined hover effect
  };

  // socialLinkHoverVariants is no longer needed as a separate constant, its properties are merged into socialLinkItemVariants.

  return (
    <motion.footer
      className="bg-gray-900 text-gray-400 py-8"
      variants={footerContainerVariants as Variants}
      initial="hidden"
      // Animate when the component scrolls into view
      // `once: true` ensures the animation plays only once
      // `amount: 0.6` means it triggers when 60% of the footer is visible
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0"
          variants={innerFlexContainerVariants as Variants}
          // `innerFlexContainerVariants` will implicitly receive its 'visible' state
          // from the `footerContainerVariants`'s `staggerChildren` property.
        >
          {/* Copyright Information */}
          <motion.p
            className="text-sm"
            variants={itemFadeInUpVariants as Variants}
            // This will implicitly receive its 'visible' state
            // from the `innerFlexContainerVariants`'s `staggerChildren` property.
          >
            &copy; {currentYear} {companyName}. All rights reserved.
          </motion.p>

          {/* Social Media Links Container */}
          <motion.div
            className="flex space-x-4"
            variants={socialLinksContainerVariants as Variants}
            // This will implicitly receive its 'visible' state
            // from the `innerFlexContainerVariants`'s `staggerChildren` property.
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-lg"
                aria-label={link.name}
                variants={socialLinkItemVariants as Variants} // Apply individual item entry and hover animation
                whileHover="hover" // Refers to the 'hover' state within socialLinkItemVariants
                // This will implicitly receive its 'visible' state
                // from the `socialLinksContainerVariants`'s `staggerChildren` property.
              >
                {/* For production, consider using SVG icons (e.g., Heroicons, Font Awesome) instead of text */}
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;