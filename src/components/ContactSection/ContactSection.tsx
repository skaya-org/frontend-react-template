import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion'; // Import Variants

// Import the ContactForm component as specified.
// This component is assumed to be self-fulfilled and requires no props.
import ContactForm from '../ContactForm/ContactForm';

// --- CONSTANT DATA ---

/**
 * @typedef {Object} SocialLink - Represents a social media link.
 * @property {string} name - The name of the social media platform (e.g., "Facebook").
 * @property {string} url - The URL to the social media profile.
 * @property {JSX.Element} icon - The SVG icon for the social media platform.
 */

/**
 * Constant data for the contact information section.
 * All contact details, including address, phone, email, and social media links,
 * are hardcoded as per the requirements to avoid props.
 * The data is deeply frozen to ensure immutability.
 *
 * @type {Readonly<{
 *   address: string;
 *   phone: string;
 *   email: string;
 *   socialLinks: ReadonlyArray<{ name: string; url: string; icon: JSX.Element }>;
 * }>}
 */
const CONTACT_INFO = Object.freeze({
  address: "123 Dev Street, TypeScript City, TS 12345",
  phone: "+1 (555) 987-6543",
  email: "contact@procomponents.com",
  socialLinks: Object.freeze([
    {
      name: "Facebook",
      url: "https://facebook.com/exampleprocomponents",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white hover:text-blue-600 transition-colors duration-300"
        >
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.815c-3.235 0-4.185 1.508-4.185 4v2.667z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      url: "https://twitter.com/exampleprocomponents",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white hover:text-blue-400 transition-colors duration-300"
        >
          <path d="M22.46 6c-.77.34-1.6.56-2.46.66.89-.53 1.57-1.37 1.89-2.37-.83.49-1.75.84-2.73 1.02-1.8-1.92-4.7-2.32-6.6.6-1.5 2.2-1 5.3 1 7.2-4.5.1-8.5-2.4-11.2-6.5C3.3 6 2.5 7.6 2.5 9.4c0 3.2 1.6 6 4.3 7.6-.7-.03-1.4-.2-2-.5v.1c0 3 2.1 5.4 4.8 6-.5.1-1.1.2-1.7.2-.4 0-.7 0-1.1-.1 1.2 3.8 4.7 6.5 8.9 6.6-4.2 3.3-9.5 5.2-15.3 5.2-.9 0-1.8 0-2.7-.1 5.5 3.5 12 5.5 19 5.5 22.8 0 35.3-18.9 35.3-35.3 0-.5 0-1-.1-1.5.8-.6 1.5-1.3 2.1-2.1z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/exampleprocomponents",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white hover:text-blue-700 transition-colors duration-300"
        >
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ]),
});

// --- ERROR BOUNDARY COMPONENT ---

/**
 * @interface ErrorBoundaryProps - Props for the ErrorBoundary component.
 * @property {React.ReactNode} children - The child components to be wrapped by the error boundary.
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * @interface ErrorBoundaryState - State for the ErrorBoundary component.
 * @property {boolean} hasError - Indicates if an error has occurred in the wrapped children.
 */
interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * ErrorBoundary is a React class component that catches JavaScript errors anywhere
 * in its child component tree, logs those errors, and displays a fallback UI.
 * This prevents the entire application from crashing due to errors in a specific subtree.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Initializes the error boundary state.
   * @param {ErrorBoundaryProps} props - The properties passed to the component.
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * getDerivedStateFromError is a static lifecycle method that is invoked
   * after an error has been thrown by a descendant component.
   * It returns an object to update state, signaling that an error has occurred.
   * @param {Error} error - The error that was thrown.
   * @returns {ErrorBoundaryState} The updated state to indicate an error.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    console.error("ErrorBoundary: Caught an error within a child component:", error);
    return { hasError: true };
  }

  /**
   * componentDidCatch is a lifecycle method that is invoked after an error
   * has been thrown by a descendant component. It's used for logging error information.
   * @param {Error} error - The error that was thrown.
   * @param {React.ErrorInfo} errorInfo - An object containing `componentStack` information
   *                                      about where the error occurred in the component tree.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary: Detailed error information:", error, errorInfo);
  }

  /**
   * Renders the children components if no error has occurred,
   * otherwise renders a fallback UI.
   * @returns {JSX.Element} The rendered component tree or fallback UI.
   */
  render(): JSX.Element {
    if (this.state.hasError) {
      // Fallback UI for when an error is caught.
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">Something went wrong loading this section. Please try again later.</span>
          <p className="text-sm mt-2">We apologize for the inconvenience.</p>
        </div>
      );
    }
    return this.props.children as JSX.Element;
  }
}

// --- FRAMER MOTION VARIANTS ---

// Variants for the main section container
const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

// Variants for the main heading
const headingVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } },
};

