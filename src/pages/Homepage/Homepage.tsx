import React, { JSX, useRef, ElementType, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, Variants, useReducedMotion, AnimatePresence } from 'framer-motion';

// --- Icon Components ---
const TruckIcon: ElementType = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4h-8v-4h-2Z"/><circle cx="7.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg>
);
const LeafIcon: ElementType = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13q0-1.55.8-3T6.6 6.6C8.1 5.1 10 4.2 12 4a7.9 7.9 0 0 1 8 8c0 4.4-3.6 8-8 8Z"/><path d="M12 4c2.8 0 5.2 1.6 6.4 4"/></svg>
);
const MapPinIcon: ElementType = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const TwitterIcon: ElementType = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.38-.01-.57.84-.6 1.56-1.36 2.14-2.23z"/></svg>
);
const FacebookIcon: ElementType = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon: ElementType = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const LinkedinIcon: ElementType = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

const iconMap = { truck: TruckIcon, leaf: LeafIcon, 'map-pin': MapPinIcon, twitter: TwitterIcon, facebook: FacebookIcon, instagram: InstagramIcon, linkedin: LinkedinIcon, };

// --- Component Prop Interfaces ---
export interface HeroSectionProps { title: string; subtitle: string; ctaText: string; onCtaClick: () => void; illustrationUrl: string; }
export interface TestimonialCardProps { quote: string; author: string; company?: string; }
export interface TestimonialsSectionProps { title: string; testimonials: TestimonialCardProps[]; }
export interface FaqSectionProps { title: string; faqs: { question: string; answer: string }[]; }
export interface FooterProps { contactInfo: { phone: string; email: string }; quickLinks: { label: string; href: string }[]; socialLinks: { iconName: string; href: string }[]; }
export interface NavbarProps { title: string; navItems: { label: string; href: string }[]; }
export interface InfoCardProps { title: string; description: string; icon?: React.ReactElement; }
export interface ContentSectionProps { title: string; items: { title: string; description: string; icon?: React.ReactElement; }[]; }

// --- Types for Animations ---
interface Ripple { id: number; x: number; y: number; size: number; }
const itemVariants: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };
const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

