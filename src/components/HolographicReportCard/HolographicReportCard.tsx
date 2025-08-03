import React, { JSX } from 'react';
import { motion, useMotionValue, useTransform, Variants } from 'framer-motion';

// #region TYPE DEFINITIONS
/**
 * Defines the possible letter grades.
 */
type Grade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

/**
 * Defines the possible effort levels.
 */
type Effort = 'OUTSTANDING' | 'EXCELLENT' | 'SATISFACTORY' | 'NEEDS IMPROVEMENT';

/**
 * Represents a single course's data on the report card.
 */
type ReportItem = {
	subject: string;
	grade: Grade;
	effort: Effort;
	teacher: string;
	comment: string;
};
// #endregion

// #region CONSTANT DATA
/**
 * Static data for the student.
 * This information is hard-coded to ensure the component is self-contained.
 * @constant
 */
const STUDENT_DATA = {
	name: 'Cadet Jax Orbison',
	id: 'XJ-77-DELTA',
	avatarUrl: 'https://picsum.photos/200/200.webp',
	program: 'Astro-Physics & Xenolinguistics',
	term: 'Stardate 51423.7',
	issuingOfficer: 'Cmdr. Eva Rostova',
};

/**
 * Static data for the student's grades and feedback.
 * This array of objects populates the main content of the report card.
 * @constant
 */
const REPORT_DATA: readonly ReportItem[] = [
	{
		subject: 'Quantum Mechanics 101',
		grade: 'A+',
		effort: 'OUTSTANDING',
		teacher: 'Dr. Aris Thorne',
		comment: 'Jax demonstrates an intuitive grasp of multi-dimensional principles. A truly exceptional mind.',
	},
	{
		subject: 'Galactic History',
		grade: 'A',
		effort: 'EXCELLENT',
		teacher: 'Prof. Lena Halcyon',
		comment: 'Excellent synthesis of pre-and-post Federation events. Consistently high-quality analysis.',
	},
	{
		subject: 'Xenolinguistics (K\'tharr)',
		grade: 'B',
		effort: 'SATISFACTORY',
		teacher: 'Specialist Zorg',
		comment: 'Fluency is improving, but pronunciation of glottal stops requires more practice. Diligent effort noted.',
	},
	{
		subject: 'Starship Piloting Simulation',
		grade: 'A',
		effort: 'EXCELLENT',
		teacher: 'Captain Rex',
		comment: 'Flawless execution of the Kobayashi Maru V2 simulation. Natural leadership potential.',
	},
	{
		subject: 'Holodeck Ethics',
		grade: 'C',
		effort: 'NEEDS IMPROVEMENT',
		teacher: 'Counselor Deia',
		comment: 'Student shows a tendency to resolve photonic conflicts with excessive force. De-escalation protocols need review.',
	},
];

/**
 * A map to associate grades with specific Tailwind CSS classes for color-coding.
 * @constant
 */
const GRADE_CLASS_MAP: Record<Grade, string> = {
	'A+': 'text-[#4dffaf] font-bold',
	'A': 'text-[#4dffaf] font-bold',
	'B': 'text-[#e0faff]',
	'C': 'text-[#ffdb58]',
	'D': 'text-[#ff5e5e]',
	'F': 'text-[#ff5e5e]',
};
// #endregion

// #region ANIMATION VARIANTS
/**
 * Variants for the main card container. Controls the overall appearance
 * and staggers the animation of its direct children (header, main, footer).
 */
const cardContainerVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.5,
			ease: 'easeOut',
			staggerChildren: 0.15,
		},
	},
};

/**
 * Variants for the main sections of the card (header, main, footer).
 * Creates a subtle slide-in and fade-in effect.
 */
const sectionVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: 'easeOut' },
	},
};

/**
 * Variants for list containers (table body and feedback list).
 * It doesn't have its own animation but staggers its children.
 */
const listContainerVariants: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.08,
		},
	},
};

/**
 * Variants for individual table rows.
 */
const tableRowVariants: Variants = {
	hidden: { opacity: 0, x: -20 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.4, ease: 'easeOut' },
	},
};

/**
 * Variants for individual feedback items.
 */
const feedbackItemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: 'easeOut' },
	},
};
// #endregion

/**
 * The HolographicReportCard component displays a futuristic, holographic-style
 * report card. It is a self-contained, presentation-only component with all
 * data hard-coded as constants. It features interactive 3D tilt and glare
 * effects on mouseover, implemented using `framer-motion`.
 *
 * This component should ideally be wrapped in an ErrorBoundary in a production application.
 * e.g., <ErrorBoundary fallback={<div>Error</div>}><HolographicReportCard /></ErrorBoundary>
 *
 * @returns {JSX.Element} The rendered HolographicReportCard component.
 */
