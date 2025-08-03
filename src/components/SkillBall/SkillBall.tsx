import React, { useMemo, JSX, CSSProperties } from 'react';
import { motion, Variants } from 'framer-motion';

/**
 * @typedef {object} SkillData
 * @description Defines the structure for a skill's display properties.
 * @property {string} name - The name of the skill (e.g., 'TypeScript').
 * @property {string} backgroundColor - The primary background color of the skill ball.
 * @property {string} highlightColor - A lighter color for the gradient highlight, giving a 3D effect.
 * @property {string} textColor - The color of the skill name text.
 */
type SkillData = {
	name: string;
	backgroundColor: string;
	highlightColor: string;
	textColor: string;
};

/**
 * @constant {SkillData} SKILL_DATA
 * @description Constant data for a single skill. In accordance with the project guideline
 * of not passing props to components, this component is hardcoded to represent
 * a specific skill. To render a ball for a different skill, this constant
 * would need to be modified, or a new, similar component would be created.
 */
const SKILL_DATA: SkillData = {
	name: 'JavaScript',
	backgroundColor: '#f7df1e',
	highlightColor: '#f8e76c',
	textColor: '#000000',
};

/**
 * Defines the animation states for the SkillBall component.
 * - `initial`: The state before the component mounts (scaled down and transparent).
 * - `animate`: The state to animate to upon mounting, creating a "pop-in" effect.
 * - `hover`: The state for when the user hovers over the ball, making it larger.
 * - `tap`: The state for when the user clicks or taps the ball, giving immediate feedback.
 * @type {Variants}
 */
const ballVariants: Variants = {
	initial: {
		opacity: 0,
		scale: 0.5,
		x: '-50%', // Ensures positioning is maintained with translate classes
		y: '-50%',
	},
	animate: {
		opacity: 1,
		scale: 1,
		transition: {
			type: 'spring',
			stiffness: 260,
			damping: 20,
			// A slight random delay makes multiple balls appear more organically if rendered together
			delay: Math.random() * 0.2,
		},
	},
	hover: {
		scale: 1.1,
		zIndex: 10,
		transition: { type: 'spring', stiffness: 300 },
	},
	tap: {
		scale: 0.95,
		zIndex: 20, // Bring to the very front when being dragged
		transition: { type: 'spring', stiffness: 400, damping: 15 },
	},
};

/**
 * A 3D-styled, physics-based draggable ball representing a single technology skill.
 *
 * @component
 * @example
 * // In a parent component, you can simply render SkillBall.
 * // For optimal placement and drag constraints, place it inside a positioned container.
 * // import SkillBall from './SkillBall';
 * // import { ErrorBoundary } from 'react-error-boundary';
 * //
 * // const MyPage = () => (
 * //   <div className="relative h-screen w-screen">
 * //     <ErrorBoundary fallback={<div>Something went wrong with the SkillBall</div>}>
 * //       <SkillBall />
 * //     </ErrorBoundary>
 * //   </div>
 * // );
 *
 * @description
 * The `SkillBall` component renders a single interactive sphere designed to be "tossed"
 * around the screen using mouse or touch interactions, powered by `framer-motion`.
 *
 * Following strict project guidelines, this component is fully self-contained and
 * does not accept any props. The skill it represents is defined by the internal
 * constant `SKILL_DATA`.
 *
 * The ball is draggable within the entire viewport by default. This is the most flexible
 * approach given the "no props" rule, as it prevents the component from needing a
 * `dragConstraints` ref from a parent.
 *
 * This component is designed to be robust and is unlikely to cause rendering errors.
 * However, in a production application, it is best practice to wrap instances of
 * `SkillBall` within an `ErrorBoundary` component to handle any unforeseen issues gracefully.
 *
 * @returns {JSX.Element} The rendered SkillBall component.
 */
const SkillBall = (): JSX.Element => {
	/**
	 * Memoized style object for the dynamic parts of the skill ball's style.
	 * The background uses a radial gradient to simulate a 3D lighting effect on the sphere.
	 * The text color is also dynamic. These cannot be represented by standard Tailwind classes.
	 * @type {React.CSSProperties}
	 */
	const dynamicBallStyle = useMemo(
		(): CSSProperties => ({
			background: `radial-gradient(circle at 30% 30%, ${SKILL_DATA.highlightColor}, ${SKILL_DATA.backgroundColor})`,
			color: SKILL_DATA.textColor,
		}),
		[],
	);

	return (
		<motion.div
			aria-label={`Draggable skill ball for ${SKILL_DATA.name}`}
			style={dynamicBallStyle}
			className="absolute top-1/2 left-1/2 flex h-32 w-32 cursor-grab select-none items-center justify-center rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_-5px_10px_rgba(0,0,0,0.3)] active:cursor-grabbing"
			// Animation Variants
			variants={ballVariants as Variants}
			initial="initial"
			animate="animate"
			whileHover="hover"
			whileTap="tap"
			// Physics-based Drag Properties (preserved from original)
			drag
			dragMomentum={true}
			dragElastic={0.1}
			dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
			// By not providing dragConstraints, the ball can be moved anywhere in the viewport.
		>
			<span className="pointer-events-none text-lg font-bold [text-shadow:1px_1px_3px_rgba(0,0,0,0.2)]">
				{SKILL_DATA.name}
			</span>
		</motion.div>
	);
};

export default SkillBall;