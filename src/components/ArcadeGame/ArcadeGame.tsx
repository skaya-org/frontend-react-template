import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    JSX,
} from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

// --- TYPE DEFINITIONS ---

/**
 * Represents the geometric properties of a game object.
 * @property {number} x - The x-coordinate of the object's top-left corner.
 * @property {number} y - The y-coordinate of the object's top-left corner.
 * @property {number} width - The width of the object.
 * @property {number} height - The height of the object.
 */
type GameObject = {
    x: number;
    y: number;
    width: number;
    height: number;
};

/**
 * Represents the player's ship.
 * @extends GameObject
 */
type Player = GameObject;

/**
 * Represents a single enemy.
 * @extends GameObject
 * @property {string} id - A unique identifier for the enemy.
 * @property {string} imageUrl - The URL for the enemy's image.
 */
type Enemy = GameObject & {
    id: string;
    imageUrl: string;
};

/**
 * Represents a bullet fired by the player.
 * @extends GameObject
 * @property {string} id - A unique identifier for the bullet.
 */
type Bullet = GameObject & {
    id: string;
};

/**
 * Represents a power-up item.
 * @extends GameObject
 * @property {string} id - A unique identifier for the power-up.
 * @property {string} skill - The name of the skill this power-up represents.
 */
type PowerUp = GameObject & {
    id: string;
    skill: string;
};

/**
 * Represents the current state of the game.
 * - 'playing': The game is active.
 * - 'gameOver': The player has lost.
 * - 'initial': The initial screen before the game starts.
 */
type GameState = 'playing' | 'gameOver' | 'initial';

/**
 * Represents the set of currently pressed keys.
 */
type KeysPressed = {
    [key: string]: boolean;
};

// --- CONSTANT DATA ---

/**
 * Configuration settings for the game.
 * All values are constants to ensure the component is self-contained.
 */
const GAME_CONFIG = {
    WIDTH: 600,
    HEIGHT: 800,
    PLAYER: {
        WIDTH: 50,
        HEIGHT: 30,
        SPEED: 7,
    },
    ENEMY: {
        WIDTH: 50,
        HEIGHT: 50,
        SPEED: 2,
        SPAWN_INTERVAL: 1000, // ms
    },
    BULLET: {
        WIDTH: 5,
        HEIGHT: 15,
        SPEED: 10,
    },
    POWER_UP: {
        WIDTH: 90,
        HEIGHT: 35,
        SPEED: 1.5,
        SPAWN_INTERVAL: 10000, // ms
    },
    FIRE_COOLDOWN: 200, // ms
};

/**
 * A list of technical skills to be used as power-ups.
 */
const POWER_UP_SKILLS: readonly string[] = [
    'React',
    'TypeScript',
    'Node.js',
    'GraphQL',
    'Next.js',
    'CSS',
    'Vite',
    'AWS',
];

// --- HELPER FUNCTIONS ---

/**
 * Generates a unique ID string.
 * @returns {string} A unique identifier.
 */
const generateId = (): string => `id_${Date.now()}_${Math.random()}`;

/**
 * Checks for collision between two game objects.
 * @param {GameObject} a - The first game object.
 * @param {GameObject} b - The second game object.
 * @returns {boolean} True if the objects are colliding, false otherwise.
 */
const checkCollision = (a: GameObject, b: GameObject): boolean => {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
};


// --- SUB-COMPONENTS ---

/**
 * A simple fallback component for the ErrorBoundary.
 * @returns {JSX.Element} A fallback UI.
 */
const ErrorFallback = (): JSX.Element => (
    <div
        className="relative overflow-hidden rounded-lg border-2 border-purple-600 bg-[#0c0c1e] font-mono text-white bg-[radial-gradient(white_0.5px,transparent_0.5px)] bg-[size:15px_15px]"
        style={{
            width: `${GAME_CONFIG.WIDTH}px`,
            height: `${GAME_CONFIG.HEIGHT}px`,
        }}
    >
        <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-black/70 text-center">
            <h2 className="mb-5 text-2xl text-sky-400 [text-shadow:0_0_10px_#61dafb]">
                Oops! Something went wrong.
            </h2>
            <p className="max-w-[80%] text-lg leading-relaxed">
                The game engine crashed. Please refresh the page to try again.
            </p>
        </div>
    </div>
);

// --- ANIMATION VARIANTS ---

const screenVariants: Variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
    exit: { opacity: 0, scale: 0.95, transition: { when: 'afterChildren' } },
};

const screenItemVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
};

const buttonVariants: Variants = {
    ...screenItemVariants,
    whileHover: { scale: 1.1, textShadow: "0px 0px 8px rgb(255,255,255)", transition: { type: 'spring', stiffness: 300 } },
    whileTap: { scale: 0.9 },
};

const playerVariants: Variants = {
    initial: { y: GAME_CONFIG.HEIGHT, opacity: 0 },
    animate: (player: Player) => ({
        x: player.x,
        y: player.y,
        opacity: 1,
        transition: { type: 'spring', stiffness: 500, damping: 30, duration: 0.5 },
    }),
    exit: { y: GAME_CONFIG.HEIGHT + 50, opacity: 0, transition: { duration: 0.5 } }
};

const bulletVariants: Variants = {
    initial: (bullet: Bullet) => ({ x: bullet.x, y: bullet.y, opacity: 0, scale: 0.5 }),
    animate: (bullet: Bullet) => ({ x: bullet.x, y: bullet.y, opacity: 1, scale: 1 }),
    exit: { opacity: 0, scale: 0, transition: { duration: 0.1 } }
};

const enemyVariants: Variants = {
    initial: (enemy: Enemy) => ({ x: enemy.x, y: -GAME_CONFIG.ENEMY.HEIGHT, opacity: 0 }),
    animate: (enemy: Enemy) => ({ x: enemy.x, y: enemy.y, opacity: 1, transition: { type: 'tween', ease: 'linear' } }),
    exit: { opacity: 0, scale: 0.5, rotate: 180, transition: { duration: 0.3 } }
};

const powerUpVariants: Variants = {
    initial: (powerUp: PowerUp) => ({ x: powerUp.x, y: -GAME_CONFIG.POWER_UP.HEIGHT, opacity: 0, scale: 0.5 }),
    animate: (powerUp: PowerUp) => ({
        x: powerUp.x,
        y: powerUp.y,
        opacity: [0.7, 1, 0.7],
        scale: [1, 1.1, 1],
        transition: {
            y: { type: 'tween', ease: 'linear' },
            opacity: { repeat: Infinity, duration: 2 },
            scale: { repeat: Infinity, duration: 2 }
        },
    }),
    exit: { opacity: 0, scale: 2, transition: { duration: 0.3 } } // On collection
};

const scoreVariants: Variants = {
    update: { scale: [1, 1.3, 1], color: ["#fff", "#61dafb", "#fff"], transition: { duration: 0.4 } }
};


/**
 * ArcadeGame Component
 *
 * A self-contained space shooter mini-game. It manages its own state,
 * game loop, and rendering, requiring no props from parent components.
 * The game features a player-controlled ship, descending enemies, bullets,
 * and skill-based power-ups.
 *
 * @returns {JSX.Element} The rendered arcade game component.
 */
