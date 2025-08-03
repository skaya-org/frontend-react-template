import React from 'react';
import { useState, useEffect, useCallback, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// --- CONSTANTS ---
// By using constants, this component remains self-contained and requires no props.

/**
 * The number of clicks required to win the minigame.
 * @type {number}
 */
const CLICKS_TO_WIN: number = 50;

/**
 * The duration of the minigame in seconds.
 * @type {number}
 */
const GAME_DURATION_SECONDS: number = 10;

// --- TYPES ---

/**
 * Represents the possible states of the minigame.
 * 'playing': The user is actively clicking to escape.
 * 'won': The user has reached the required clicks within the time limit.
 * 'lost': The user failed to reach the required clicks before the timer ran out.
 * 'idle': The initial state before the game starts, or after it has concluded.
 */
type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

// --- ERROR FALLBACK COMPONENT ---

/**
 * A fallback component to display when an error occurs within the minigame.
 * This ensures that a bug in the game doesn't crash the entire application.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} The rendered error UI.
 */
const GameErrorFallback = ({ error, resetErrorBoundary }: FallbackProps): JSX.Element => (
  <div className="fixed inset-0 z-[10000] flex h-screen w-screen flex-col items-center justify-center bg-[#1a0000] p-8 text-center font-mono text-[#ffdddd]">
    <h2 className="text-3xl text-[#ff8888]">A Glitch in Spacetime!</h2>
    <p className="my-4">The Black Hole Minigame encountered an unexpected error.</p>
    <pre className="my-4 max-w-[80%] whitespace-pre-wrap rounded-md bg-[#331111] p-4">{error.message}</pre>
    <button
      className="cursor-pointer rounded-md bg-[#00ff00] px-5 py-2.5 font-bold text-black transition-transform hover:scale-105 active:scale-95"
      onClick={resetErrorBoundary}
    >
      Attempt to Stabilize (Retry)
    </button>
  </div>
);


// --- CORE GAME VIEW ---

/**
 * The core implementation of the Black Hole Minigame logic and view.
 * It is wrapped by the main component with an ErrorBoundary.
 * @returns {JSX.Element} The rendered minigame.
 */
const GameView = (): JSX.Element => {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [clicks, setClicks] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION_SECONDS);

  // --- ANIMATION VARIANTS ---

  const containerVariants: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
  };
  
  const ringVariants = (duration: number, direction: number = 1): Variants => ({
    spin: {
      rotate: 360 * direction,
      transition: { repeat: Infinity, duration, ease: 'linear' },
    },
  });
  
  const modalVariants: Variants = {
    initial: { opacity: 0, scale: 0.7 },
    animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150, damping: 20 } },
    exit: { opacity: 0, scale: 0.7, transition: { duration: 0.3 } },
  };

  const playingUiContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    }
  };

  const playingUiItemVariants: Variants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 },
      exit: { opacity: 0 },
  };


  // --- GAME LOGIC ---

  useEffect(() => {
    if (status !== 'playing') return;

    if (timeLeft <= 0) {
      setStatus('lost');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, status]);

  const handleEscapeClick = useCallback(() => {
    if (status !== 'playing') return;

    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks >= CLICKS_TO_WIN) {
      setStatus('won');
    }
  }, [clicks, status]);

  const handleRestart = useCallback(() => {
    setClicks(0);
    setTimeLeft(GAME_DURATION_SECONDS);
    setStatus('playing');
  }, []);
  
  const handleStartGame = useCallback(() => {
    setStatus('playing');
  }, []);

  const progress = (clicks / CLICKS_TO_WIN) * 100;
  
  // --- STYLES ---
  const playAgainButtonClasses = "cursor-pointer rounded-md bg-[#00ff00] px-5 py-2.5 font-bold text-black transition-all hover:brightness-110 active:brightness-90";
  const statusTextClasses = "text-4xl font-bold [text-shadow:0_0_10px_#fff,_0_0_20px_#ff00ff]";
  const infoTextClasses = "max-w-[400px] text-lg opacity-80";

  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen select-none items-center justify-center overflow-hidden bg-black/95 font-mono text-white">
      <motion.div
        className="relative flex flex-col items-center gap-8 p-8 text-center"
        variants={containerVariants as Variants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="relative flex h-[200px] w-[200px] items-center justify-center rounded-full bg-[radial-gradient(circle,_#330066_0%,_#1a0033_40%,_black_70%)] shadow-[0_0_40px_#440088,_0_0_80px_#330066,_inset_0_0_50px_black]"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute h-[300px] w-[300px] rounded-full border-2 border-[rgba(150,50,255,0.3)] border-t-[rgba(200,150,255,0.8)]"
            variants={ringVariants(10) as Variants}
            animate="spin"
          />
          <motion.div
            className="absolute h-[250px] w-[250px] rounded-full border-2 border-[rgba(150,50,255,0.3)] border-t-[rgba(200,150,255,0.8)]"
            variants={ringVariants(7, -1) as Variants}
            animate="spin"
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {status === 'playing' && (
            <motion.div
              key="playing-ui"
              className="contents"
              variants={playingUiContainerVariants as Variants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.h1 
                className={statusTextClasses}
                variants={playingUiItemVariants as Variants}
              >
                Escape the Singularity!
              </motion.h1>
              <motion.p 
                className={infoTextClasses}
                variants={playingUiItemVariants as Variants}
              >
                Click the button as fast as you can to generate escape velocity.
              </motion.p>
              <motion.div variants={playingUiItemVariants as Variants}>
                <motion.div
                  className="cursor-pointer rounded-full border-2 border-[#0056b3] bg-[#007BFF] px-[30px] py-[15px] text-2xl font-bold text-white shadow-[0_0_20px_#007BFF]"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px #00BFFF' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEscapeClick}
                >
                  CLICK TO ESCAPE
                </motion.div>
              </motion.div>
              <motion.div className="rounded-lg bg-white/10 py-2 px-4 text-3xl" variants={playingUiItemVariants as Variants}>
                Time Left: {timeLeft.toFixed(0)}s
              </motion.div>
              <motion.div className="h-5 w-[300px] overflow-hidden rounded-lg bg-white/20" variants={playingUiItemVariants as Variants}>
                <motion.div
                  className="h-full rounded-lg bg-[#00ff00] shadow-[0_0_10px_#00ff00]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {status === 'idle' && (
             <motion.div
                key="idle"
                className="absolute flex flex-col items-center gap-6 rounded-[15px] border border-white/20 bg-black/80 p-12"
                variants={modalVariants as Variants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <h2 className={statusTextClasses}>Market Anomaly Detected</h2>
                <p className={infoTextClasses}>A critical event is collapsing the market. Engage emergency recovery protocol.</p>
                <button className={playAgainButtonClasses} onClick={handleStartGame}>Engage</button>
            </motion.div>
          )}

          {status === 'won' && (
            <motion.div
                key="won"
                className="absolute flex flex-col items-center gap-6 rounded-[15px] border border-white/20 bg-black/80 p-12"
                variants={modalVariants as Variants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
              <h2 className={statusTextClasses}>You Escaped!</h2>
              <p className={infoTextClasses}>System stabilized. Market recovery in progress.</p>
              <button className={playAgainButtonClasses} onClick={handleRestart}>Play Again</button>
            </motion.div>
          )}

          {status === 'lost' && (
            <motion.div
                key="lost"
                className="absolute flex flex-col items-center gap-6 rounded-[15px] border border-white/20 bg-black/80 p-12"
                variants={modalVariants as Variants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
              <h2 className={`${statusTextClasses} text-[#ff4444]`}>Pulled In!</h2>
              <p className={infoTextClasses}>System collapsed. Total market loss.</p>
              <button className={playAgainButtonClasses} onClick={handleRestart}>Try Again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};


/**
 * @name BlackHoleMinigame
 * @description A self-contained, full-screen overlay component that simulates a
 * 'black hole' recovery minigame. This component might be triggered during a
 * simulated market crash scenario. It encapsulates all its own game logic,
 * state, and UI, operating independently without any props. The core mechanic
 * involves the user repeatedly clicking a button to "escape" the black hole
 * before a timer runs out.
 *
 * @component
 * @returns {JSX.Element} The rendered Black Hole Minigame component, wrapped in an ErrorBoundary.
 */
const BlackHoleMinigame = (): JSX.Element => {
  return (
    <ErrorBoundary FallbackComponent={GameErrorFallback}>
      <GameView />
    </ErrorBoundary>
  );
};

export default BlackHoleMinigame;