import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
	JSX,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {object} Vector2D Represents a 2D coordinate.
 * @property {number} x - The x-coordinate.
 * @property {number} y - The y-coordinate.
 */
type Vector2D = {
	x: number;
	y: number;
};

/**
 * @typedef {('START_SCREEN' | 'PLAYING' | 'PAUSED' | 'WAVE_TRANSITION' | 'GAME_OVER' | 'VICTORY')} GameStatus
 * Represents the different states of the game.
 */
type GameStatus =
	| 'START_SCREEN'
	| 'PLAYING'
	| 'PAUSED'
	| 'WAVE_TRANSITION'
	| 'GAME_OVER'
	| 'VICTORY';

/**
 * @typedef {object} GameState
 * @property {number} focus - Player's health. Reaching 0 means game over.
 * @property {number} motivation - Currency to buy towers.
 * @property {number} currentWave - The current wave number (0-indexed).
 * @property {GameStatus} status - The current status of the game.
 */
type GameState = {
	focus: number;
	motivation: number;
	currentWave: number;
	status: GameStatus;
};

/**
 * @typedef {object} TowerSpec
 * @property {string} name - The name of the tower.
 * @property {string} description - A brief description.
 * @property {number} cost - The motivation cost to build the tower.
 * @property {number} range - The attack range in pixels.
 * @property {number} damage - The damage dealt per attack.
 * @property {number} attackSpeed - Time between attacks in milliseconds.
 * @property {string} icon - Emoji or character representing the tower.
 * @property {string} projectileColor - The color of the tower's projectile.
 */
type TowerSpec = {
	readonly name: string;
	readonly description: string;
	readonly cost: number;
	readonly range: number;
	readonly damage: number;
	readonly attackSpeed: number; // ms
	readonly icon: string;
	readonly projectileColor: string;
};

/**
 * @typedef {object} TowerInstance
 * @property {string} id - A unique identifier for the tower instance.
 * @property {keyof typeof TOWER_SPECS} type - The type of the tower.
 * @property {Vector2D} position - The position on the game grid.
 * @property {number} lastAttackTime - Timestamp of the last attack.
 * @property {string | null} targetId - The ID of the currently targeted zombie.
 */
type TowerInstance = {
	id: string;
	type: keyof typeof TOWER_SPECS;
	position: Vector2D;
	lastAttackTime: number;
	targetId: string | null;
};

/**
 * @typedef {object} ZombieSpec
 * @property {string} name - The name of the zombie.
 * @property {number} health - The health of the zombie.
 * @property {number} speed - The speed of the zombie in pixels per second.
 * @property {number} motivationOnDefeat - Motivation awarded when defeated.
 * @property {string} image - URL for the zombie's image.
 */
type ZombieSpec = {
	readonly name: string;
	readonly health: number;
	readonly speed: number; // pixels per second
	readonly motivationOnDefeat: number;
	readonly image: string;
};

/**
 * @typedef {object} ZombieInstance
 * @property {string} id - A unique identifier for the zombie instance.
 * @property {keyof typeof ZOMBIE_SPECS} type - The type of the zombie.
 * @property {number} currentHealth - The current health of the zombie.
 * @property {Vector2D} position - The current position on the game grid.
 * @property {number} pathIndex - The index of the current path segment target.
 * @property {number} distanceTraveled - The total distance traveled along the current path segment.
 */
type ZombieInstance = {
	id: string;
	type: keyof typeof ZOMBIE_SPECS;
	currentHealth: number;
	position: Vector2D;
	pathIndex: number;
	distanceTraveled: number;
};

/**
 * @typedef {object} Projectile
 * @property {string} id - Unique ID for the projectile.
 * @property {Vector2D} start - Starting position.
 * @property {Vector2D} end - Target's current position at time of firing.
 * @property {string} color - Projectile color.
 */
type Projectile = {
	id: string;
	start: Vector2D;
	end: Vector2D;
	color: string;
};

/**
 * @typedef {object} Wave
 * @property {Array<{type: keyof typeof ZOMBIE_SPECS, delay: number}>} spawns - An array of zombies to spawn, with a delay in ms since the start of the wave.
 */
