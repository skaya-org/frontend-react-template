import React, { useState, useCallback, FormEvent, ChangeEvent, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// It's a good practice to define and export interfaces so they can be reused by parent components.

/**
 * @interface ContactFormData
 * @description Defines the structure for the data captured by the contact form.
 * This can be imported by parent components to type the data they receive from the `onSubmit` callback.
 */
export interface ContactFormData {
  /** The full name of the person submitting the form. */
  name: string;
  /** The email address for correspondence. */
  email: string;
  /** The message content. */
  message: string;
}

/**
 * @interface ContactFormProps
 * @description Defines the props accepted by the ContactForm component.
 */
export interface ContactFormProps {
  /**
   * The main heading for the contact form section.
   * @default 'Get in Touch'
   */
  title?: string;
  /**
   * A descriptive text displayed below the title to provide context.
   * @default 'We would love to hear from you. Please fill out this form.'
   */
  description?: string;
  /**
   * An asynchronous function to handle the form submission.
   * It receives the validated form data and should return a promise that resolves with a success message
   * or rejects with an error. This is the only required prop.
   * @param data The form data object.
   * @returns A promise that resolves to a success message string or rejects with an error.
   */
  onSubmit: (data: ContactFormData) => Promise<string>;
  /**
   * Optional initial data to pre-fill the form fields. Useful for editing scenarios.
   * @default { name: '', email: '', message: '' }
   */
  initialData?: Partial<ContactFormData>;
  /**
   * Optional CSS class name for custom styling of the root element.
   */
  className?: string;
  /**
   * The ID for the root element, useful for accessibility and linking (e.g., `<a href="#contact">`).
   */
  id?: string;
}

/**
 * @type FormStatus
 * @description Represents the possible states of the form submission process.
 */
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * @type FormErrors
 * @description A mapped type to hold potential validation errors for each form field.
 */
type FormErrors = Partial<Record<keyof ContactFormData, string>>;

/**
 * A simple fallback component to display when the form encounters an unrecoverable error.
 * @param {object} props - The component props.
 * @param {Error} props.error - The error that was caught by the ErrorBoundary.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const FormErrorFallback = ({ error }: { error: Error }): JSX.Element => (
  <div role="alert" className="p-5 border border-red-500 rounded-lg bg-red-50 text-red-700">
    <h3 className="mt-0 text-lg font-semibold">Oops! Something went wrong.</h3>
    <p>We encountered an issue with our contact form. Please try refreshing the page.</p>
    <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap break-all">
      Error: {error.message}
    </pre>
  </div>
);


/**
 * A declarative configuration for the form fields. This makes the form
 * easy to extend and maintain without cluttering the JSX.
 */
const formFieldsConfig = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', autoComplete: 'name' },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john.doe@example.com', autoComplete: 'email' },
  { name: 'message', label: 'Your Message', type: 'textarea', placeholder: 'How can we help you?', autoComplete: 'off' },
] as const; // `as const` ensures `name` is a literal type, not just string

// == Animation Variants ==
// Using variants centralizes animation definitions, making them reusable and easier to manage.

/** Staggered container for the entire section. Animates when it enters the viewport. */
const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

/** For individual items (header, form fields, button) that will be staggered. */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/** For animated appearance/disappearance of field-level error messages. */
const errorVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    marginTop: '0.375rem', // Corresponds to mt-1.5
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/** For the form-level status message (success or error). */
const statusMessageVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: 'easeIn' } },
};

/**
 * @component ContactForm
 * @description A comprehensive, production-grade contact form component.
 * It handles state management, validation, submission, and provides clear feedback to the user.
 * Wrapped in an ErrorBoundary for robustness.
 *
 * @example
 * const handleSubmit = async (data) => {
 *   // API call to your backend
 *   console.log(data);
 *   return "Message sent successfully!";
 * };
 *
 * <ContactForm onSubmit={handleSubmit} />
 *
 * @param {ContactFormProps} props - The props for the component.
 * @returns {JSX.Element} The rendered ContactForm component.
 */
const ContactForm = (props: ContactFormProps): JSX.Element => {
  // == Props Destructuring & Default Values ==
  const {
    title = 'Get in Touch',
    description = 'We would love to hear from you. Please fill out this form.',
    onSubmit,
    initialData,
    className = '',
    id,
  } = props;

  // == State Management ==
  const [formData, setFormData] = useState<ContactFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    message: initialData?.message || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // == Event Handlers ==
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  }, [errors]);

  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }
    return newErrors;
  }, [formData]);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('idle');
      return;
    }

    try {
      const successMessage = await onSubmit(formData);
      setStatus('success');
      setStatusMessage(successMessage || 'Form submitted successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setStatusMessage(errorMessage);
    }
  }, [formData, onSubmit, validateForm]);


  // == Render Logic ==
  const inputClasses = `w-full px-4 py-3 bg-white border rounded-md text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200`;
  const normalInputClasses = `border-gray-300 focus:border-blue-500 focus:ring-blue-500`;
  const errorInputClasses = `border-red-500 focus:border-red-500 focus:ring-red-500`;

  return (
    <ErrorBoundary FallbackComponent={FormErrorFallback}>
      <motion.section
        id={id}
        className={`font-sans max-w-2xl my-10 mx-auto p-10 bg-white rounded-xl shadow-xl ${className}`}
        variants={sectionVariants as Variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.header
          className="mb-8 text-center"
          variants={itemVariants as Variants}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          {description && <p className="text-base text-gray-500">{description}</p>}
        </motion.header>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          {formFieldsConfig.map((field) => (
            <motion.div
              key={field.name}
              className="flex flex-col"
              variants={itemVariants as Variants}
            >
              <label htmlFor={field.name} className="mb-2 font-semibold text-gray-700">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  rows={5}
                  className={`${inputClasses} min-h-[120px] resize-y ${errors[field.name] ? errorInputClasses : normalInputClasses}`}
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={`${field.name}-error`}
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  required
                  className={`${inputClasses} ${errors[field.name] ? errorInputClasses : normalInputClasses}`}
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={`${field.name}-error`}
                />
              )}
              <AnimatePresence>
                {errors[field.name] && (
                  <motion.p
                    id={`${field.name}-error`}
                    className="text-sm text-red-600"
                    variants={errorVariants as Variants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {errors[field.name]}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          <AnimatePresence>
            {statusMessage && (
              <motion.div
                className={`p-3 my-2 rounded-md text-center font-medium ${
                  status === 'success' ? 'bg-green-100 text-green-800'
                  : status === 'error' ? 'bg-red-100 text-red-800' : ''
                }`}
                role="alert"
                variants={statusMessageVariants as Variants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {statusMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants as Variants}>
            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              className={`w-full py-3 px-6 rounded-md font-bold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  status === 'submitting'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                }`}
              whileHover={{ scale: status !== 'submitting' ? 1.05 : 1 }}
              whileTap={{ scale: status !== 'submitting' ? 0.95 : 1 }}
              transition={{ duration: 0.15 }}
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </motion.button>
          </motion.div>
        </form>
      </motion.section>
    </ErrorBoundary>
  );
};


export default ContactForm;