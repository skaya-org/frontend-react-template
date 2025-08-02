import React from 'react';
import { motion, Variants } from 'framer-motion';

// --- Animation Variants ---
// We define variants outside the component for performance.

// The main container variant will orchestrate the staggering of its children.
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1, // Stagger the animation of children by 0.1s
      delayChildren: 0.2,   // Wait 0.2s before starting the children animations
    },
  },
};

// The item variant defines how each child element will animate.
// It will fade in and slide up from below.
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

// --- Social Links Data ---
// It's good practice to keep data separate from the component logic.
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'LinkedIn', url: 'https://linkedin.com' },
  { name: 'Twitter', url: 'https://twitter.com' },
];

// --- The Component ---
const ContactSection = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would handle form submission here.
    alert('Form submitted! (Functionality preserved)');
  };

  return (
    <motion.section
      className="contact-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible" // Animate when the component enters the viewport
      viewport={{ once: true, amount: 0.2 }} // Trigger once, when 20% is visible
    >
      <motion.h2 className="section-title" variants={itemVariants as Variants}>
        Get In Touch
      </motion.h2>
      <div className="contact-content">
        <div className="contact-form-wrapper">
          <motion.p className="form-description" variants={itemVariants as Variants}>
            Have a question or want to work together? Fill out the form below.
          </motion.p>
          <form onSubmit={handleSubmit} className="contact-form">
            <motion.div className="form-group" variants={itemVariants as Variants}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </motion.div>
            <motion.div className="form-group" variants={itemVariants as Variants}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </motion.div>
            <motion.div className="form-group" variants={itemVariants as Variants}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} required></textarea>
            </motion.div>
            <motion.button
              type="submit"
              className="submit-button"
              variants={itemVariants as Variants}
              whileHover={{ scale: 1.05, backgroundColor: '#0056b3' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Send Message
            </motion.button>
          </form>
        </div>
        <div className="socials-wrapper">
          <motion.h3 className="socials-title" variants={itemVariants as Variants}>
            Find me on
          </motion.h3>
          <motion.ul className="social-links-list" variants={containerVariants}>
            {socialLinks.map((link) => (
              <motion.li key={link.name} variants={itemVariants as Variants}>
                <motion.a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  whileHover={{ scale: 1.1, color: '#007bff' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {link.name}
                </motion.a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
      <style>{`
        .contact-section {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          max-width: 1000px;
          margin: 4rem auto;
          padding: 2rem;
          background-color: #f9f9f9;
          border-radius: 8px;
          overflow: hidden; /* Important for containing animations */
        }
        .section-title {
          font-size: 2.5rem;
          color: #333;
          text-align: center;
          margin-bottom: 2rem;
        }
        .contact-content {
          display: flex;
          flex-wrap: wrap;
          gap: 3rem;
        }
        .contact-form-wrapper {
          flex: 2;
          min-width: 300px;
        }
        .form-description {
          margin-bottom: 1.5rem;
          color: #666;
          font-size: 1.1rem;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          margin-bottom: 0.5rem;
          color: #555;
          font-weight: 500;
        }
        .form-group input,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
        }
        .submit-button {
          padding: 0.75rem 1.5rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.1rem;
          cursor: pointer;
          align-self: flex-start;
        }
        .socials-wrapper {
          flex: 1;
          min-width: 200px;
        }
        .socials-title {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 1.5rem;
        }
        .social-links-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .social-link {
          text-decoration: none;
          color: #555;
          font-weight: 500;
          display: inline-block; /* Required for transform animations */
        }
      `}</style>
    </motion.section>
  );
};

export default ContactSection;