// Variants for the Contact Information Block (refactored from direct props)
const contactInfoBlockVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Variants for the Contact Form Block (refactored from direct props)
const contactFormBlockVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } },
};

// Variants for the container of social links to stagger children
const socialLinksContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between each social link animation
      delayChildren: 0.8, // Delay the start of the social links animation after their parent block appears
    },
  },
};

// Variants for individual social links
const socialLinkItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
};


// --- MAIN REACT COMPONENT ---

/**
 * `ContactSection` component.
 *
 * This component represents the final section of a homepage, designed to provide contact information
 * and an interactive contact form.
 *
 * It displays static contact details such as address, phone number, email,
 * and links to social media profiles. All this information is sourced from
 * internally defined, constant data.
 *
 * The `ContactForm` component, imported from "../ContactForm/ContactForm", is
 * integrated into this section. As per requirements, the `ContactForm` is expected
 * to be self-sufficient and does not receive any props from `ContactSection`.
 *
 * An `ErrorBoundary` is wrapped around the `ContactForm` to gracefully handle
 * any potential rendering errors within the form component, ensuring the rest
 * of the application remains functional.
 *
 * This component does not accept any props from its parent, adhering to the
 * strict guideline of using constant data internally.
 *
 * @returns {JSX.Element} The rendered `ContactSection` component.
 */
const ContactSection = (): JSX.Element => {
  return (
    <motion.section
      id="contact"
      className="py-20 bg-gradient-to-br from-gray-900 via-zinc-900 to-black text-white"
      variants={sectionVariants as Variants} // Apply section variants
      initial="hidden" // Start hidden
      whileInView="visible" // Animate when in view
      viewport={{ once: true, amount: 0.2 }} // Trigger when 20% of section is visible
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.h2
          className="text-6xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg"
          variants={headingVariants as Variants} // Apply heading variants
          initial="hidden" // Start hidden
          whileInView="visible" // Animate when in view
          viewport={{ once: true, amount: 0.5 }} // Trigger when 50% of heading is visible
        >
          Connect With Us
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Contact Information Block */}
          <motion.div
            variants={contactInfoBlockVariants as Variants} // Apply contact info block variants
            initial="hidden" // Start hidden
            whileInView="visible" // Animate when in view
            viewport={{ once: true, amount: 0.3 }} // Trigger when 30% of block is visible
            className="bg-gray-800 p-10 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm bg-opacity-70"
          >
            <h3 className="text-4xl font-bold mb-8 text-purple-300">Our Details</h3>
            <div className="space-y-6">
              <p className="text-lg flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 mr-4 text-purple-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.727A8 8 0 016.343 7.273L17.657 16.727zm0 0L20 19l-2.343 2.343a4 4 0 01-5.656 0L12 19l2.343-2.343zM12 21a9 9 0 100-18 9 9 0 000 18z"
                  />
                </svg>
                <span className="break-words">{CONTACT_INFO.address}</span>
              </p>
              <p className="text-lg flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 mr-4 text-purple-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684L10.5 9.257m11.16-6.364A2 2 0 0121 4.777v14.446a2 2 0 01-2.16.89L13.5 14.743m11.16-6.364l-2.43 2.43c-1.808 1.808-5.32 2.682-8.485 1.705L3 5"
                  />
                </svg>
                <span className="break-words">{CONTACT_INFO.phone}</span>
              </p>
              <p className="text-lg flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 mr-4 text-purple-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 4v7a2 2 0 002 2h14a2 2 0 002-2v-7"
                  />
                </svg>
                <span className="break-words">{CONTACT_INFO.email}</span>
              </p>
            </div>

            <h4 className="text-3xl font-bold mt-10 mb-6 text-purple-300">Find Us Online</h4>
            <motion.div
              className="flex space-x-8 justify-center md:justify-start"
              variants={socialLinksContainerVariants as Variants} // Apply container variants for stagger
              initial="hidden" // Start hidden
              whileInView="visible" // Animate when in view
              viewport={{ once: true, amount: 0.3 }} // Trigger when 30% of parent is visible
            >
              {CONTACT_INFO.socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${link.name} profile`}
                  className="hover:scale-125 transform transition-transform duration-300"
                  variants={socialLinkItemVariants as Variants} // Apply item variants for individual links
                >
                  {link.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Contact Form Block */}
          <motion.div
            variants={contactFormBlockVariants as Variants} // Apply contact form block variants
            initial="hidden" // Start hidden
            whileInView="visible" // Animate when in view
            viewport={{ once: true, amount: 0.3 }} // Trigger when 30% of block is visible
            className="bg-gray-800 p-10 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm bg-opacity-70"
          >
            <h3 className="text-4xl font-bold mb-8 text-purple-300">Send Us a Message</h3>
            {/* Wrap ContactForm with an ErrorBoundary for robust error handling */}
            <ErrorBoundary>
              <ContactForm />
            </ErrorBoundary>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection;