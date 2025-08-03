import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {object} NPC
 * @property {string} id - A unique identifier for the NPC.
 * @property {number} size - The diameter of the NPC element in pixels.
 * @property {string} color - The background color of the NPC element.
 * @property {object} initial - The initial position and scale.
 * @property {number} initial.x - The initial horizontal position in pixels.
 * @property {number} initial.y - The initial vertical position in pixels.
 * @property {number} initial.z - The initial depth position in pixels.
 * @property {object} animate - The keyframes for the NPC's animation.
 * @property {object} transition - The transition properties for the animation.
 */
type NPC = {
  id: string;
  size: number;
  color: string;
  initial: {
    x: number;
    y: number;
    z: number;
  };
  animate: {
    x?: number[];
    y?: number[];
    rotate?: number[];
    scale?: number[];
  };
  transition: {
    duration: number;
    ease: string;
    repeat: number;
    repeatType: 'loop' | 'reverse' | 'mirror';
  };
};

/**
 * @typedef {object} PlayerAvatar
 * @property {string} id - A unique identifier for the player avatar.
 * @property {string} imageUrl - The URL for the avatar's image.
 * @property {number} x - The horizontal position in the scene in pixels.
 * @property {number} y - The vertical position in the scene in pixels.
 * @property {number} z - The depth position in the scene in pixels.
 */
type PlayerAvatar = {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  z: number;
};


// --- CONSTANT DATA ---

/**
 * An array of constant data representing the AI-driven NPCs in the world.
 * Each NPC has a unique animation loop, creating a dynamic environment.
 * @const {NPC[]}
 */
