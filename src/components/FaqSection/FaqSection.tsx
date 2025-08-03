import React, { JSX, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, Variants } from 'framer-motion';
import FaqItem from '../FaqItem/FaqItem';

/**
 * @typedef Faq
 * @description Defines the structure for a single Frequently Asked Question item.
 * This type ensures that all FAQ data adheres to a consistent format.
 * @property {string} id - A unique identifier for the FAQ item, used for React keys.
 * @property {string} question - The question text.
 * @property {string} answer - The answer text.
 */
type Faq = {
  id: string;
  question: string;
  answer: string;
};

/**
 * @const FAQ_DATA
 * @description A constant array of FAQ items. This self-contained data source
 * allows the component to be used without passing any props, simplifying its integration
 * and ensuring consistency across the application.
 */
const FAQ_DATA: Readonly<Faq[]> = [
  {
    id: 'faq-1',
    question: 'What is the "One-Click Deploy" feature?',
    answer:
      'Our "One-Click Deploy" feature streamlines the deployment process by allowing you to publish your web application to a production environment with a single action. It automates the build, testing, and deployment pipeline, saving you time and reducing the risk of manual errors.',
  },
  {
    id: 'faq-2',
    question: 'Do you offer a free trial for your services?',
    answer:
      'Yes, we offer a 14-day free trial with no credit card required. During the trial, you have access to all our premium features, allowing you to fully evaluate our platform and see how it fits your workflow.',
  },
  {
    id: 'faq-3',
    question: 'What kind of support can I expect?',
    answer:
      'We provide 24/7 premium support through email and live chat for all our paid plans. Our dedicated support team is composed of experienced developers ready to help you with any technical challenges. Free plan users have access to our extensive documentation and community forums.',
  },
  {
    id: 'faq-4',
    question: 'Can I integrate my existing tools with your platform?',
    answer:
      'Absolutely. Our platform is built with extensibility in mind. We offer a robust API and native integrations for popular tools like GitHub, Slack, and Jira. You can easily connect your existing CI/CD pipelines and developer tools.',
  },
  {
    id: 'faq-5',
    question: 'How is billing handled?',
    answer:
      'Billing is handled on a monthly or annual subscription basis. You can upgrade, downgrade, or cancel your plan at any time through your account dashboard. We accept all major credit cards and offer invoicing for enterprise clients.',
  },
];

/**
 * A fallback component to display when an error occurs within the FAQ list.
 * This ensures the rest of the application remains functional even if this section fails.
 * @returns {JSX.Element} A user-friendly error message.
 */
const FaqErrorFallback = (): JSX.Element => (
  <div
    role="alert"
    className="text-center rounded-lg border border-red-500 bg-red-100 px-6 py-4 text-red-700"
  >
    <p className="mb-2 font-medium">
      Oops! We couldn't load the questions.
    </p>
    <p className="m-0 text-sm">
      Please try refreshing the page. If the problem persists, our team has
      been notified.
    </p>
  </div>
);

/**
 * Renders a Frequently Asked Questions (FAQ) section.
 *
 * This component is self-contained and uses a predefined constant for its data,
 * requiring no props from its parent. It features a title and an animated list of
 * collapsible Q&A items rendered by the `FaqItem` component.
 * Proper error handling is implemented to ensure robustness.
 *
 * @component
 * @example
 * // This component requires no props.
 * <FaqSection />
 * @returns {JSX.Element} The rendered `FaqSection` component.
 */
const FaqSection = (): JSX.Element => {
  // Variants for the main container to orchestrate staggered animations for its children.
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Time delay between each child animation
        delayChildren: 0.2,   // Delay before the first child starts animating
      },
    },
  };

  // Variants for individual items (title and each FAQ item) to fade and slide in.
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.section
      aria-labelledby="faq-title"
      className="mx-auto my-16 max-w-3xl p-8 font-sans text-gray-800"
      variants={containerVariants as Variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }} // Animate when 10% of the section is in view
    >
      <motion.h2
        id="faq-title"
        className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl"
        variants={itemVariants as Variants}
      >
        Frequently Asked Questions
      </motion.h2>

      <ErrorBoundary FallbackComponent={FaqErrorFallback}>
        <Suspense fallback={<div className="text-center">Loading questions...</div>}>
          <div className="flex flex-col gap-4">
            {FAQ_DATA.map((faq) => (
              <motion.div key={faq.id} variants={itemVariants as Variants}>
                <FaqItem
                />
              </motion.div>
            ))}
          </div>
        </Suspense>
      </ErrorBoundary>
    </motion.section>
  );
};

export default FaqSection;