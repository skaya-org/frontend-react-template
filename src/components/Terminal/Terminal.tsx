import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  JSX,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// #region CONSTANTS
/**
 * @constant ASCII_ART
 * Pre-defined ASCII art to be displayed when the terminal opens.
 */
const ASCII_ART: string = `
  _______  __   __  _______  ______    ___   __    _  _______
 |       ||  | |  ||       ||    _ |  |   | |  |  | ||       |
 |    ___||  |_|  ||    ___||   | ||  |   | |   |_| ||    ___|
 |   |___ |       ||   |___ |   |_||_ |   | |       ||   |___
 |    ___||       ||    ___||    __  ||   | |  _    ||    ___|
 |   |___  |     | |   |___ |   |  | ||   | | | |   ||   |___
 |_______|  |___|  |_______||___|  |_||___| |_|  |__||_______|
`;

/**
 * @constant WELCOME_MESSAGES
 * An array of strings that are displayed as a welcome message upon opening the terminal.
 */
const WELCOME_MESSAGES: readonly string[] = [
  'Welcome to the interactive terminal easter egg.',
  "Type 'help' for a list of available (cosmetic) commands.",
  "Press the '`' (backtick) key at any time to toggle the terminal.",
  ' ',
];

/**
 * @constant PROMPT_SYMBOL
 * The symbol displayed before the user input line.
 */
const PROMPT_SYMBOL: string = 'guest@portfolio:~$';

/**
 * @constant TOGGLE_KEY
 * The keyboard key used to toggle the terminal's visibility.
 */
const TOGGLE_KEY: string = '`';

/**
 * @constant HELP_COMMAND_OUTPUT
 * The output displayed when the user types the 'help' command.
 */
const HELP_COMMAND_OUTPUT: readonly string[] = [
  'Available commands:',
  '  help    - Shows this list of commands.',
  '  clear   - Clears the terminal screen.',
  '  whoami  - Displays information about the guest user.',
  '  date    - Shows the current date and time.',
  '  exit    - Closes the terminal.',
];

/**
 * @constant WHOAMI_COMMAND_OUTPUT
 * The output for the 'whoami' command.
 */
const WHOAMI_COMMAND_OUTPUT: readonly string[] = [
  'user: guest',
  'privileges: limited',
  'purpose: To explore this portfolio.',
];
// #endregion

// #region ANIMATION VARIANTS
/**
 * @variants backdropVariants
 * Animation for the background overlay. Fades in and out.
 */
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/**
 * @variants terminalVariants
 * Animation for the main terminal window. Slides in from the top and fades in.
 */
const terminalVariants: Variants = {
  hidden: { y: '-50%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { y: '-50%', opacity: 0, transition: { duration: 0.2 } },
};

/**
 * @variants contentContainerVariants
 * Orchestrates the staggered animation of child elements (lines of text).
 */
const contentContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2, // Start after the terminal window has animated in
      staggerChildren: 0.03, // Stagger each line for a "typing" effect
    },
  },
};

/**
 * @variants lineVariants
 * Animation for each line of text within the terminal. Fades and slides up.
 */
const lineVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
};
// #endregion

/**
 * @component Terminal
 * @description A self-contained, interactive terminal component that acts as an Easter egg.
 * It can be toggled with a specific key and simulates a basic command-line interface.
 * All data and state are managed internally, requiring no props.
 *
 * @example
 * // This component is self-activating. Simply include it in your app layout.
 * <Terminal />
 */
export const Terminal = (): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [history, setHistory] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  /**
   * Toggles the visibility of the terminal.
   */
  const toggleTerminal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  /**
   * Initializes the terminal with welcome messages or clears the history.
   * @param {boolean} shouldClear - If true, clears history; otherwise, initializes.
   */
  const initializeOrClearHistory = (shouldClear: boolean = false) => {
    if (shouldClear) {
      setHistory([]);
    } else {
      setHistory([...WELCOME_MESSAGES]);
    }
  };

  /**
   * Processes the user's command upon pressing 'Enter'.
   * @param {React.KeyboardEvent<HTMLInputElement>} event - The keyboard event.
   */
  const handleCommand = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    const command = inputValue.trim().toLowerCase();
    const newHistory = [...history, `${PROMPT_SYMBOL} ${inputValue}`];

    if (command) {
      switch (command) {
        case 'help':
          newHistory.push(...HELP_COMMAND_OUTPUT);
          break;
        case 'clear':
          initializeOrClearHistory(true);
          setInputValue('');
          return; // Exit early to avoid setting new history
        case 'whoami':
          newHistory.push(...WHOAMI_COMMAND_OUTPUT);
          break;
        case 'date':
          newHistory.push(new Date().toString());
          break;
        case 'exit':
          toggleTerminal();
          break;
        default:
          newHistory.push(`command not found: ${command}`);
          break;
      }
    }
    setHistory(newHistory);
    setInputValue('');
  };

  // Effect to handle the global keydown for toggling the terminal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === TOGGLE_KEY) {
        event.preventDefault();
        toggleTerminal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleTerminal]);

  // Effect to focus input and scroll to bottom when terminal state changes
  useEffect(() => {
    if (isOpen) {
      initializeOrClearHistory();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Effect to scroll the terminal body to the bottom whenever history updates
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <AnimatePresence>
        <motion.div
          className=" flex items-center justify-center bg-black/50"
          variants={backdropVariants as Variants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="flex h-3/5 w-4/5 max-w-[800px] flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900/95 shadow-2xl backdrop-blur-sm"
            variants={terminalVariants as Variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            aria-modal="true"
            role="dialog"
          >
            <header className="flex select-none items-center bg-zinc-800 p-2 px-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="mx-auto font-bold text-zinc-300">bash</span>
            </header>

            <div
              className="flex-1 overflow-y-auto p-2.5 font-mono text-sm leading-relaxed text-green-400"
              ref={bodyRef}
              onClick={() => inputRef.current?.focus()}
            >
              <motion.div
                variants={contentContainerVariants as Variants}
                initial="hidden"
                animate="visible"
              >
                <motion.pre
                  variants={lineVariants as Variants}
                  className="mb-2.5 whitespace-pre text-green-500"
                >
                  {ASCII_ART}
                </motion.pre>
                {history.map((line, index) => (
                  <motion.div
                    key={index}
                    variants={lineVariants as Variants}
                    className="break-all whitespace-pre-wrap"
                  >
                    {line}
                  </motion.div>
                ))}
              </motion.div>
              <div className="flex items-center">
                <span className="mr-2 whitespace-nowrap">{PROMPT_SYMBOL}</span>
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full flex-1 border-none bg-transparent p-0 font-inherit text-inherit outline-none focus:outline-none"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleCommand}
                  spellCheck="false"
                  autoComplete="off"
                  aria-label="Terminal Input"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
    </AnimatePresence>
  );
};