// --- Components ---
const Navbar: React.FC<NavbarProps> = ({ title, navItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const navbarVariants: Variants = {
        hidden: { y: -30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    };
    
    const navItemVariants: Variants = {
        hidden: { y: -15, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };
    
    const mobileMenuContainerVariants: Variants = {
      hidden: {},
      visible: { transition: { staggerChildren: 0.08, when: "beforeChildren" } },
    };

    return (
        <motion.nav 
            className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
            variants={shouldReduceMotion ? {} : navbarVariants as Variants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <motion.div variants={navItemVariants as Variants} className="flex items-center">
                        <a href="/" className="text-2xl font-bold text-blue-600">
                           {title}
                        </a>
                    </motion.div>
                    <motion.div 
                        className="hidden md:block"
                        variants={shouldReduceMotion ? {} : containerVariants as Variants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <motion.a 
                                    key={item.label}
                                    href={item.href} 
                                    className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    variants={navItemVariants as Variants}
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-slate-100 inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-blue-500" aria-controls="mobile-menu" aria-expanded={isOpen}>
                            <span className="sr-only">Open main menu</span>
                             <AnimatePresence initial={false} mode="wait">
                                <motion.div
                                    key={isOpen ? 'close' : 'open'}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isOpen ? (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="md:hidden overflow-hidden"
                        id="mobile-menu"
                    >
                        <motion.div 
                            className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
                            variants={shouldReduceMotion ? {} : mobileMenuContainerVariants as Variants}
                            initial="hidden"
                            animate="visible"
                        >
                            {navItems.map((item) => (
                                <motion.a 
                                    key={item.label} 
                                    href={item.href} 
                                    className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 block px-3 py-2 rounded-md text-base font-medium"
                                    variants={navItemVariants as Variants}
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

const InfoCard: React.FC<InfoCardProps> = ({ title, description, icon }) => (
    <motion.div
      variants={itemVariants as Variants} 
      className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        {icon && <div className="text-blue-600 mb-4">{React.cloneElement(icon)}</div>}
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
);

const ContentSection: React.FC<ContentSectionProps> = ({ title, items }) => {
    const shouldReduceMotion = useReducedMotion();
    return (
        <div>
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="font-semibold leading-7 text-blue-600">Our Promise</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
          </div>
          <motion.div 
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={shouldReduceMotion ? {} : containerVariants as Variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
                {items.map((item, index) => (
                    <InfoCard key={index} {...item} />
                ))}
            </motion.div>
        </div>
    );
};

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, ctaText, onCtaClick, illustrationUrl }) => {
  const shouldReduceMotion = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleCtaClickWithRipple = (event: MouseEvent<HTMLButtonElement>) => {
    onCtaClick();
    if (shouldReduceMotion) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: Ripple = { x, y, size, id: Date.now() };
    setRipples(current => [...current, newRipple]);
  };

  const removeRipple = (id: number) => {
    setRipples(current => current.filter(r => r.id !== id));
  };
  
  return (
    <div className="relative isolate overflow-hidden bg-white pt-16 sm:pt-24 lg:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <motion.h1
                className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              >
                {title}
              </motion.h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">{subtitle}</p>
              <div className="mt-10 flex items-center gap-x-6">
                <motion.button
                  onClick={handleCtaClickWithRipple}
                  className="relative overflow-hidden rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                  animate={!shouldReduceMotion ? { scale: [1, 1.03, 1], transition: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 2 } } : {}}
                >
                  {ctaText}
                   <AnimatePresence>
                    {ripples.map(({ id, x, y, size }) => (
                      <motion.span
                        key={id}
                        className="absolute rounded-full bg-white/50"
                        style={{ left: x, top: y, width: size, height: size }}
                        initial={{ transform: 'scale(0)', opacity: 0.5 }}
                        animate={{ transform: 'scale(4)', opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        onAnimationComplete={() => removeRipple(id)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
          <motion.div
            animate={!shouldReduceMotion ? { y: [0, -15, 0] } : {}}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-start justify-end"
          >
            <img src={illustrationUrl} alt="Illustration of fresh laundry" className="w-[48rem] max-w-none rounded-2xl shadow-xl ring-1 ring-slate-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" />
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-slate-50 sm:h-32" />
    </div>
  );
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, company }) => {
  const shouldReduceMotion = useReducedMotion();
  const cardVariants: Variants = {
    initial: {
      rotateY: 0,
      scale: 1,
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
    hover: {
      rotateY: 8,
      scale: 1.05,
      y: -10,
      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
  };

  return (
    <motion.figure
      className="relative w-full max-w-sm flex-shrink-0 rounded-2xl bg-white p-8"
      style={{ transformPerspective: '1000px' }}
      variants={shouldReduceMotion ? {} : cardVariants as Variants}
      initial="initial"
      whileHover="hover"
    >
      <blockquote className="text-slate-700">
        <svg width="35" height="28" className="absolute top-8 left-8 fill-blue-100" aria-hidden="true">
          <path d="M6.398 28h8.046L18 17.152V0H0v17.152h9.984L6.398 28zM23.398 28h8.046L35 17.152V0H17v17.152h9.984L23.398 28z"></path>
        </svg>
        <p className="relative z-10">"{quote}"</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-x-4">
        <div className="text-sm">
          <div className="font-semibold text-slate-900">{author}</div>
          {company && <div className="text-slate-500">{company}</div>}
        </div>
      </figcaption>
    </motion.figure>
  );
};

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ title, testimonials }) => {
  const shouldReduceMotion = useReducedMotion();
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  const marqueeVariants = {
    animate: {
      x: ['0%', '-66.66%'],
      transition: {
        x: { repeat: Infinity, repeatType: "loop", duration: 50, ease: "linear" },
      },
    },
  };
  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
        <p className="mt-4 text-lg leading-8 text-slate-600">Trusted by thousands of happy customers.</p>
      </div>
      <div className="relative mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
        <motion.div className="flex gap-8 py-4" variants={!shouldReduceMotion ? marqueeVariants as Variants : {}} animate="animate">
          {duplicatedTestimonials.map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.author}-${index}`} {...testimonial} />
          ))}
        </motion.div>
      </div>
    </>
  );
};

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div className="py-6" variants={itemVariants as Variants}>
      <dt>
        <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-start justify-between text-left text-slate-900" aria-expanded={isOpen}>
          <span className="text-lg font-semibold leading-7">{question}</span>
          <span className="ml-6 flex h-7 items-center">
            <motion.svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </motion.svg>
          </span>
        </button>
      </dt>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.dd className="overflow-hidden" initial="collapsed" animate="open" exit="collapsed" variants={{ open: { opacity: 1, height: 'auto' }, collapsed: { opacity: 0, height: 0 } }} transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}>
            <div className="mt-4 pr-12 text-base leading-7 text-slate-600">{answer}</div>
          </motion.dd>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FaqSection: React.FC<FaqSectionProps> = ({ title, faqs }) => {
    const shouldReduceMotion = useReducedMotion();
    return (
        <>
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">Have questions? We have answers.</p>
            </div>
            <div className="mx-auto mt-16 max-w-4xl">
                <motion.dl 
                    className="divide-y divide-slate-900/10"
                    variants={shouldReduceMotion ? {} : containerVariants as Variants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {faqs.map((faq) => (<FaqItem key={faq.question} {...faq} />))}
                </motion.dl>
            </div>
        </>
    );
};

const Footer: React.FC<FooterProps> = ({ contactInfo, quickLinks, socialLinks }) => {
    const shouldReduceMotion = useReducedMotion();
    const socialIconVariants: Variants = {
        initial: { color: '#94a3b8', scale: 1, },
        hover: { color: '#60a5fa', scale: 1.2, transition: { duration: 0.2, ease: 'easeIn' }, },
    };

    const footerItemVariants: Variants = {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0 },
    }

    const footerContainerVariants: Variants = {
      hidden: {},
      visible: { transition: { staggerChildren: 0.2 } },
    }

    return (
        <footer className="bg-slate-900" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <motion.div 
                    className="xl:grid xl:grid-cols-3 xl:gap-8"
                    variants={shouldReduceMotion ? {} : footerContainerVariants as Variants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div className="space-y-8" variants={footerItemVariants as Variants}>
                        <span className="text-2xl font-bold text-white">SKAYA LAUNDRY</span>
                        <p className="text-sm leading-6 text-slate-300">Freshness, simplified. The modern solution for your laundry needs.</p>
                        <div className="flex space-x-6">
                            {socialLinks.map((item) => {
                                const Icon = iconMap[item.iconName as keyof typeof iconMap];
                                return (
                                    <motion.a
                                        key={item.iconName}
                                        href={item.href}
                                        variants={shouldReduceMotion ? {} : socialIconVariants as Variants}
                                        initial="initial"
                                        whileHover="hover"
                                    >
                                        <span className="sr-only">{item.iconName}</span>
                                        {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                                    </motion.a>
                                );
                            })}
                        </div>
                    </motion.div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <motion.div variants={footerItemVariants as Variants}>
                            <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                {quickLinks.map((item) => (
                                    <li key={item.label}>
                                        <a href={item.href} className="text-sm leading-6 text-slate-300 transition-colors hover:text-white">{item.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div className="mt-10 md:mt-0" variants={footerItemVariants as Variants}>
                            <h3 className="text-sm font-semibold leading-6 text-white">Contact</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                <li><span className="text-sm leading-6 text-slate-300">{contactInfo.phone}</span></li>
                                <li><span className="text-sm leading-6 text-slate-300">{contactInfo.email}</span></li>
                            </ul>
                        </motion.div>
                    </div>
                </motion.div>
                <motion.div 
                    className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <p className="text-xs leading-5 text-slate-400">&copy; {new Date().getFullYear()} Skaya Inc. All rights reserved.</p>
                </motion.div>
            </div>
        </footer>
    );
};

interface AnimatedSectionProps { children: React.ReactNode; className?: string; }
const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 },
    visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeOut' } },
  };

  return (
    <motion.section ref={ref} className={className} variants={sectionVariants as Variants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
      {children}
    </motion.section>
  );
};

const Homepage = (): JSX.Element => {
  const navigate = useNavigate();
  const handleCtaClick = () => navigate('/schedule-pickup');

  const navbarData: NavbarProps = {
    title: 'SKAYA LAUNDRY',
    navItems: [
      { label: 'Services', href: '#' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  };

  const heroData: HeroSectionProps = {
    title: 'Effortless Laundry Solutions',
    subtitle: 'Say goodbye to laundry day. We pick up, clean, and deliver your clothes, right to your door. Freshness, simplified.',
    ctaText: 'Schedule a Pickup',
    onCtaClick: handleCtaClick,
    illustrationUrl: 'https://picsum.photos/300/180',
  };

  const contentData: ContentSectionProps = {
    title: 'Everything you need, nothing you don’t.',
    items: [
        { icon: <TruckIcon />, title: 'Fast Delivery', description: 'Get your clean clothes back in as little as 24 hours.' },
        { icon: <LeafIcon />, title: 'Eco-Friendly Detergents', description: 'We use plant-based, hypoallergenic detergents that are kind to your skin and the planet.' },
        { icon: <MapPinIcon />, title: 'Real-Time Tracking', description: 'Know exactly where your laundry is with our live tracking app.' },
    ],
  };

  const testimonialsData: TestimonialsSectionProps = {
    title: "What Our Customers Say",
    testimonials: [
        { quote: "This service is a lifesaver! My clothes have never been cleaner, and I get so much time back in my week.", author: "Sarah J.", company: "Busy Professional" },
        { quote: "The real-time tracking is amazing. I always know exactly where my laundry is and when it will arrive.", author: "Michael B.", company: "Tech Enthusiast" },
        { quote: "I love that they use eco-friendly detergents. It's great for my sensitive skin and the planet.", author: "Emily C.", company: "Parent & Activist" },
        { quote: "Incredibly reliable and professional. The quality of the folding alone is worth it!", author: "David L.", company: "Small Business Owner" },
        { quote: "Switching to this laundry service was the best decision. Flawless service from start to finish.", author: "Jessica W.", company: "Student" },
    ]
  };

  const faqData: FaqSectionProps = {
    title: 'Frequently Asked Questions',
    faqs: [
      { question: 'What is your turnaround time?', answer: 'Our standard turnaround time is 48 hours, but we offer a 24-hour express service for an additional fee. You can select your preferred service when you schedule a pickup.' },
      { question: 'Do you handle delicate items?', answer: 'Absolutely. We have special procedures for delicate garments. Please place them in a separate, clearly marked bag, and leave a note in the app. Our team is trained to handle them with the utmost care.' },
      { question: 'What areas do you service?', answer: 'We are constantly expanding! Currently, we service the entire downtown core and surrounding suburbs. You can enter your zip code on our app or website to see if we deliver to your area.' },
      { question: 'How do I schedule a pickup?', answer: 'Scheduling is easy! You can use our mobile app or website. Just select your preferred pickup and delivery times, specify any special instructions, and we\'ll take care of the rest.' },
    ],
  };

  const footerData: FooterProps = {
    contactInfo: { phone: '1-800-555-LAUNDRY', email: 'contact@skaya.com' },
    quickLinks: [
      { label: 'About Us', href: '/about' }, { label: 'Pricing', href: '/pricing' },
      { label: 'Contact', href: '/contact' }, { label: 'Terms of Service', href: '/terms' },
    ],
    socialLinks: [
      { href: '#', iconName: 'twitter' }, { href: '#', iconName: 'facebook' },
      { href: '#', iconName: 'instagram' }, { href: '#', iconName: 'linkedin' },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <Navbar {...navbarData} />
      <main className="flex-grow">
        <HeroSection {...heroData} />

        <AnimatedSection className="bg-white py-16 sm:py-24">
           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ContentSection {...contentData} />
           </div>
        </AnimatedSection>
        
        <AnimatedSection className="bg-slate-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TestimonialsSection {...testimonialsData} />
          </div>
        </AnimatedSection>

        <AnimatedSection className="bg-white py-16 sm:py-24">
           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FaqSection {...faqData} />
           </div>
        </AnimatedSection>
      </main>

      <Footer {...footerData} />
    </div>
  );
};

export default Homepage;