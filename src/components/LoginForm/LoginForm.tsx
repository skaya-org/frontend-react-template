import React, { useState, useCallback, FormEvent, ChangeEvent, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// --- CONSTANTS & TYPES ---

/**
 * @type {('Student' | 'Teacher' | 'Parent')}
 * @description Defines the possible user roles.
 */
type Role = 'Student' | 'Teacher' | 'Parent';

/**
 * @const {Role[]} ROLES
 * @description An array of available user roles for the login form.
 * This constant ensures the component is self-contained and doesn't require props for its options.
 */
const ROLES: Role[] = ['Student', 'Teacher', 'Parent'];

// --- ERROR BOUNDARY FALLBACK COMPONENT ---

/**
 * A fallback component to be displayed by the ErrorBoundary if a critical error occurs.
 * @param {object} props - The component props.
 * @param {Error} props.error - The error that was caught.
 * @returns {JSX.Element} A user-friendly error message UI.
 */
const LoginErrorFallback = ({ error }: { error: Error }): JSX.Element => (
    <div className="flex flex-col justify-center items-center h-screen bg-red-100 text-red-900 font-mono p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
        <p className="text-xl max-w-xl">
            We encountered an unexpected issue with the login form. Please try refreshing the page.
        </p>
        <pre className="mt-5 bg-black/5 text-red-900 p-3 rounded-md text-left text-sm">
            {error.message}
        </pre>
    </div>
);


// --- MAIN COMPONENT ---

/**
 * A self-contained, stateful user login form.
 * It handles user input for username and password, role selection,
 * form submission, loading states, and basic validation without requiring any props.
 * @returns {JSX.Element} The rendered login form component.
 */
const LoginForm = (): JSX.Element => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<Role>(ROLES[0]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // --- Animation Variants ---

    const formContainerVariants: Variants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 100,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const formItemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 150 },
        },
    };

    const errorVariants: Variants = {
        initial: { opacity: 0, height: 0, marginBottom: 0 },
        animate: {
            opacity: 1,
            height: 'auto',
            marginBottom: '20px',
            transition: { type: 'spring', bounce: 0.3, duration: 0.4 }
        },
        exit: {
            opacity: 0,
            height: 0,
            marginBottom: 0,
            transition: { duration: 0.2 }
        },
    };

    /**
     * Handles changes in the username and password input fields.
     */
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'username') setUsername(value);
        if (name === 'password') setPassword(value);
    }, []);

    /**
     * Handles changes in role selection.
     */
    const handleRoleChange = useCallback((role: Role) => {
        setSelectedRole(role);
    }, []);
    
    /**
     * Handles the form submission process.
     * It performs basic validation and simulates an API call.
     */
    const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!username.trim() || !password.trim()) {
            setError('Username and password are required.');
            return;
        }

        setIsLoading(true);

        // Simulate an API call
        console.log('Submitting login data:', { username, password, role: selectedRole });

        setTimeout(() => {
            if (username === 'admin' && password === 'password') {
                alert(`Successfully logged in as ${username} (${selectedRole})!`);
                setUsername('');
                setPassword('');
                setSelectedRole(ROLES[0]);
            } else {
                setError('Invalid username or password.');
            }
            setIsLoading(false);
        }, 1500);

    }, [username, password, selectedRole]);

    return (
        <div className="flex justify-center items-center min-h-screen font-sans bg-gradient-to-br from-gray-50 to-gray-200 p-5">
            <motion.div
                className="w-full max-w-sm"
                variants={formContainerVariants as Variants}
                initial="hidden"
                animate="visible"
            >
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="p-10 bg-white rounded-xl shadow-xl"
                >
                    <motion.h1
                        variants={formItemVariants as Variants}
                        className="text-center text-3xl font-bold text-gray-800 mb-8"
                    >
                        Welcome Back
                    </motion.h1>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className="text-red-700 bg-red-100 border border-red-300 p-3 rounded-lg text-center text-sm"
                                variants={errorVariants as Variants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                role="alert"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div variants={formItemVariants as Variants} className="mb-6">
                        <div className="text-center text-base font-semibold text-gray-700 mb-4">Select your role:</div>
                        <div className="flex justify-around gap-2.5">
                            {ROLES.map((role) => (
                                <motion.label
                                    key={role}
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative flex-1 p-2.5 text-center border rounded-lg cursor-pointer select-none ${
                                        selectedRole === role
                                            ? 'text-white border-blue-500'
                                            : 'bg-white border-gray-300 text-gray-600'
                                    }`}
                                >
                                    {selectedRole === role && (
                                        <motion.div
                                            className="absolute inset-0 bg-blue-500 rounded-lg -z-10"
                                            layoutId="selectedRoleBackground"
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role}
                                        checked={selectedRole === role}
                                        onChange={() => handleRoleChange(role)}
                                        className="sr-only"
                                    />
                                    {role}
                                </motion.label>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={formItemVariants as Variants} className="relative mb-5">
                        <motion.input
                            whileFocus={{ scale: 1.03 }}
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={handleInputChange}
                            className="w-full py-3 px-4 text-base border border-gray-300 rounded-lg transition-colors duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                            aria-label="Username"
                            required
                        />
                    </motion.div>
                    <motion.div variants={formItemVariants as Variants} className="relative mb-5">
                        <motion.input
                            whileFocus={{ scale: 1.03 }}
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleInputChange}
                            className="w-full py-3 px-4 text-base border border-gray-300 rounded-lg transition-colors duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                            aria-label="Password"
                            required
                        />
                    </motion.div>

                    <motion.button
                        variants={formItemVariants as Variants}
                        whileHover={!isLoading ? { y: -2, scale: 1.02, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' } : {}}
                        whileTap={!isLoading ? { scale: 0.98, y: 0 } : {}}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        type="submit"
                        className="w-full py-3 mt-2 text-base font-semibold text-white bg-blue-500 rounded-lg flex justify-center items-center overflow-hidden disabled:bg-blue-300 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={isLoading ? 'loading' : 'login'}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </motion.span>
                        </AnimatePresence>
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

/**
 * A wrapper component that provides a safety net for the LoginForm.
 * It uses React's ErrorBoundary to catch and handle any rendering errors gracefully,
 * preventing the entire application from crashing.
 * @returns {JSX.Element} The LoginForm component wrapped in an ErrorBoundary.
 */
const LoginFormWithBoundary = (): JSX.Element => (
    <ErrorBoundary FallbackComponent={LoginErrorFallback}>
        <LoginForm />
    </ErrorBoundary>
);

export default LoginFormWithBoundary;