const ArcadeGame = (): JSX.Element => {
    // --- STATE MANAGEMENT ---
    const [gameState, setGameState] = useState<GameState>('initial');
    const [player, setPlayer] = useState<Player>({
        x: (GAME_CONFIG.WIDTH - GAME_CONFIG.PLAYER.WIDTH) / 2,
        y: GAME_CONFIG.HEIGHT - GAME_CONFIG.PLAYER.HEIGHT - 20,
        width: GAME_CONFIG.PLAYER.WIDTH,
        height: GAME_CONFIG.PLAYER.HEIGHT,
    });
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [bullets, setBullets] = useState<Bullet[]>([]);
    const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
    const [score, setScore] = useState<number>(0);

    // --- REFS ---
    const keysPressed = useRef<KeysPressed>({});
    const lastFireTime = useRef<number>(0);
    const lastEnemySpawn = useRef<number>(0);
    const lastPowerUpSpawn = useRef<number>(0);
    const gameLoopId = useRef<number | null>(null);

    // --- GAME INITIALIZATION ---

    /**
     * Resets the game to its initial state.
     */
    const resetGame = useCallback(() => {
        setPlayer({
            x: (GAME_CONFIG.WIDTH - GAME_CONFIG.PLAYER.WIDTH) / 2,
            y: GAME_CONFIG.HEIGHT - GAME_CONFIG.PLAYER.HEIGHT - 20,
            width: GAME_CONFIG.PLAYER.WIDTH,
            height: GAME_CONFIG.PLAYER.HEIGHT,
        });
        setEnemies([]);
        setBullets([]);
        setPowerUps([]);
        setScore(0);
        keysPressed.current = {};
        lastFireTime.current = 0;
        lastEnemySpawn.current = 0;
        lastPowerUpSpawn.current = 0;
    }, []);

    /**
     * Starts the game by setting the state to 'playing' and resetting game data.
     */
    const startGame = (): void => {
        setGameState('playing');
    };

    // --- EVENT HANDLERS ---

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        keysPressed.current[e.code] = true;
    }, []);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        keysPressed.current[e.code] = false;
    }, []);

    useEffect(() => {
        if (gameState === 'playing') {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState, handleKeyDown, handleKeyUp]);

    // --- GAME LOOP ---
    const gameLoop = useCallback(
        (timestamp: number) => {
            if (gameState !== 'playing') return;

            // Player Movement
            setPlayer(p => {
                let newX = p.x;
                if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) {
                    newX -= GAME_CONFIG.PLAYER.SPEED;
                }
                if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD']) {
                    newX += GAME_CONFIG.PLAYER.SPEED;
                }
                // Boundary checks
                newX = Math.max(0, Math.min(newX, GAME_CONFIG.WIDTH - p.width));
                return { ...p, x: newX };
            });

            // Player Shooting
            if (keysPressed.current['Space']) {
                if (timestamp - lastFireTime.current > GAME_CONFIG.FIRE_COOLDOWN) {
                    lastFireTime.current = timestamp;
                    setBullets(b => [
                        ...b,
                        {
                            id: generateId(),
                            x: player.x + player.width / 2 - GAME_CONFIG.BULLET.WIDTH / 2,
                            y: player.y,
                            width: GAME_CONFIG.BULLET.WIDTH,
                            height: GAME_CONFIG.BULLET.HEIGHT,
                        },
                    ]);
                }
            }

            // Update Bullets & check collision with enemies
            setBullets(prevBullets => {
                const newBullets = prevBullets.map(b => ({ ...b, y: b.y - GAME_CONFIG.BULLET.SPEED })).filter(b => b.y > 0);
                const bulletsToRemove = new Set<string>();

                setEnemies(prevEnemies => {
                    const remainingEnemies = prevEnemies.filter(enemy => {
                        for (const bullet of newBullets) {
                            if (!bulletsToRemove.has(bullet.id) && checkCollision(bullet, enemy)) {
                                bulletsToRemove.add(bullet.id);
                                setScore(s => s + 100);
                                return false; // Remove this enemy
                            }
                        }
                        return true; // Keep this enemy
                    });
                    return remainingEnemies;
                });
                
                return newBullets.filter(b => !bulletsToRemove.has(b.id));
            });


            // Update Enemies & check collision with player
            setEnemies(prevEnemies =>
                prevEnemies
                    .map(e => ({ ...e, y: e.y + GAME_CONFIG.ENEMY.SPEED }))
                    .filter(e => {
                        if (checkCollision(e, player)) {
                            setGameState('gameOver');
                            return false;
                        }
                        return e.y < GAME_CONFIG.HEIGHT;
                    })
            );

            // Update Power-ups & check collision with player
            setPowerUps(prevPowerUps =>
                prevPowerUps
                    .map(p => ({ ...p, y: p.y + GAME_CONFIG.POWER_UP.SPEED }))
                    .filter(p => {
                        if (checkCollision(p, player)) {
                            setScore(s => s + 500); // Power-up bonus
                            // A real effect could be implemented here, e.g., faster fire rate
                            return false;
                        }
                        return p.y < GAME_CONFIG.HEIGHT;
                    })
            );

            // Spawn new Enemies
            if (timestamp - lastEnemySpawn.current > GAME_CONFIG.ENEMY.SPAWN_INTERVAL) {
                lastEnemySpawn.current = timestamp;
                setEnemies(e => [
                    ...e,
                    {
                        id: generateId(),
                        x: Math.random() * (GAME_CONFIG.WIDTH - GAME_CONFIG.ENEMY.WIDTH),
                        y: -GAME_CONFIG.ENEMY.HEIGHT,
                        width: GAME_CONFIG.ENEMY.WIDTH,
                        height: GAME_CONFIG.ENEMY.HEIGHT,
                        imageUrl: `https://picsum.photos/seed/${generateId()}/50/50`,
                    },
                ]);
            }

            // Spawn new Power-ups
            if (
                timestamp - lastPowerUpSpawn.current >
                GAME_CONFIG.POWER_UP.SPAWN_INTERVAL
            ) {
                lastPowerUpSpawn.current = timestamp;
                const skill = POWER_UP_SKILLS[Math.floor(Math.random() * POWER_UP_SKILLS.length)];
                setPowerUps(p => [
                    ...p,
                    {
                        id: generateId(),
                        x: Math.random() * (GAME_CONFIG.WIDTH - GAME_CONFIG.POWER_UP.WIDTH),
                        y: -GAME_CONFIG.POWER_UP.HEIGHT,
                        width: GAME_CONFIG.POWER_UP.WIDTH,
                        height: GAME_CONFIG.POWER_UP.HEIGHT,
                        skill,
                    },
                ]);
            }

            gameLoopId.current = requestAnimationFrame(gameLoop);
        },
        [gameState, player] // Dependencies for useCallback
    );

    useEffect(() => {
        if (gameState === 'playing') {
            gameLoopId.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if (gameLoopId.current) {
                cancelAnimationFrame(gameLoopId.current);
            }
        };
    }, [gameState, gameLoop]);


    // --- RENDER LOGIC ---

    const renderGameScreen = (): JSX.Element => (
        <motion.div key="game-screen" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0.5}}}>
            <div className="absolute left-2.5 top-2.5 text-2xl text-white">
                Score: <motion.span key={score} variants={scoreVariants as Variants} animate="update">{score}</motion.span>
            </div>
            {/* Player */}
            <motion.div
                className="absolute box-border bg-sky-400 border-b-[5px] border-b-sky-600 [clip-path:polygon(50%_0%,_0%_100%,_100%_100%)]"
                style={{
                  width: `${GAME_CONFIG.PLAYER.WIDTH}px`,
                  height: `${GAME_CONFIG.PLAYER.HEIGHT}px`
                }}
                custom={player}
                variants={playerVariants as Variants}
                initial="initial"
                animate="animate"
                exit="exit"
            />

            <AnimatePresence>
                {/* Bullets */}
                {bullets.map(bullet => (
                    <motion.div
                        key={bullet.id}
                        className="absolute box-border rounded-sm bg-yellow-300"
                        style={{
                            width: `${GAME_CONFIG.BULLET.WIDTH}px`,
                            height: `${GAME_CONFIG.BULLET.HEIGHT}px`
                        }}
                        custom={bullet}
                        variants={bulletVariants as Variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    />
                ))}
                {/* Enemies */}
                {enemies.map(enemy => (
                    <motion.div
                        key={enemy.id}
                        className="absolute box-border rounded-full border-2 border-red-700 bg-red-500 bg-cover"
                        style={{
                            width: `${GAME_CONFIG.ENEMY.WIDTH}px`,
                            height: `${GAME_CONFIG.ENEMY.HEIGHT}px`,
                            backgroundImage: `url(${enemy.imageUrl})`,
                        }}
                        custom={enemy}
                        variants={enemyVariants as Variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    />
                ))}
                {/* PowerUps */}
                {powerUps.map(powerUp => (
                    <motion.div
                        key={powerUp.id}
                        className="absolute box-border flex items-center justify-center rounded-md border-2 border-green-700 bg-green-500 text-sm font-bold text-white [text-shadow:1px_1px_2px_black]"
                        style={{
                            width: `${GAME_CONFIG.POWER_UP.WIDTH}px`,
                            height: `${GAME_CONFIG.POWER_UP.HEIGHT}px`
                        }}
                        custom={powerUp}
                        variants={powerUpVariants as Variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {powerUp.skill}
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );

    const renderInitialScreen = (): JSX.Element => (
        <motion.div
            key="initial-screen"
            className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-black/70 text-center"
            variants={screenVariants as Variants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <motion.h1 variants={screenItemVariants as Variants} className="mb-5 text-5xl text-sky-400 [text-shadow:0_0_10px_#61dafb]">
                TS Space Shooter
            </motion.h1>
            <motion.p variants={screenItemVariants as Variants} className="mb-4 max-w-[80%] text-lg leading-relaxed">
                Use Arrow Keys or A/D to Move. Press Spacebar to Shoot.
            </motion.p>
            <motion.p variants={screenItemVariants as Variants} className="mb-8 max-w-[80%] text-lg leading-relaxed">
                Collect skill icons for bonus points!
            </motion.p>
            <motion.button 
                variants={buttonVariants as Variants} 
                whileHover="whileHover"
                whileTap="whileTap"
                className="cursor-pointer rounded-md border-none bg-purple-600 px-8 py-4 text-xl uppercase text-white" 
                onClick={startGame}
            >
                Start Game
            </motion.button>
        </motion.div>
    );

    const renderGameOverScreen = (): JSX.Element => (
        <motion.div
            key="gameOver-screen"
            className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-black/70 text-center"
            variants={screenVariants as Variants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <motion.h1 variants={screenItemVariants as Variants} className="mb-5 text-5xl text-sky-400 [text-shadow:0_0_10px_#61dafb]">
                Game Over
            </motion.h1>
            <motion.p variants={screenItemVariants as Variants} className="mb-8 max-w-[80%] text-lg leading-relaxed">
                Final Score: {score}
            </motion.p>
            <motion.button 
                variants={buttonVariants as Variants} 
                whileHover="whileHover"
                whileTap="whileTap"
                className="cursor-pointer rounded-md border-none bg-purple-600 px-8 py-4 text-xl uppercase text-white" 
                onClick={startGame}
            >
                Restart
            </motion.button>
        </motion.div>
    );

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div
                className="relative overflow-hidden rounded-lg border-2 border-purple-600 bg-[#0c0c1e] font-mono text-white bg-[radial-gradient(white_0.5px,transparent_0.5px)] bg-[size:15px_15px]"
                style={{
                    width: `${GAME_CONFIG.WIDTH}px`,
                    height: `${GAME_CONFIG.HEIGHT}px`,
                }}
            >
                <AnimatePresence mode="wait">
                    {gameState === 'initial' && renderInitialScreen()}
                    {gameState === 'playing' && renderGameScreen()}
                    {gameState === 'gameOver' && renderGameOverScreen()}
                </AnimatePresence>
            </div>
        </ErrorBoundary>
    );
};

export default ArcadeGame;