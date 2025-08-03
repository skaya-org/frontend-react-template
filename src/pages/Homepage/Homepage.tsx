import React, { useState, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import StudentDashboard from 'src/components/StudentDashboard/StudentDashboard';
import TeacherDashboard from 'src/components/TeacherDashboard/TeacherDashboard';
import ParentDashboard from 'src/components/ParentDashboard/ParentDashboard';
import LoginFormWithBoundary from 'src/components/LoginForm/LoginForm';

// According to the instructions, these child components are self-contained and use constant data.
// They are imported from the specified paths.
// To enable the required interactivity, it's assumed that LoginForm accepts an `onLogin`
// callback prop to communicate the login event and selected role back to this parent component.
// This is a standard React pattern for child-to-parent communication.

// Defines the possible user roles for type safety and clarity.
type UserRole = 'student' | 'teacher' | 'parent';

/**
 * Defines the animation variants for the main content containers (Login and Dashboard).
 * This creates a subtle fade and slide-up effect on enter, and the reverse on exit.
 */
const containerVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99] // A gentle easing curve
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

/**
 * GamifiedDashboard serves as the main application component and root container.
 * It orchestrates the application's view by managing user authentication state.
 * It renders the LoginForm initially and, upon a successful login, conditionally
 * displays the appropriate dashboard with a smooth transition.
 */
const GamifiedDashboard = (): JSX.Element => {
  // State to track whether a user is currently logged in.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // State to store the role of the authenticated user.
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  /**
   * Callback function passed to the LoginForm component.
   * It updates the state to reflect a successful user login, setting the
   * authentication status and the user's role.
   * @param {UserRole} role The role selected during the login process.
   */
  const handleLogin = (role: UserRole): void => {
    setIsLoggedIn(true);
    setUserRole(role);
  };


  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 antialiased">
      {/* AnimatePresence handles the mounting and unmounting animations. */}
      {/* 'mode="wait"' ensures the exiting component finishes its animation before the new one enters. */}

      <AnimatePresence mode="wait">
          <motion.div
            // The key is crucial for AnimatePresence to track which component is which.
            // Using the userRole ensures a re-render if the role were to change.
            key={userRole}
            variants={containerVariants as Variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full" // Ensure dashboard container takes full width
          >
                <StudentDashboard />
    <TeacherDashboard/>
    <ParentDashboard />
          </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default GamifiedDashboard;