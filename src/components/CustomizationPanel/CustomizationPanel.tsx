import React, { useState, ChangeEvent, JSX } from 'react';
import { motion, Variants } from 'framer-motion';

// --- CONSTANT DATA ---
// By defining data here, the component remains self-contained and
// does not require any props, adhering to the specified architecture.

/**
 * The main title for the customization panel.
 * @type {string}
 */
const PANEL_TITLE: string = 'World Customization';

/**
 * Configuration for the 'Terrain Steepness' control.
 * @property {string} label - The display label for the control.
 * @property {number} initialValue - The starting value for the slider.
 * @property {number} min - The minimum value for the slider.
 * @property {number} max - The maximum value for the slider.
 */
const TERRAIN_CONTROL = {
	label: 'Terrain Steepness',
	initialValue: 50,
	min: 0,
	max: 100,
};

/**
 * Configuration for the 'Sky Color' control.
 * @property {string} label - The display label for the control.
 * @property {string} initialValue - The starting color value (a valid CSS color).
 */
const SKY_COLOR_CONTROL = {
	label: 'Sky Color',
	initialValue: '#87CEEB', // A pleasant default sky blue
};

/**
 * Configuration for the 'World Theme' control.
 * @property {string} label - The display label for the control.
 * @property {string[]} options - A list of available themes for the dropdown.
 */
const WORLD_THEME_CONTROL = {
	label: 'World Theme',
	options: ['Cyberpunk', 'Fantasy', 'Wasteland', 'Steampunk', 'Aquatic'],
};

// --- ANIMATION VARIANTS ---

/**
 * Variants for the main panel container.
 * Animates the panel sliding in from the left and orchestrates the staggering of its children.
 */
const panelVariants: Variants = {
	hidden: { x: '-100%', opacity: 0 },
	visible: {
		x: 0,
		opacity: 1,
		transition: {
			type: 'spring',
			stiffness: 90,
			damping: 20,
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

/**
 * Variants for individual items within the panel (title and control groups).
 * Creates a subtle fade-in and slide-up effect for each item.
 */
const itemVariants: Variants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring',
			stiffness: 100,
		},
	},
};

/**
 * @component CustomizationPanel
 * @description A self-contained side panel with hardcoded controls for customizing a 3D world.
 * It manages its own state for elements like sliders, color pickers, and dropdowns,
 * requiring no props to function. This design choice makes it a highly reusable and
 * independent "plug-and-play" component.
 *
 * @returns {JSX.Element} The rendered CustomizationPanel component.
 */
const CustomizationPanel = (): JSX.Element => {
	// --- STATE MANAGEMENT ---
	// Each control's value is managed by its own `useState` hook,
	// ensuring a clear and predictable state flow within the component.

	/**
	 * State for the current value of the terrain steepness slider.
	 */
	const [terrainSteepness, setTerrainSteepness] = useState<number>(
		TERRAIN_CONTROL.initialValue,
	);

	/**
	 * State for the current value of the sky color picker.
	 */
	const [skyColor, setSkyColor] = useState<string>(SKY_COLOR_CONTROL.initialValue);

	/**
	 * State for the currently selected world theme from the dropdown.
	 */
	const [worldTheme, setWorldTheme] = useState<string>(WORLD_THEME_CONTROL.options[0]);

	// --- EVENT HANDLERS ---
	// Typed event handlers to update the component's state upon user interaction.

	/**
	 * Handles changes to the terrain steepness slider.
	 * @param {ChangeEvent<HTMLInputElement>} event - The input change event.
	 */
	const handleTerrainChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setTerrainSteepness(Number(event.target.value));
	};

	/**
	 * Handles changes to the sky color input.
	 * @param {ChangeEvent<HTMLInputElement>} event - The input change event.
	 */
	const handleSkyColorChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setSkyColor(event.target.value);
	};

	/**
	 * Handles changes to the world theme dropdown.
	 * @param {ChangeEvent<HTMLSelectElement>} event - The select change event.
	 */
	const handleWorldThemeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
		setWorldTheme(event.target.value);
	};

	return (
		<motion.aside
			className="w-[300px] h-screen bg-zinc-900 text-zinc-200 p-6 font-sans flex flex-col border-r border-zinc-800"
			aria-labelledby="customization-panel-title"
			variants={panelVariants as Variants}
			initial="hidden"
			animate="visible"
		>
			<motion.h2
				id="customization-panel-title"
				className="mb-6 text-2xl font-semibold border-b border-zinc-700 pb-4"
				variants={itemVariants as Variants}
			>
				{PANEL_TITLE}
			</motion.h2>

			{/* Terrain Steepness Control */}
			<motion.div className="mb-7" variants={itemVariants as Variants}>
				<label
					htmlFor="terrainSteepness"
					className="block mb-2.5 text-base font-medium text-zinc-400"
				>
					{TERRAIN_CONTROL.label}
				</label>
				<div className="flex items-center gap-3">
					<input
						type="range"
						id="terrainSteepness"
						min={TERRAIN_CONTROL.min}
						max={TERRAIN_CONTROL.max}
						value={terrainSteepness}
						onChange={handleTerrainChange}
						className="flex-1 h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-sky-500"
						aria-valuemin={TERRAIN_CONTROL.min}
						aria-valuemax={TERRAIN_CONTROL.max}
						aria-valuenow={terrainSteepness}
					/>
					<span className="min-w-[40px] text-center bg-zinc-800 px-2 py-1 rounded text-sm">
						{terrainSteepness}
					</span>
				</div>
			</motion.div>

			{/* Sky Color Control */}
			<motion.div className="mb-7" variants={itemVariants as Variants}>
				<label htmlFor="skyColor" className="block mb-2.5 text-base font-medium text-zinc-400">
					{SKY_COLOR_CONTROL.label}
				</label>
				<input
					type="color"
					id="skyColor"
					value={skyColor}
					onChange={handleSkyColorChange}
					className="w-full h-10 p-1 bg-transparent rounded border border-zinc-600 cursor-pointer"
					title="Select sky color"
				/>
			</motion.div>

			{/* World Theme Control */}
			<motion.div className="mb-7" variants={itemVariants as Variants}>
				<label
					htmlFor="worldTheme"
					className="block mb-2.5 text-base font-medium text-zinc-400"
				>
					{WORLD_THEME_CONTROL.label}
				</label>
				<select
					id="worldTheme"
					value={worldTheme}
					onChange={handleWorldThemeChange}
					className="w-full p-2.5 rounded border border-zinc-600 bg-zinc-800 text-zinc-200 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-sky-500"
				>
					{WORLD_THEME_CONTROL.options.map(theme => (
						<option key={theme} value={theme} className="bg-zinc-800 text-zinc-200">
							{theme}
						</option>
					))}
				</select>
			</motion.div>
		</motion.aside>
	);
};

export default CustomizationPanel;