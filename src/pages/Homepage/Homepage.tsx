import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import GameHeader from 'src/components/GameHeader/GameHeader';
import { HeroSectionCore } from 'src/components/HeroSection/HeroSection';
import { GameplayFeatures } from 'src/components/GameplayFeatures/GameplayFeatures';
import ArtStyleGallery from 'src/components/ArtStyleGallery/ArtStyleGallery';
import Footer from 'src/components/Footer/Footer';



export const Homepage = (): JSX.Element => {
  return (
    // The main container is now a motion component.
    // It uses 'initial' and 'animate' props to trigger the animation on load.
    // The 'variants' prop links to our containerVariants to control the sequence.
    <motion.div
      className="bg-[#1a1a1a] min-h-screen"
    >
      {/* Each section is wrapped in a motion.div. */}
      {/* They will inherit the 'initial' and 'animate' states from the parent. */}
      {/* The 'staggerChildren' in the parent will cause them to animate one after another. */}
        <GameHeader />
          <HeroSectionCore/>
          <GameplayFeatures/>
          <ArtStyleGallery />
        <Footer />
    </motion.div>
  );
};