const HolographicReportCard = (): JSX.Element => {
	// --- Animation Hooks ---
	// Create motion values to track the mouse position relative to the card's center.
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	// Create transformed motion values to map mouse position to 3D rotation.
	const rotateX = useTransform(y, [-400, 400], [10, -10]);
	const rotateY = useTransform(x, [-400, 400], [-10, 10]);

	/**
	 * Handles the mouse move event on the card.
	 * Updates the motion values for the 3D tilt effect and sets CSS custom
	 * properties for the radial glare effect.
	 * @param {React.MouseEvent<HTMLDivElement>} event - The mouse event.
	 */
	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		// Update motion values relative to the center of the card
		x.set(event.clientX - rect.left - rect.width / 2);
		y.set(event.clientY - rect.top - rect.height / 2);

		// Update CSS custom properties for the glare effect
		event.currentTarget.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
		event.currentTarget.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
	};

	/**
	 * Resets the motion values when the mouse leaves the card,
	 * returning it to its default non-tilted state.
	 */
	const handleMouseLeave = () => {
		x.set(0);
		y.set(0);
	};

	return (
		<div className="flex items-center justify-center min-h-screen p-8 bg-[#05081a] font-sans [perspective:1500px]">
			<motion.div
				className="relative w-[900px] max-w-[95vw] p-8 rounded-2xl border border-cyan-400/30 text-[#e0faff] overflow-hidden 
                   bg-[radial-gradient(circle_at_50%_50%,rgba(20,30,80,0.5),rgba(0,0,20,0.8))] 
                   backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,255,0.3),_inset_0_0_20px_rgba(0,200,255,0.2)]
                   [transform-style:preserve-3d]
                   before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,rgba(0,255,255,0.1),rgba(0,255,255,0.1)_1px,transparent_1px,transparent_4px)]
                   before:opacity-50 before:pointer-events-none"
				style={{ rotateX, rotateY }}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
				variants={cardContainerVariants as Variants}
				initial="hidden"
				animate="visible"
			>
				<div className="absolute inset-0 size-full pointer-events-none bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(0,255,255,0.25),transparent_40%)]" />

				<motion.header
					className="relative z-10 flex items-center gap-6 pb-6 mb-6 border-b border-cyan-400/20"
					variants={sectionVariants as Variants}
				>
					<img src={STUDENT_DATA.avatarUrl} alt="Student Avatar" className="object-cover border-2 rounded-full size-24 border-cyan-400/50 shadow-[0_0_10px_rgba(0,255,255,0.5),_inset_0_0_5px_rgba(0,255,255,0.3)]" />
					<div>
						<h1 className="text-4xl font-extrabold text-white tracking-[2px] [text-shadow:0_0_4px_#fff,0_0_8px_#0ff,0_0_15px_#0ff]">{STUDENT_DATA.name}</h1>
						<p className="mt-1 text-sm uppercase text-[#a0c0ff] tracking-wider">ID: {STUDENT_DATA.id}</p>
						<p className="mt-1 text-sm uppercase text-[#a0c0ff] tracking-wider">Program: {STUDENT_DATA.program}</p>
					</div>
				</motion.header>

				<motion.main className="relative z-10" variants={sectionVariants as Variants}>
					<table className="w-full mb-6 border-collapse">
						<thead>
							<tr>
								<th className="p-3 text-sm text-left uppercase text-[#80e0ff] tracking-[1.5px] border-b border-cyan-400/10 whitespace-nowrap [text-shadow:0_0_5px_rgba(0,255,255,0.7)]">Subject</th>
								<th className="p-3 text-sm text-left uppercase text-[#80e0ff] tracking-[1.5px] border-b border-cyan-400/10 whitespace-nowrap [text-shadow:0_0_5px_rgba(0,255,255,0.7)]">Grade</th>
								<th className="p-3 text-sm text-left uppercase text-[#80e0ff] tracking-[1.5px] border-b border-cyan-400/10 whitespace-nowrap [text-shadow:0_0_5px_rgba(0,255,255,0.7)]">Effort</th>
							</tr>
						</thead>
						<motion.tbody variants={listContainerVariants as Variants} initial="hidden" animate="visible">
							{REPORT_DATA.map(item => (
								<motion.tr key={item.subject} variants={tableRowVariants as Variants}>
									<td className="p-3 text-base text-[#d0faff] border-b border-cyan-400/10 whitespace-nowrap">{item.subject}</td>
									<td className={`p-3 text-base border-b border-cyan-400/10 whitespace-nowrap ${GRADE_CLASS_MAP[item.grade]}`}>{item.grade}</td>
									<td className="p-3 text-base text-[#d0faff] border-b border-cyan-400/10 whitespace-nowrap">{item.effort}</td>
								</motion.tr>
							))}
						</motion.tbody>
					</table>

					<div>
						<h2 className="pb-3 mt-8 mb-4 text-2xl border-b text-[#80e0ff] border-cyan-400/20 [text-shadow:0_0_5px_rgba(0,255,255,0.7)]">Instructor Feedback</h2>
						<motion.div variants={listContainerVariants as Variants} initial="hidden" animate="visible">
							{REPORT_DATA.map(item => (
								<motion.div key={item.subject} className="mb-5" variants={feedbackItemVariants as Variants}>
									<div className="flex items-baseline justify-between mb-1.5">
										<strong className="text-lg text-[#a0c0ff]">{item.subject}</strong>
										<span className="text-sm italic text-[#80e0ff]">{item.teacher}</span>
									</div>
									<p className="italic leading-relaxed text-[#d0faff] pl-4 border-l-2 border-cyan-400/20">"{item.comment}"</p>
								</motion.div>
							))}
						</motion.div>
					</div>
				</motion.main>

				<motion.footer
					className="relative z-10 pt-4 mt-8 text-xs text-right border-t text-[#a0c0ff] border-cyan-400/20"
					variants={sectionVariants as Variants}
				>
					<p>Issued on {STUDENT_DATA.term}</p>
					<p>Authorizing Officer: {STUDENT_DATA.issuingOfficer}</p>
				</motion.footer>
			</motion.div>
		</div>
	);
};

export default HolographicReportCard;