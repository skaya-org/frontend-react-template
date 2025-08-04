import React, { useState, useEffect, useRef, JSX, useMemo } from 'react';
import { motion, useMotionValue, MotionValue, animate, useAnimationControls, Variants } from 'framer-motion'; // Added Variants import

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in its child component tree.
 * It renders a fallback UI when an error occurs.
 */
class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, { hasError: boolean }> {
  /**
   * Initializes the error boundary state.
   * @param props - The component props.
   */
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * getDerivedStateFromError is called after an error has been thrown by a descendant component.
   * It updates the state so the next render will show the fallback UI.
   * @param _error - The error that was thrown.
   * @returns An object to update the state.
   */
  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  /**
   * componentDidCatch is called after an error has been thrown by a descendant component.
   * It can be used to log error information.
   * @param error - The error that was thrown.
   * @param errorInfo - An object with a `componentStack` key containing information about which component threw the error.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  /**
   * Renders the error boundary.
   * If an error has occurred, it renders a fallback message; otherwise, it renders its children.
   * @returns A JSX element.
   */
  render(): JSX.Element {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center w-full h-full text-red-500 bg-gray-900">
          <p className="text-xl">Oops! Something went wrong rendering the background beams.</p>
        </div>
      );
    }
    return this.props.children as JSX.Element;
  }
}

/**
 * Constants for configuring the beam animation and collision physics.
 * These values are fixed and internally generated.
 */
const NUM_BEAMS = 15; // Total number of animated light beams
const BEAM_SIZE = 25; // Size of each beam (assumed square in pixels)
const BEAM_SPEED = 2.5; // Movement speed of each beam (pixels per animation frame)
const COLLISION_THRESHOLD = BEAM_SIZE; // Distance at which two beams are considered colliding

/**
 * Generates a random HSL color for the beams.
 * The hue is random, while saturation and lightness are within a fixed range
 * to ensure vibrant, visible colors against a dark background.
 * @returns A string representing an HSL color (e.g., "hsl(120, 60%, 50%)").
 */
const generateRandomColor = (): string => {
    const hue = Math.floor(Math.random() * 360); // 0-359 for full spectrum
    const saturation = Math.floor(Math.random() * (70 - 40 + 1)) + 40; // 40-70% saturation
    const lightness = Math.floor(Math.random() * (60 - 40 + 1)) + 40; // 40-60% lightness
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Interface defining the structure of data for each individual beam.
 * It includes properties for physics simulation and Framer Motion control.
 */
interface BeamData {
    id: number;
    color: string;
    vx: number; // Velocity in x-direction
    vy: number; // Velocity in y-direction
    motionX: MotionValue<number>; // Framer Motion value for x-position
    motionY: MotionValue<number>; // Framer Motion value for y-position
    controls: ReturnType<typeof useAnimationControls>; // Framer Motion controls for animation sequencing
}

/**
 * Variants for the initial appearance of each beam.
 * These define the `initial` state (hidden, smaller) and the `visible` state (full opacity, scale).
 * The `visible` variant is a function that receives a `custom` prop (the beam's index)
 * to apply a staggered delay.
 */
const beamAppearanceVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.8,
        // x, y, and boxShadow are managed dynamically or via separate transitions
        // so they are not included in the 'initial' appearance variant.
    },
    visible: (index: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1.5, // Duration for the fade-in and scale-up
            ease: "easeOut",
            delay: index * 0.05, // Staggered delay based on beam's index
        },
    }),
};

/**
 * BackgroundBeamsWithCollision component.
 * This component renders an interactive background featuring animated light beams
 * that simulate collision physics. The properties of the beams (patterns, colors,
 * and collision behaviors) are entirely fixed and managed internally.
 *
 * This component does not accept any external props, making it fully self-contained
 * as per the requirements.
 */