type Wave = {
	readonly spawns: {
		readonly type: keyof typeof ZOMBIE_SPECS;
		readonly delay: number; // ms from wave start
	}[];
};

// --- GAME CONSTANTS ---

const GAME_CONFIG = {
	gridSize: { width: 800, height: 600 },
	cellSize: 40,
	initialFocus: 20,
	initialMotivation: 150,
	tickRate: 16, // roughly 60fps
} as const;

const TOWER_SPECS = {
	coffee: {
		name: 'Coffee Mug',
		description: 'Fast-firing, low-damage caffeine jolt.',
		cost: 50,
		range: 100,
		damage: 10,
		attackSpeed: 500,
		icon: '☕',
		projectileColor: '#8c5a2d',
	},
	todo: {
		name: 'To-Do List',
		description: 'Medium range and damage, organizes chaos.',
		cost: 100,
		range: 130,
		damage: 25,
		attackSpeed: 1000,
		icon: '📝',
		projectileColor: '#4a90e2',
	},
	pomodoro: {
		name: 'Pomodoro Timer',
		description: 'Slow but powerful, long-range focus beam.',
		cost: 250,
		range: 200,
		damage: 70,
		attackSpeed: 2000,
		icon: '🍅',
		projectileColor: '#e24a4a',
	},
} as const;

const ZOMBIE_SPECS = {
	socialMedia: {
		name: 'Social Media Scroll Zombie',
		health: 100,
		speed: 40,
		motivationOnDefeat: 5,
		image: 'https://picsum.photos/id/103/40/40.webp',
	},
	chore: {
		name: 'Urgent Chore Gremlin',
		health: 250,
		speed: 25,
		motivationOnDefeat: 10,
		image: 'https://picsum.photos/id/211/40/40.webp',
	},
	netflix: {
		name: 'Netflix Binge Beast',
		health: 600,
		speed: 20,
		motivationOnDefeat: 25,
		image: 'https://picsum.photos/id/431/40/40.webp',
	},
} as const;

const PATH_COORDS: readonly Vector2D[] = [
	{ x: 0, y: 300 },
	{ x: 150, y: 300 },
	{ x: 150, y: 100 },
	{ x: 450, y: 100 },
	{ x: 450, y: 500 },
	{ x: 650, y: 500 },
	{ x: 650, y: 200 },
	{ x: 800, y: 200 },
];

const LEVEL_WAVES: readonly Wave[] = [
	{
		spawns: [
			{ type: 'socialMedia', delay: 1000 },
			{ type: 'socialMedia', delay: 2000 },
			{ type: 'socialMedia', delay: 3000 },
			{ type: 'socialMedia', delay: 4000 },
			{ type: 'socialMedia', delay: 5000 },
		],
	},
	{
		spawns: [
			{ type: 'socialMedia', delay: 1000 },
			{ type: 'socialMedia', delay: 1500 },
			{ type: 'chore', delay: 3000 },
			{ type: 'socialMedia', delay: 4000 },
			{ type: 'socialMedia', delay: 4500 },
			{ type: 'chore', delay: 6000 },
		],
	},
	{
		spawns: [
			{ type: 'chore', delay: 1000 },
			{ type: 'chore', delay: 2000 },
			{ type: 'netflix', delay: 4000 },
			{ type: 'socialMedia', delay: 4500 },
			{ type: 'socialMedia', delay: 5000 },
			{ type: 'socialMedia', delay: 5500 },
		],
	},
	{
		spawns: [
			{ type: 'netflix', delay: 1000 },
			{ type: 'chore', delay: 1500 },
			{ type: 'chore', delay: 2500 },
			{ type: 'netflix', delay: 5000 },
			{ type: 'socialMedia', delay: 5200 },
			{ type: 'socialMedia', delay: 5400 },
			{ type: 'socialMedia', delay: 5600 },
			{ type: 'socialMedia', delay: 5800 },
		],
	},
];

const TOWER_PLACEMENT_AREAS = [
	{ x: 50, y: 200, width: 250, height: 80 },
	{ x: 200, y: 150, width: 200, height: 300 },
	{ x: 500, y: 250, width: 100, height: 200 },
	{ x: 500, y: 0, width: 250, height: 150 },
];

