import React, { useState, useEffect, useCallback, JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * @interface NavLinkProps
 * @description Defines the properties for a single navigation link in the header.
 */
export interface NavLinkProps {
  /**
   * The display text for the navigation link.
   * @example "Home"
   */
  text: string;
  /**
   * The target URL or path for the navigation link.
   * This can be an internal path (e.g., "/about") or an external URL.
   * @example "/about-me"
   */
  href: string;
  /**
   * An optional unique identifier for the link.
   * Recommended for use as React `key` when rendering lists of links.
   * @example "home-link"
   */
  id?: string;
}

/**
 * @interface HeaderProps
 * @description Defines the properties for the Header component.
 */
export interface HeaderProps {
  /**
   * The name of the portfolio owner to display prominently in the header.
   * This acts as the brand or title of the portfolio.
   * @example "Jane Doe Portfolio"
   */
  ownerName: string;
  /**
   * Optional URL for the portfolio owner's logo image.
   * If provided, this image will be displayed alongside or instead of the `ownerName`.
   * @example "/images/logo.png"
   */
  ownerLogoSrc?: string;
  /**
   * An array of navigation links to be displayed in the header.
   * Each object in the array should conform to the `NavLinkProps` interface.
   * @example `[{ text: "About", href: "/about" }, { text: "Projects", href: "/projects" }]`
   */
  navLinks: NavLinkProps[];
  /**
   * Optional CSS class name to apply to the main `<header>` element.
   * Useful for external styling via CSS modules or global stylesheets.
   * @example "my-custom-header"
   */
  className?: string;
  /**
   * Optional inline styles to apply directly to the main `<header>` element.
   * Useful for dynamic styling or simple overrides.
   * @example `{ backgroundColor: '#f0f0f0' }`
   */
  style?: React.CSSProperties;
}

/**
 * Renders a fallback UI for the ErrorBoundary component.
 * This component is displayed when a rendering error occurs within the Header.
 *
 * @param {{ error: Error, resetErrorBoundary: () => void }} props - The error object and a function to reset the error boundary.
 * @returns {JSX.Element} The fallback UI.
 */
function HeaderFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }): JSX.Element {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700 border border-red-700 rounded-md">
      <p className="font-bold mb-2">Something went wrong in the Header:</p>
      <pre className="text-sm break-words whitespace-pre-wrap">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="px-3 py-1.5 mt-2 text-sm font-semibold text-white bg-red-600 rounded-md cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

/**
 * `Header` component for a portfolio website.
 *
 * This component provides a responsive navigation bar at the top of the page.
 * It displays the portfolio owner's name or logo and a set of navigation links.
 * On smaller screens, the navigation links collapse into a hamburger menu,
 * which animates open and closed using Framer Motion.
 *
 * It utilizes `react-router-dom`'s `Link` component for internal navigation
 * to ensure smooth client-side routing.
 * An `ErrorBoundary` is wrapped around the component to gracefully handle
 * any rendering errors and display a fallback UI.
 *
 * @param {HeaderProps} props - The properties for the Header component.
 * @returns {JSX.Element} The rendered Header component.
 */
function Header(props: HeaderProps): JSX.Element {
  const { ownerName, ownerLogoSrc, navLinks, className, style } = props;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const MOBILE_BREAKPOINT_PX: number = 768;

  // Animation Variants
  const headerVariants: Variants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 20 } },
  };

  const logoVariants: Variants = {
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 300 } },
    tap: { scale: 0.95 },
  };

  const desktopNavContainerVariants: Variants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const desktopNavItemVariants: Variants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    hover: { scale: 1.1 }, 
    tap: { scale: 0.95 }
  };

  const mobileMenuContainerVariants: Variants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto', transition: { ease: 'easeOut', duration: 0.3, when: 'beforeChildren', staggerChildren: 0.07 } },
    exit: { opacity: 0, height: 0, transition: { ease: 'easeIn', duration: 0.2, when: 'afterChildren', staggerChildren: 0.05, staggerDirection: -1 } },
  };
  
  const mobileNavItemVariants: Variants = {
    initial: { x: -30, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 25 } },
    exit: { x: -30, opacity: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  };

  const hamburgerPathVariants: Variants = {
    closed: { d: "M 2 2.5 L 20 2.5", stroke: "currentColor" },
    open: { d: "M 3 16.5 L 17 2.5", stroke: "currentColor" },
  };
  const hamburgerPathVariantsTwo: Variants = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  };
  const hamburgerPathVariantsThree: Variants = {
    closed: { d: "M 2 16.346 L 20 16.346", stroke: "currentColor" },
    open: { d: "M 3 2.5 L 17 16.346", stroke: "currentColor" },
  };

  const toggleMobileMenu = useCallback((): void => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback((): void => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const checkMobileView = (): void => {
      if (window.innerWidth > MOBILE_BREAKPOINT_PX && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener('resize', checkMobileView);
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, [isMobileMenuOpen, closeMobileMenu]);


  /**
   * Renders a list of navigation links using Framer Motion for animations.
   *
   * @param {NavLinkProps[]} links - An array of link objects to render.
   * @param {object} classNames - CSS class names for ul, li, and link elements.
   * @param {() => void} [onClickCallback] - Optional callback for link clicks.
   * @param {Variants} [liVariants] - Framer Motion variants for list items.
   * @returns {JSX.Element} A `<ul>` element containing animated navigation links.
   */
  const renderNavLinks = useCallback(
    (
      links: NavLinkProps[],
      classNames: { ul: string; li: string; link: string },
      onClickCallback?: () => void,
      liVariants?: Variants,
    ): JSX.Element => (
      <ul className={classNames.ul}>
        {links.map((link) => (
          <motion.li
            key={link.id || link.href}
            className={classNames.li}
            variants={liVariants as Variants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link to={link.href} className={classNames.link} onClick={onClickCallback}>
              {link.text}
            </Link>
          </motion.li>
        ))}
      </ul>
    ),
    []
  );

  return (
    <ErrorBoundary FallbackComponent={HeaderFallback}>
      <motion.header
        className={`w-full fixed top-0 z-50 flex min-h-[64px] items-center justify-between bg-white/80 px-4 py-3 shadow-md backdrop-blur-sm sm:px-8 ${className || ''}`}
        style={style}
        variants={headerVariants as Variants}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={logoVariants as Variants} whileHover="hover" whileTap="tap">
          <Link
            to="/"
            className="flex items-center rounded-md p-1 text-xl font-bold text-slate-800 transition-colors hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-white/80 sm:text-2xl"
            aria-label={`${ownerName} home page`}
          >
            {ownerLogoSrc && (
              <img
                src={ownerLogoSrc}
                alt={`${ownerName} logo`}
                className="mr-3 h-10 w-10 rounded-full object-cover"
              />
            )}
            <span>{ownerName}</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          className="hidden items-center md:flex"
          aria-label="Main navigation"
          variants={desktopNavContainerVariants as Variants}
          initial="initial"
          animate="animate"
        >
          {renderNavLinks(
            navLinks,
            {
              ul: 'flex items-center space-x-2 lg:space-x-4',
              li: 'relative',
              link: 'block rounded-md px-3 py-2 font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-white/80',
            },
            closeMobileMenu,
            desktopNavItemVariants
          )}
        </motion.nav>

        {/* Hamburger Menu Button */}
        <motion.button
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          className="z-50 rounded-md p-2 text-slate-800 transition-colors hover:bg-slate-200/50 focus:outline-none focus:ring-2 focus:ring-slate-500 md:hidden"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <motion.svg
            width="23"
            height="23"
            viewBox="0 0 23 23"
            animate={isMobileMenuOpen ? "open" : "closed"}
            initial={false}
          >
            <motion.path strokeWidth="2" strokeLinecap="round" variants={hamburgerPathVariants as Variants} transition={{ duration: 0.3 }} />
            <motion.path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M 2 9.423 L 20 9.423" variants={hamburgerPathVariantsTwo as Variants} transition={{ duration: 0.1 }} />
            <motion.path strokeWidth="2" strokeLinecap="round" variants={hamburgerPathVariantsThree as Variants} transition={{ duration: 0.3 }} />
          </motion.svg>
        </motion.button>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            key="mobile-menu"
            className="fixed top-0 left-0 z-40 w-full pt-[64px] overflow-hidden bg-white shadow-lg md:hidden"
            aria-label="Mobile navigation"
            variants={mobileMenuContainerVariants as Variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderNavLinks(
              navLinks,
              {
                ul: 'flex flex-col',
                li: 'border-b border-slate-200 last:border-b-0',
                link: 'block py-4 px-8 text-center font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100 active:bg-slate-200',
              },
              closeMobileMenu,
              mobileNavItemVariants
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
}

export default Header;