const BackgroundBeamsWithCollision = (): JSX.Element => {
    const containerRef = useRef<HTMLDivElement>(null);
    // beamsRef holds a mutable array of BeamData objects. Using a ref ensures
    // that the array reference itself doesn't change on re-renders,
    // which is crucial for managing mutable beam properties without triggering
    // unnecessary component updates, while still allowing access to MotionValues.
    const beamsRef = useRef<BeamData[]>([]);

    /**
     * Initializes the beam data using `useMemo`.
     * This ensures that `useMotionValue` and `useAnimationControls` hooks are called
     * consistently only once during the initial render, abiding by React's Rules of Hooks.
     * The generated beam data is then stored in `beamsRef.current`.
     */
    useMemo(() => {
        const initialBeams: BeamData[] = [];
        // Generate a fixed number of beams with random initial positions, velocities, and colors.
        for (let i = 0; i < NUM_BEAMS; i++) {
            // Random initial position within the screen bounds
            const initialX = Math.random() * (window.innerWidth - BEAM_SIZE);
            const initialY = Math.random() * (window.innerHeight - BEAM_SIZE);
            // Random initial direction (angle)
            const angle = Math.random() * 2 * Math.PI;
            // Calculate initial velocities based on speed and angle
            const vx = Math.cos(angle) * BEAM_SPEED;
            const vy = Math.sin(angle) * BEAM_SPEED;

      
        }
        beamsRef.current = initialBeams; // Store the initialized beams in the ref
    }, []); // Empty dependency array ensures this memoization runs only once on mount

    /**
     * Sets up the main animation loop for the beams using `requestAnimationFrame`.
     * This effect runs once on mount and handles the continuous update of beam positions
     * and collision detection/response. It also triggers the initial entrance animation for beams.
     */
    useEffect(() => {
        const beams = beamsRef.current; // Access the current beams array from the ref

        // Do not proceed if the container is not mounted or no beams are initialized
        if (!containerRef.current || beams.length === 0) return;

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        let animationFrameId: number | null = null;

        // Trigger initial 'visible' animation for each beam using their controls.
        // This will transition from the 'initial' variant defined in `beamAppearanceVariants`.
        beams.forEach((beam, index) => {
            beam.controls.start("visible", ); // Pass index as custom prop for staggered delay
        });

        /**
         * The core animation function, called repeatedly by `requestAnimationFrame`.
         * It updates beam positions, handles wall collisions, and detects/responds to
         * beam-to-beam collisions.
         */
        const animateBeams = () => {
            // Update positions for all beams and handle wall collisions
            beams.forEach(beam => {
                // Get the current position directly from the motion values
                let newX = beam.motionX.get() + beam.vx;
                let newY = beam.motionY.get() + beam.vy;

                // Wall collision detection and response (bounce and flash)
                if (newX < 0) {
                    newX = 0; // Clamp position
                    beam.vx *= -1; // Reverse velocity
                    // Trigger a visual flash effect on collision
                    beam.controls.start({ boxShadow: `0 0 15px 5px ${beam.color}` });
                } else if (newX + BEAM_SIZE > containerWidth) {
                    newX = containerWidth - BEAM_SIZE; // Clamp position
                    beam.vx *= -1; // Reverse velocity
                    beam.controls.start({ boxShadow: `0 0 15px 5px ${beam.color}` });
                }

                if (newY < 0) {
                    newY = 0; // Clamp position
                    beam.vy *= -1; // Reverse velocity
                    beam.controls.start({ boxShadow: `0 0 15px 5px ${beam.color}` });
                } else if (newY + BEAM_SIZE > containerHeight) {
                    newY = containerHeight - BEAM_SIZE; // Clamp position
                    beam.vy *= -1; // Reverse velocity
                    beam.controls.start({ boxShadow: `0 0 15px 5px ${beam.color}` });
                }

                // Update the motion values directly, triggering Framer Motion to update the DOM
                beam.motionX.set(newX);
                beam.motionY.set(newY);
            });

            // Beam-to-beam collision detection and response
            for (let i = 0; i < beams.length; i++) {
                for (let j = i + 1; j < beams.length; j++) {
                    const beamA = beams[i];
                    const beamB = beams[j];

                    // Get the latest positions directly from motion values for accurate collision check
                    const posA = { x: beamA.motionX.get(), y: beamA.motionY.get() };
                    const posB = { x: beamB.motionX.get(), y: beamB.motionY.get() };

                    // Calculate centers for distance calculation
                    const centerAx = posA.x + BEAM_SIZE / 2;
                    const centerAy = posA.y + BEAM_SIZE / 2;
                    const centerBx = posB.x + BEAM_SIZE / 2;
                    const centerBy = posB.y + BEAM_SIZE / 2;

                    // Calculate distance between beam centers
                    const dx = centerAx - centerBx;
                    const dy = centerAy - centerBy;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // If beams are within collision threshold
                    if (distance < COLLISION_THRESHOLD) {
                        // Simplified elastic collision response (for visual effect)
                        // Calculate collision angle
                        const angle = Math.atan2(dy, dx);
                        const sin = Math.sin(angle);
                        const cos = Math.cos(angle);

                        // Rotate velocities to align with collision axis
                        const v1x = beamA.vx * cos + beamA.vy * sin;
                        const v1y = beamA.vy * cos - beamA.vx * sin;
                        const v2x = beamB.vx * cos + beamB.vy * sin;
                        const v2y = beamB.vy * cos - beamB.vx * sin;

                        // Swap x velocities (simulating collision for equal masses)
                        const tempV1x = v1x;
                        const newV1x = v2x;
                        const newV2x = tempV1x;

                        // Rotate velocities back to original coordinate system
                        beamA.vx = newV1x * cos - v1y * sin;
                        beamA.vy = v1y * cos + newV1x * sin;
                        beamB.vx = newV2x * cos - v2y * sin;
                        beamB.vy = v2y * cos + newV2x * sin;

                        // Trigger collision visual effects for both beams
                        beamA.controls.start({ boxShadow: `0 0 20px 7px ${beamA.color}` });
                        beamB.controls.start({ boxShadow: `0 0 20px 7px ${beamB.color}` });

                        // To prevent beams from sticking, slightly separate them
                        const overlap = COLLISION_THRESHOLD - distance;
                        const adjustX = overlap * cos * 0.5;
                        const adjustY = overlap * sin * 0.5;

                        beamA.motionX.set(posA.x + adjustX);
                        beamA.motionY.set(posA.y + adjustY);
                        beamB.motionX.set(posB.x - adjustX);
                        beamB.motionY.set(posB.y - adjustY);
                    }
                }
            }
            // Request the next animation frame
            animationFrameId = requestAnimationFrame(animateBeams);
        };

        // Start the animation loop
        animationFrameId = requestAnimationFrame(animateBeams);

        // Cleanup function: cancel the animation frame when the component unmounts
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount

    /**
     * Renders the BackgroundBeamsWithCollision component.
     * It wraps the beam container in an ErrorBoundary for robustness.
     * Each beam is rendered as a `motion.div` element.
     * @returns A JSX element representing the background beams animation.
     */
    return (
        <ErrorBoundary>
            <div
                ref={containerRef}
                className="relative w-full h-screen overflow-hidden bg-gray-950"
            >
                {beamsRef.current.map((beam) => (
                    <motion.div
                        key={beam.id}
                        className="absolute rounded-full"
                        style={{
                            width: BEAM_SIZE,
                            height: BEAM_SIZE,
                            backgroundColor: beam.color,
                            x: beam.motionX, // Bind x-position to Framer MotionValue
                            y: beam.motionY, // Bind y-position to Framer MotionValue
                            boxShadow: `0 0 8px 2px ${beam.color}` // Default glowing shadow
                        }}
                        initial="initial" // Start from the 'initial' state defined in variants
                        animate={beam.controls} // Use controls for all animations (initial appearance and collision effects)
                        variants={beamAppearanceVariants as Variants} // Link to the defined variants
                        custom={beam.id} // Pass beam's ID as custom prop for staggered animation
                        transition={{
                            // Define transition for boxShadow, making it flash quickly then fade back
                            boxShadow: {
                                type: "tween", // Use a tween for a quick flash
                                duration: 0.1, // Very quick flash duration
                                ease: "easeOut",
                                // After the flash, animate the boxShadow back to its default state
                            }
                        }}
                    />
                ))}
            </div>
        </ErrorBoundary>
    );
};

export default BackgroundBeamsWithCollision;