const INITIAL_GAME_STATE: GameState = {
	focus: GAME_CONFIG.initialFocus,
	motivation: GAME_CONFIG.initialMotivation,
	currentWave: 0,
	status: 'START_SCREEN',
};

// --- HELPER FUNCTIONS ---

const getDistance = (p1: Vector2D, p2: Vector2D): number => {
	const dx = p1.x - p2.x;
	const dy = p1.y - p2.y;
	return Math.sqrt(dx * dx + dy * dy);
};

const isTowerPlacementValid = (point: Vector2D): boolean => {
	return TOWER_PLACEMENT_AREAS.some(
		(area) =>
			point.x >= area.x &&
			point.x <= area.x + area.width &&
			point.y >= area.y &&
			point.y <= area.y + area.height,
	);
};

// --- ANIMATION VARIANTS ---

const overlayVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.3,
			ease: 'easeOut',
			when: 'beforeChildren',
			staggerChildren: 0.1,
		},
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: 0.2, ease: 'easeIn' },
	},
};

const overlayItemVariants: Variants = {
	hidden: { y: 20, opacity: 0 },
	visible: { y: 0, opacity: 1, transition: { ease: 'easeOut' } },
};

// --- INTERNAL COMPONENTS ---

const OverlayScreen = ({
	title,
	message,
	buttonText,
	onButtonClick,
}: {
	title: string;
	message: string;
	buttonText: string;
	onButtonClick: () => void;
}): JSX.Element => (
	<motion.div
		variants={overlayVariants as Variants}
		initial="hidden"
		animate="visible"
		exit="exit"
		className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/70 font-sans text-center text-white"
	>
		<motion.h1
			variants={overlayItemVariants as Variants}
			className="mb-4 text-5xl font-bold"
		>
			{title}
		</motion.h1>
		<motion.p
			variants={overlayItemVariants as Variants}
			className="mb-8 max-w-lg text-xl"
		>
			{message}
		</motion.p>
		<motion.button
			variants={overlayItemVariants as Variants}
			onClick={onButtonClick}
			whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
			whileTap={{ scale: 0.95 }}
			className="cursor-pointer rounded-md bg-green-600 px-8 py-4 text-xl text-white transition-colors hover:bg-green-700 active:bg-green-800"
		>
			{buttonText}
		</motion.button>
	</motion.div>
);

// --- MAIN GAME COMPONENT ---

