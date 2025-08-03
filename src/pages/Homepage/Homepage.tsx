import React, { JSX, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import ParticleEffect from 'src/components/ParticleEffect/ParticleEffect';
import Navbar from 'src/components/Navbar/Navbar';
import BridgeInterfaceContainer from 'src/components/BridgeInterface/BridgeInterface';
import Interactive3DNetwork from 'src/components/Interactive3DNetwork/Interactive3DNetwork';
import HolographicDashboard from 'src/components/HolographicDashboard/HolographicDashboard';
import SafeTransactionVisualizer from 'src/components/TransactionVisualizer/TransactionVisualizer';

// --- NEW COMPONENT IMPORTS ---
// @reason Imports for the new cross-chain integration website design.

// As per the instructions, all components are defined within this single file.

// --- ANIMATION VARIANTS ---

/**
 * @reason Variants for the main page container to stagger its direct children (header, sections).
 */
const pageContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

/**
 * @reason Variants for individual sections/cards to fade and slide in as part of the initial page load.
 */
const sectionItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * @reason Variants for the hero section to create a cascading text effect.
 */
const heroContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3, // Allows the section itself to appear first
        },
    },
};

/**
 * @reason Variants for the hero section's title and paragraph for a dramatic, futuristic entrance.
 */
const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.9,
            ease: [0.6, -0.05, 0.01, 0.99], // A custom cubic-bezier for a refined effect
        },
    },
};

/**
 * @reason Variants for interactive cards that have a neon glow on hover, fitting the futuristic theme.
 */
const glowingCardVariants: Variants = {
    rest: {
        scale: 1,
        // The glow color is controlled by a CSS variable `--glow-rgb` for reusability.
        boxShadow: '0 0 15px rgba(var(--glow-rgb), 0.2)',
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
    hover: {
        scale: 1.03,
        boxShadow: '0 0 40px rgba(var(--glow-rgb), 0.4)',
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 15,
        },
    },
};

/**
 * @reason Variants for the holographic dashboard to make it "lift" and glow on hover.
 */
const holographicDashboardVariants: Variants = {
    rest: {
        y: 0,
        scale: 1,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    hover: {
        y: -10,
        scale: 1.02,
        // A purple shadow to create a distinct holographic aura.
        boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.35)',
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 15,
        },
    },
};






// --- NEW MAIN PAGE COMPONENT ---

/**
 * @reason A cutting-edge page for cross-chain integration, featuring a futuristic design.
 */
const CrossChainPlatformPage = (): JSX.Element => {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black font-sans text-gray-100">
            {/* Background particle effect for a futuristic feel */}
            <div className="absolute inset-0 z-0">
                <ParticleEffect />
            </div>

            {/* Main container for layout and animations */}
            <div className="relative z-10">
                <Navbar />

                <motion.main
                    className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
                    variants={pageContainerVariants as Variants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Hero Section with Title */}
                    <motion.section
                        variants={sectionItemVariants as Variants}
                        className="mb-24 text-center"
                    >
                        <motion.div variants={heroContainerVariants as Variants}>
                            <motion.h1
                                variants={heroItemVariants as Variants}
                                className="mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
                                Seamless Cross-Chain Integration
                            </motion.h1>
                            <motion.p
                                variants={heroItemVariants as Variants}
                                className="mx-auto mb-12 max-w-3xl text-lg text-gray-400 md:text-xl">
                                Experience the future of interoperability. Transfer assets and data across blockchains with unparalleled speed and security.
                            </motion.p>
                        </motion.div>
                    </motion.section>

                    {/* Bridge and 3D Network Section */}
                    <motion.section
                        variants={sectionItemVariants as Variants}
                        className="mb-24 grid items-center gap-12 md:grid-cols-5"
                    >
                        <motion.div
                            className="rounded-2xl border border-cyan-500/20 bg-slate-800/50 p-6 shadow-lg shadow-cyan-500/10 backdrop-blur-sm md:col-span-2"
                            initial="rest"
                            whileHover="hover"
                            variants={glowingCardVariants as Variants}
                            style={{ '--glow-rgb': '6, 182, 212' } as React.CSSProperties}
                        >
                             <h2 className="mb-6 text-center text-3xl font-bold text-white">
                                Initiate a Transfer
                            </h2>
                            <BridgeInterfaceContainer />
                        </motion.div>
                        <motion.div
                            className="flex h-[450px] flex-col items-center justify-center md:col-span-3"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                            <Interactive3DNetwork />
                             <p className="mt-4 text-sm italic text-gray-500">Drag to rotate, scroll to zoom the interactive network.</p>
                        </motion.div>
                    </motion.section>

                    {/* Holographic Dashboard Section */}
                    <motion.section variants={sectionItemVariants as Variants} className="mb-24">
                        <h2 className="mb-10 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-center text-4xl font-bold text-transparent">
                           Holographic Dashboard
                        </h2>
                        <motion.div
                            initial="rest"
                            whileHover="hover"
                            variants={holographicDashboardVariants as Variants}
                        >
                            <HolographicDashboard />
                        </motion.div>
                    </motion.section>

                    {/* Transaction Visualizer Section */}
                    <motion.section variants={sectionItemVariants as Variants} className="text-center">
                         <h2 className="mb-10 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-center text-4xl font-bold text-transparent">
                           Live Smart Contract Interactions
                        </h2>
                        <motion.div
                            className="relative mx-auto h-[300px] w-full max-w-4xl overflow-hidden rounded-xl border border-purple-500/20 bg-black/30 shadow-lg shadow-purple-500/10"
                            initial="rest"
                            whileHover="hover"
                            variants={glowingCardVariants as Variants}
                            style={{ '--glow-rgb': '139, 92, 246' } as React.CSSProperties}
                        >
                             <SafeTransactionVisualizer />
                        </motion.div>
                    </motion.section>
                </motion.main>
            </div>
        </div>
    );
};

/**
 * This is the main component for the Homepage.tsx file.
 * It renders the complete cross-chain platform page.
 */


export default CrossChainPlatformPage;