const NPC_DATA: readonly NPC[] = [
  {
    id: 'npc-path-1',
    size: 20,
    color: '#ff00ff',
    initial: { x: -300, y: 50, z: 20 },
    animate: { x: [ -300, 300 ] },
    transition: { duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
  },
  {
    id: 'npc-path-2',
    size: 15,
    color: '#00ffff',
    initial: { x: 250, y: -150, z: -50 },
    animate: { y: [ -150, 150 ] },
    transition: { duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
  },
  {
    id: 'npc-orbit-1',
    size: 25,
    color: '#ffff00',
    initial: { x: 0, y: 0, z: 100 },
    animate: { rotate: [0, 360], scale: [1, 1.5, 1] },
    transition: { duration: 12, ease: "linear", repeat: Infinity, repeatType: "loop" },
  }
];

/**
 * An array of constant data for other player avatars.
 * These are static to represent players who are present but not actively moving.
 * Using picsum.photos with seeds ensures image consistency.
 * @const {PlayerAvatar[]}
 */
const PLAYER_AVATAR_DATA: readonly PlayerAvatar[] = [
    { id: 'player-1', x: -200, y: -100, z: 80, imageUrl: 'https://picsum.photos/seed/player1/150/150.webp' },
    { id: 'player-2', x: 280, y: 150, z: -40, imageUrl: 'https://picsum.photos/seed/player2/150/150.webp' },
    { id: 'player-3', x: 100, y: 20, z: 150, imageUrl: 'https://picsum.photos/seed/player3/150/150.webp' },
];

/**
 * A string containing CSS keyframes for animations.
 * This is injected into a <style> tag in the component to support animations
 * that are not part of the default Tailwind config.
 */
const KEYFRAMES_STYLES = `
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
  }
  @keyframes swirl {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// --- ANIMATION VARIANTS ---

/**
 * Variants for the main scene container.
 * Manages the staggered appearance of its direct children.
 */
const sceneContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

/**
 * Variants for individual items within the scene (e.g., the portal).
 * Defines a simple fade-in and scale-up animation.
 */
const sceneItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 15, stiffness: 100 },
  },
};

/**
 * Variants for player avatars.
 * Uses a 'custom' prop to dynamically set the final 3D position.
 */
const avatarVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (player: PlayerAvatar) => ({
    opacity: 1,
    scale: 1,
    x: player.x,
    y: player.y,
    z: player.z,
    transition: { duration: 0.8, ease: "easeOut" },
  }),
};

/**
 * Variants for AI NPCs.
 * Uses a 'custom' prop for the initial position, then hands off
 * animation control to the `animate` and `transition` props for continuous loops.
 */
const npcVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (npc: NPC) => ({
        opacity: 1,
        scale: 1,
        x: npc.initial.x,
        y: npc.initial.y,
        transition: { duration: 0.6, ease: "circOut" },
    }),
};

/**
 * WorldViewer Component
 *
 * This component serves as the central 3D viewport for the application, simulating a
 * metaverse world. It renders a scene containing several key elements without requiring
 * any external props, as all data is defined internally as constants.
 *
 * The scene includes:
 * - A futuristic, glowing portal structure, which is the central visual anchor.
 * - AI-driven NPCs, represented by simple geometric shapes with continuous,
 *   procedurally defined animations via Framer Motion.
 * - Other player avatars, represented by static, card-like images, suggesting
 *   the presence of other users in the world.
 *
 * The entire component is self-contained and designed to be a "drop-in" view
 * for the main application layout.
 *
 * @component
 * @returns {JSX.Element} The rendered WorldViewer component.
 *
 * @example
 * // In a layout component:
 * // <ErrorBoundary fallback={<div>Something went wrong in the World Viewer</div>}>
 * //   <WorldViewer />
 * // </ErrorBoundary>
 */
const WorldViewer = (): JSX.Element => {
  return (
    <>
      {/* Injecting keyframe animations into the document head */}
      <style>{KEYFRAMES_STYLES}</style>
      <div 
        className="flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)] font-sans" 
        aria-label="Metaverse World Viewer"
      >
        <motion.div 
            className="relative h-[800px] w-[1000px] [perspective:1200px] [transform-style:preserve-3d]"
            variants={sceneContainerVariants as Variants}
            initial="hidden"
            animate="visible"
        >
          {/* --- Render Portal --- */}
          <motion.div 
            className="absolute left-1/2 top-1/2 h-[450px] w-[300px] [transform-style:preserve-3d] [transform:translateZ(-100px)_rotateX(10deg)]"
            variants={sceneItemVariants as Variants}
          >
            <div className="absolute inset-0 animate-[pulse_4s_ease-in-out_infinite] shadow-[0_0_20px_10px_#6a0dad,0_0_40px_20px_#9400d3,inset_0_0_30px_15px_#4b0082] [border-radius:50%_/_40%]"></div>
            <div className="absolute left-[5%] top-[5%] h-[90%] w-[90%] overflow-hidden bg-black shadow-[inset_0_0_20px_10px_#111] [border-radius:50%_/_40%]">
              <div className="absolute left-[-50%] top-[-50%] h-[200%] w-[200%] animate-[swirl_5s_linear_infinite] bg-[conic-gradient(from_180deg_at_50%_50%,_#4b0082,_#9400d3,_#ff00ff,_#00ffff,_#ffff00,_#9400d3,_#4b0082)]"></div>
            </div>
          </motion.div>

          {/* --- Render Player Avatars --- */}
          {PLAYER_AVATAR_DATA.map(player => (
            <motion.img
              key={player.id}
              src={player.imageUrl}
              alt="Player Avatar"
              className="absolute left-1/2 top-1/2 h-[100px] w-[100px] rounded-full border-[3px] border-[rgba(0,255,255,0.7)] object-cover shadow-[0_0_15px_rgba(0,255,255,0.5)] [transform-style:preserve-3d] hover:shadow-[0_0_25px_rgba(0,255,255,0.9)]"
              custom={player}
              variants={avatarVariants as Variants}
              whileHover={{ scale: 1.1, z: player.z + 20 }}
            />
          ))}

          {/* --- Render AI NPCs --- */}
          {NPC_DATA.map(npc => (
            <motion.div
              key={npc.id}
              aria-label="AI Non-Player Character"
              className="absolute left-1/2 top-1/2 rounded-full shadow-[0_0_10px_currentColor,0_0_20px_currentColor] [transform-style:preserve-3d]"
              style={{
                width: npc.size,
                height: npc.size,
                backgroundColor: npc.color,
                // We apply initial transform directly to avoid conflicts with motion props
                // This combines centering with the initial Z-depth
                transform: `translateX(-50%) translateY(-50%) translateZ(${npc.initial.z}px)`,
              }}
              custom={npc}
              variants={npcVariants as Variants}
              // These props override the 'visible' variant to start the continuous animation loop
              animate={npc.animate}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default WorldViewer;