const TimeManagementGame = (): JSX.Element => {
	// --- ANIMATION VARIANTS ---
	const towerVariants: Variants = {
		initial: { scale: 0, rotate: -180 },
		animate: {
			scale: 1,
			rotate: 0,
			transition: { type: 'spring', stiffness: 260, damping: 20 },
		},
	};

	const zombieVariants: Variants = {
		exit: {
			opacity: 0,
			scale: 0.5,
			rotate: 360,
			transition: { duration: 0.3 },
		},
	};

	const projectileVariants: Variants = {
		fire: {
			pathLength: 1,
			opacity: 0,
			transition: { duration: 0.2, ease: 'linear' },
		},
	};

	const bottomControlsVariants: Variants = {
		hidden: { y: '110%' },
		visible: {
			y: '0%',
			transition: {
				type: 'spring',
				stiffness: 150,
				damping: 25,
				staggerChildren: 0.1,
			},
		},
	};

	const towerButtonVariants: Variants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1 },
	};

	// --- STATE MANAGEMENT ---
	const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
	const [towers, setTowers] = useState<TowerInstance[]>([]);
	const [zombies, setZombies] = useState<ZombieInstance[]>([]);
	const [projectiles, setProjectiles] = useState<Projectile[]>([]);
	const [selectedTower, setSelectedTower] =
		useState<keyof typeof TOWER_SPECS | null>(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	// --- REFS FOR GAME LOOP ---
	const gameLoopRef = useRef<number>(0);
	const lastUpdateTimeRef = useRef<number>(0);
	const waveStartTimeRef = useRef<number>(0);
	const waveSpawnIndexRef = useRef<number>(0);

	// --- MEMOIZED VALUES ---
	const currentWaveData = useMemo(
		() => LEVEL_WAVES[gameState.currentWave],
		[gameState.currentWave],
	);

	// --- GAME LOGIC & CALLBACKS ---
	const resetGame = useCallback(() => {
		setGameState(INITIAL_GAME_STATE);
		setTowers([]);
		setZombies([]);
		setProjectiles([]);
		setSelectedTower(null);
		waveSpawnIndexRef.current = 0;
		waveStartTimeRef.current = 0;
		if (gameLoopRef.current) {
			cancelAnimationFrame(gameLoopRef.current);
			gameLoopRef.current = 0;
		}
	}, []);

	const handleZombieEscape = useCallback(() => {
		setGameState((prev) => {
			const newFocus = prev.focus - 1;
			if (newFocus <= 0) {
				return { ...prev, focus: 0, status: 'GAME_OVER' };
			}
			return { ...prev, focus: newFocus };
		});
	}, []);

	const startNextWave = useCallback(() => {
		if (gameState.status !== 'WAVE_TRANSITION') return;
		waveStartTimeRef.current = performance.now();
		waveSpawnIndexRef.current = 0;
		setGameState((prev) => ({ ...prev, status: 'PLAYING' }));
	}, [gameState.status]);

	const gameLoop = useCallback(
		(timestamp: number) => {
			if (
				gameState.status !== 'PLAYING' ||
				gameState.focus <= 0 ||
				!currentWaveData
			) {
				lastUpdateTimeRef.current = timestamp;
				gameLoopRef.current = requestAnimationFrame(gameLoop);
				return;
			}

			const deltaTime = timestamp - lastUpdateTimeRef.current;
			if (deltaTime < GAME_CONFIG.tickRate) {
				gameLoopRef.current = requestAnimationFrame(gameLoop);
				return;
			}
			const timeSinceWaveStart = timestamp - waveStartTimeRef.current;
			const timeScale = deltaTime / 1000;

			let newZombies = [...zombies];
			let newTowers = [...towers];
			let newProjectiles = [...projectiles];
			let motivationGained = 0;

			if (
				waveSpawnIndexRef.current < currentWaveData.spawns.length &&
				timeSinceWaveStart >=
					currentWaveData.spawns[waveSpawnIndexRef.current].delay
			) {
				const spawn = currentWaveData.spawns[waveSpawnIndexRef.current];
				const newZombie: ZombieInstance = {
					id: `zombie-${timestamp}-${Math.random()}`,
					type: spawn.type,
					currentHealth: ZOMBIE_SPECS[spawn.type].health,
					position: { ...PATH_COORDS[0] },
					pathIndex: 1,
					distanceTraveled: 0,
				};
				newZombies.push(newZombie);
				waveSpawnIndexRef.current++;
			}

			newTowers = newTowers.map((tower) => {
				const spec = TOWER_SPECS[tower.type];
				if (
					!tower.targetId ||
					!newZombies.find((z) => z.id === tower.targetId)
				) {
					const potentialTargets = newZombies.filter(
						(z) => getDistance(tower.position, z.position) <= spec.range,
					);
					tower.targetId = potentialTargets[0]?.id || null;
				}

				if (
					tower.targetId &&
					timestamp - tower.lastAttackTime >= spec.attackSpeed
				) {
					const target = newZombies.find((z) => z.id === tower.targetId);
					if (target) {
						newProjectiles.push({
							id: `proj-${timestamp}-${Math.random()}`,
							start: { ...tower.position },
							end: { ...target.position },
							color: spec.projectileColor,
						});
						target.currentHealth -= spec.damage;
						tower.lastAttackTime = timestamp;
					}
				}
				return tower;
			});

			const remainingZombies: ZombieInstance[] = [];
			for (const zombie of newZombies) {
				if (zombie.currentHealth <= 0) {
					motivationGained += ZOMBIE_SPECS[zombie.type].motivationOnDefeat;
					continue;
				}

				if (zombie.pathIndex >= PATH_COORDS.length) {
					handleZombieEscape();
					continue;
				}

				const start = PATH_COORDS[zombie.pathIndex - 1];
				const end = PATH_COORDS[zombie.pathIndex];
				const segmentVector = { x: end.x - start.x, y: end.y - start.y };
				const segmentLength = getDistance(start, end);
				const speed = ZOMBIE_SPECS[zombie.type].speed;
				zombie.distanceTraveled += speed * timeScale;
				if (zombie.distanceTraveled >= segmentLength) {
					zombie.pathIndex++;
					zombie.distanceTraveled = 0;
					if (zombie.pathIndex >= PATH_COORDS.length) {
						handleZombieEscape();
						continue;
					} else {
						zombie.position = { ...PATH_COORDS[zombie.pathIndex - 1] };
					}
				} else {
					const progress = zombie.distanceTraveled / segmentLength;
					zombie.position.x = start.x + segmentVector.x * progress;
					zombie.position.y = start.y + segmentVector.y * progress;
				}
				remainingZombies.push(zombie);
			}

			if (
				remainingZombies.length === 0 &&
				waveSpawnIndexRef.current >= currentWaveData.spawns.length
			) {
				if (gameState.currentWave >= LEVEL_WAVES.length - 1) {
					setGameState((prev) => ({ ...prev, status: 'VICTORY' }));
				} else {
					setGameState((prev) => ({
						...prev,
						status: 'WAVE_TRANSITION',
						currentWave: prev.currentWave + 1,
						motivation: prev.motivation + motivationGained + 50,
					}));
				}
			} else {
				setZombies(remainingZombies);
				setTowers(newTowers);
				setProjectiles(newProjectiles);
				if (motivationGained > 0) {
					setGameState((prev) => ({
						...prev,
						motivation: prev.motivation + motivationGained,
					}));
				}
			}

			lastUpdateTimeRef.current = timestamp;
			gameLoopRef.current = requestAnimationFrame(gameLoop);
		},
		[
			zombies,
			towers,
			projectiles,
			gameState,
			currentWaveData,
			handleZombieEscape,
		],
	);

	const handleGridClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!selectedTower) return;
			const spec = TOWER_SPECS[selectedTower];
			if (gameState.motivation < spec.cost) {
				setSelectedTower(null);
				return;
			}

			const rect = e.currentTarget.getBoundingClientRect();
			const position = { x: e.clientX - rect.left, y: e.clientY - rect.top };

			if (
				isTowerPlacementValid(position) &&
				!towers.some((t) => getDistance(t.position, position) < 40)
			) {
				setTowers((prev) => [
					...prev,
					{
						id: `tower-${Date.now()}`,
						type: selectedTower,
						position,
						lastAttackTime: 0,
						targetId: null,
					},
				]);
				setGameState((prev) => ({
					...prev,
					motivation: prev.motivation - spec.cost,
				}));
				setSelectedTower(null);
			}
		},
		[selectedTower, gameState.motivation, towers],
	);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
	};

	// --- USE EFFECT HOOKS ---
	useEffect(() => {
		return () => {
			if (gameLoopRef.current) {
				cancelAnimationFrame(gameLoopRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (gameState.status === 'PLAYING' && !gameLoopRef.current) {
			lastUpdateTimeRef.current = performance.now();
			gameLoopRef.current = requestAnimationFrame(gameLoop);
		} else if (gameState.status !== 'PLAYING' && gameLoopRef.current) {
			cancelAnimationFrame(gameLoopRef.current);
			gameLoopRef.current = 0;
		}
	}, [gameState.status, gameLoop]);

	useEffect(() => {
		if (projectiles.length > 0) {
			const timer = setTimeout(() => setProjectiles([]), 200);
			return () => clearTimeout(timer);
		}
	}, [projectiles]);

	// --- RENDER LOGIC ---
	const renderGameContent = () => {
		switch (gameState.status) {
			case 'START_SCREEN':
				return (
					<OverlayScreen
						title="Zombie Procrastination"
						message="Defend your Focus from the hordes of distraction!"
						buttonText="Start Focusing"
						onButtonClick={() =>
							setGameState((prev) => ({ ...prev, status: 'WAVE_TRANSITION' }))
						}
					/>
				);
			case 'GAME_OVER':
				return (
					<OverlayScreen
						title="Game Over"
						message="Procrastination has won this time. Don't lose focus!"
						buttonText="Try Again"
						onButtonClick={resetGame}
					/>
				);
			case 'VICTORY':
				return (
					<OverlayScreen
						title="Victory!"
						message="You've achieved peak productivity and defeated all distractions!"
						buttonText="Play Again"
						onButtonClick={resetGame}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="flex justify-center p-8">
			<div
				style={{
					width: GAME_CONFIG.gridSize.width,
					height: GAME_CONFIG.gridSize.height,
				}}
				className={`relative overflow-hidden rounded-lg border-2 border-gray-600 bg-gray-800 shadow-2xl shadow-black/30 ${
					selectedTower ? 'cursor-copy' : 'cursor-default'
				}`}
				onClick={handleGridClick}
				onMouseMove={handleMouseMove}
			>
				<AnimatePresence>{renderGameContent()}</AnimatePresence>

				{/* Game Grid and Path */}
				<div className="absolute inset-0">
					<svg width="100%" height="100%" className="absolute z-[1]">
						<path
							d={PATH_COORDS.map(
								(p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`,
							).join(' ')}
							stroke="#5a5a5a"
							strokeWidth="35"
							fill="none"
							strokeLinecap="round"
						/>
					</svg>

					{TOWER_PLACEMENT_AREAS.map((area, i) => (
						<div
							key={i}
							className="absolute z-0 border border-dashed border-white/30 bg-white/10"
							style={{
								left: area.x,
								top: area.y,
								width: area.width,
								height: area.height,
							}}
						/>
					))}
				</div>

				{/* Game Entities */}
				<div className="absolute inset-0 z-[2]">
					{towers.map((tower) => (
						<motion.div
							key={tower.id}
							variants={towerVariants as Variants}
							initial="initial"
							animate="animate"
							title={`${TOWER_SPECS[tower.type].name}\nRange: ${
								TOWER_SPECS[tower.type].range
							} | Damage: ${TOWER_SPECS[tower.type].damage}`}
							className="absolute flex h-10 w-10 select-none items-center justify-center text-3xl"
							style={{
								left: tower.position.x - 20,
								top: tower.position.y - 20,
							}}
						>
							{TOWER_SPECS[tower.type].icon}
						</motion.div>
					))}

					<AnimatePresence>
						{zombies.map((zombie) => (
							<motion.div
								key={zombie.id}
								variants={zombieVariants as Variants}
								initial={{
									x: zombie.position.x - 20,
									y: zombie.position.y - 20,
									scale: 0.8,
									opacity: 0,
								}}
								animate={{
									x: zombie.position.x - 20,
									y: zombie.position.y - 20,
									scale: 1,
									opacity: 1,
								}}
								transition={{
									duration: GAME_CONFIG.tickRate / 1000,
									ease: 'linear',
								}}
								exit="exit"
								className="absolute h-10 w-10"
							>
								<img
									src={ZOMBIE_SPECS[zombie.type].image}
									alt={ZOMBIE_SPECS[zombie.type].name}
									className="h-full w-full rounded-full border-2 border-red-600"
								/>
								<div className="absolute -bottom-2.5 left-0 h-1.5 w-full rounded-full bg-gray-600">
									<motion.div
										className="h-full rounded-full bg-green-500"
										initial={false}
										animate={{
											width: `${
												(zombie.currentHealth /
													ZOMBIE_SPECS[zombie.type].health) *
												100
											}%`,
										}}
									/>
								</div>
							</motion.div>
						))}
					</AnimatePresence>

					<svg
						width="100%"
						height="100%"
						className="pointer-events-none absolute z-[3]"
					>
						<AnimatePresence>
							{projectiles.map((p) => (
								<motion.line
									key={p.id}
									variants={projectileVariants as Variants}
									x1={p.start.x}
									y1={p.start.y}
									x2={p.end.x}
									y2={p.end.y}
									stroke={p.color}
									strokeWidth="3"
									initial={{ pathLength: 0, opacity: 1 }}
									animate="fire"
									exit={{ opacity: 0 }}
								/>
							))}
						</AnimatePresence>
					</svg>

					{selectedTower && (
						<motion.div
							className="pointer-events-none absolute z-10"
							animate={{ x: mousePosition.x, y: mousePosition.y }}
							transition={{ type: 'spring', damping: 30, stiffness: 500 }}
						>
							<div className="flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-3xl">
								{TOWER_SPECS[selectedTower].icon}
							</div>
							<div
								className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-white/50"
								style={{
									width: TOWER_SPECS[selectedTower].range * 2,
									height: TOWER_SPECS[selectedTower].range * 2,
								}}
							/>
						</motion.div>
					)}
				</div>

				{/* HUD */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.5 }}
					className="pointer-events-none absolute left-2.5 right-2.5 top-2.5 z-[5] flex justify-between font-mono text-lg text-white"
				>
					<motion.span
						key={`focus-${gameState.focus}`}
						initial={{ scale: 1 }}
						animate={{ scale: [1, 1.2, 1] }}
						transition={{ duration: 0.3 }}
					>
						❤️ Focus: {gameState.focus}
					</motion.span>
					<span>
						Wave: {Math.min(gameState.currentWave + 1, LEVEL_WAVES.length)} /{' '}
						{LEVEL_WAVES.length}
					</span>
					<motion.span
						key={`motivation-${gameState.motivation}`}
						initial={{ scale: 1 }}
						animate={{ scale: [1, 1.2, 1] }}
						transition={{ duration: 0.3 }}
					>
						⚡ Motivation: {gameState.motivation}
					</motion.span>
				</motion.div>

				{/* Tower Selection & Game Controls */}
				<motion.div
					variants={bottomControlsVariants as Variants}
					initial="hidden"
					animate="visible"
					className="absolute bottom-2.5 left-2.5 right-2.5 z-[5] flex items-end justify-between"
				>
					<div className="flex gap-2.5 rounded-lg bg-black/50 p-2.5">
						{Object.entries(TOWER_SPECS).map(([key, spec]) => (
							<motion.button
								key={key}
								variants={towerButtonVariants as Variants}
								whileHover={{ scale: 1.1, y: -4 }}
								whileTap={{ scale: 0.95 }}
								onClick={(e) => {
									e.stopPropagation(); // Prevent grid click
									setSelectedTower(key as keyof typeof TOWER_SPECS);
								}}
								disabled={gameState.motivation < spec.cost}
								title={`${spec.name}\n${spec.description}\nCost: ${spec.cost}`}
								className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-md bg-gray-700 text-2xl transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50 border-2 ${
									selectedTower === key
										? 'border-green-500'
										: 'border-gray-500'
								}`}
							>
								{spec.icon}
							</motion.button>
						))}
					</div>
					{gameState.status === 'WAVE_TRANSITION' && (
						<motion.div variants={towerButtonVariants as Variants}>
							<motion.button
								initial={{ scale: 1 }}
								animate={{ scale: [1, 1.1, 1] }}
								transition={{ repeat: Infinity, duration: 1.5 }}
								onClick={startNextWave}
								className="cursor-pointer rounded-md bg-green-600 px-5 py-2.5 text-base text-white transition-colors hover:bg-green-700 active:bg-green-800"
							>
								Start Wave {gameState.currentWave + 1}
							</motion.button>
						</motion.div>
					)}
				</motion.div>
			</div>
		</div>
	);
};

const ErrorFallback = (): JSX.Element => (
	<div
		style={{
			width: GAME_CONFIG.gridSize.width,
			height: GAME_CONFIG.gridSize.height,
		}}
		className="flex flex-col items-center justify-center rounded-lg border-2 border-red-500 bg-slate-800 p-5 font-sans text-white"
	>
		<h2 className="mb-4 text-2xl font-bold">Oh No! A Bug Appeared!</h2>
		<p className="mb-2">Something went wrong in the game logic.</p>
		<p>Please refresh the page to try again.</p>
	</div>
);

const TimeManagementGameWithBoundary = (): JSX.Element => {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<TimeManagementGame />
		</ErrorBoundary>
	);
};

export default TimeManagementGameWithBoundary;