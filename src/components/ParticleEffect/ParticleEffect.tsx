import React, { useRef, useEffect, memo, JSX } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @typedef {object} Particle
 * @property {number} x - The x-coordinate of the particle.
 * @property {number} y - The y-coordinate of the particle.
 * @property {number} vx - The horizontal velocity of the particle.
 * @property {number} vy - The vertical velocity of the particle (for slight drift).
 * @property {number} radius - The radius of the particle.
 * @property {string} color - The color of the particle.
 */
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

/**
 * Configuration for the particle effect.
 * This constant object holds all tunable parameters for the animation,
 * ensuring the component is self-contained and requires no external props.
 * @const
 */
const PARTICLE_CONFIG = {
  /** The total number of particles to render. */
  count: 150,
  /** An array of neon colors for the particles. */
  colors: ['#00ffff', '#ff00ff', '#00ff00', '#ffff00'],
  /** The minimum horizontal speed of a particle. */
  minSpeed: 0.5,
  /** The maximum horizontal speed of a particle. */
  maxSpeed: 2.0,
  /** The minimum radius of a particle. */
  minRadius: 1,
  /** The maximum radius of a particle. */
  maxRadius: 3,
  /** The intensity of the glow effect around each particle. */
  glowBlur: 15,
  /** The background color of the canvas container. */
  backgroundColor: '#0a0a1a', // Dark blue/purple
};

/**
 * Framer Motion variants for the main container.
 * This defines the entrance animation, making the component fade and focus into view.
 */
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)', // Start blurred for a "focus in" effect
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)', // Animate to a sharp view
    transition: {
      duration: 1.5,
      ease: [0.6, 0.01, 0.05, 0.95], // A smooth, custom ease-out curve
    },
  },
};

/**
 * A utility function to generate a random number within a given range.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random number between min and max.
 */
const random = (min: number, max: number): number => Math.random() * (max - min) + min;

/**
 * `ParticleEffect` is a self-contained component that renders a continuous,
 * glowing particle animation. It's designed to simulate data flow or token transfers
 * with a futuristic, neon aesthetic on a dark background. The component is fully
 * pre-configured and requires no props, making it easy to drop into any application
 * as a dynamic background or overlay.
 *
 * The animation is rendered on an HTML `<canvas>` element for optimal performance.
 *
 * @component
 * @returns {JSX.Element} The rendered `ParticleEffect` component.
 */
const ParticleEffect = memo((): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // The canvas context can sometimes fail to be created.
    // A robust application should have a higher-level ErrorBoundary to catch this,
    // but a simple check prevents a hard crash within the component.
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get 2D context from canvas.');
        return;
    }

    let particles: Particle[] = [];
    
    /**
     * Resizes the canvas to fit its parent container and re-initializes particles.
     */
    const resizeCanvas = () => {
      const { clientWidth, clientHeight } = canvas.parentElement || document.body;
      canvas.width = clientWidth;
      canvas.height = clientHeight;
      initParticles();
    };

    /**
     * Initializes or re-initializes the particles array.
     * Each particle is given a random starting position, velocity, size, and color
     * based on the `PARTICLE_CONFIG`.
     */
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
        const radius = random(PARTICLE_CONFIG.minRadius, PARTICLE_CONFIG.maxRadius);
        const color = PARTICLE_CONFIG.colors[Math.floor(random(0, PARTICLE_CONFIG.colors.length))];
        
        particles.push({
          radius,
          color,
          x: random(-radius, canvas.width + radius),
          y: random(0, canvas.height),
          vx: random(PARTICLE_CONFIG.minSpeed, PARTICLE_CONFIG.maxSpeed),
          vy: random(-0.2, 0.2), // Slight vertical drift
        });
      }
    };

    /**
     * The main animation loop. Clears the canvas, updates each particle's position,
     * and draws it with a glowing effect. When a particle moves off-screen,
     * it's reset to the other side to create a continuous, looping flow.
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Boundary check and reset for continuous flow
        if (p.x - p.radius > canvas.width) {
          p.x = -p.radius;
          p.y = random(0, canvas.height);
        }
        if (p.y - p.radius > canvas.height || p.y + p.radius < 0) {
            // Reset Y if it drifts too far
            p.vx = random(PARTICLE_CONFIG.minSpeed, PARTICLE_CONFIG.maxSpeed); // Re-randomize speed
            p.y = random(0, canvas.height);
        }
        
        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = PARTICLE_CONFIG.glowBlur;
        ctx.fill();
        ctx.closePath();
      }

      // Reset shadow properties for other potential drawings (good practice)
      ctx.shadowBlur = 0;

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Set up and start the animation
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if(canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    resizeCanvas(); // Initial setup
    animate();

    // Cleanup function to stop animation and observer on component unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      resizeObserver.disconnect();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full overflow-hidden bg-[#0a0a1a] z-[-1]"
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      <canvas
        ref={canvasRef}
        className="block"
        aria-hidden="true"
      />
    </motion.div>
  );
});

export default ParticleEffect;