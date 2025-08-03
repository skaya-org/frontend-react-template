import React, { useState, useCallback, useEffect, useRef, JSX } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

//==============================================================================
// TYPE DEFINITIONS
//==============================================================================

/**
 * @typedef {object} Chain
 * @description Represents a blockchain network.
 * @property {string} id - A unique identifier for the chain.
 * @property {string} name - The display name of the chain.
 * @property {string} logoUrl - The URL for the chain's logo.
 */
type Chain = {
  readonly id: string;
  readonly name: string;
  readonly logoUrl: string;
};

/**
 * @typedef {object} Token
 * @description Represents a cryptocurrency token.
 * @property {string} id - A unique identifier for the token.
 * @property {string} symbol - The short symbol for the token (e.g., ETH).
 * @property {string} name - The full name of the token.
 * @property {string} logoUrl - The URL for the token's logo.
 */
type Token = {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly logoUrl: string;
};

//==============================================================================
// CONSTANT DATA
//==============================================================================

/**
 * @const {readonly Chain[]} CHAINS
 * @description A hardcoded list of supported blockchain networks.
 * This data is constant and internal to the component.
 */
const CHAINS: readonly Chain[] = [
  { id: 'eth', name: 'Ethereum', logoUrl: 'https://picsum.photos/id/10/32/32' },
  { id: 'bsc', name: 'BNB Chain', logoUrl: 'https://picsum.photos/id/20/32/32' },
  { id: 'poly', name: 'Polygon', logoUrl: 'https://picsum.photos/id/30/32/32' },
  { id: 'avax', name: 'Avalanche', logoUrl: 'https://picsum.photos/id/40/32/32' },
  { id: 'sol', name: 'Solana', logoUrl: 'https://picsum.photos/id/50/32/32' },
];

/**
 * @const {readonly Token[]} TOKENS
 * @description A hardcoded list of supported tokens for bridging.
 * This data is constant and internal to the component.
 */
const TOKENS: readonly Token[] = [
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', logoUrl: 'https://picsum.photos/id/101/32/32' },
  { id: 'eth', symbol: 'ETH', name: 'Ether', logoUrl: 'https://picsum.photos/id/102/32/32' },
  { id: 'wbtc', symbol: 'WBTC', name: 'Wrapped BTC', logoUrl: 'https://picsum.photos/id/103/32/32' },
];

//==============================================================================
// CUSTOM HOOKS
//==============================================================================

/**
 * Custom hook for detecting clicks outside a specified element.
 * @template T
 * @param {React.RefObject<T>} ref - The ref of the element to monitor.
 * @param {() => void} handler - The function to call on an outside click.
 */
const useOutsideClick = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: () => void
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};


//==============================================================================
// INTERNAL UI COMPONENTS
//==============================================================================

/**
 * @interface DropdownProps
 * @description Props for the generic AnimatedDropdown component.
 */
interface DropdownProps<T extends { id: string }> {
  items: readonly T[];
  selectedItem: T | null;
  onSelect: (item: T) => void;
  renderDisplay: (item: T | null) => JSX.Element;
  renderItem: (item: T) => JSX.Element;
  label?: string;
  containerClassName?: string;
}

/**
 * A generic, animated, and reusable dropdown component.
 * @template T
 * @param {DropdownProps<T>} props - The props for the component.
 * @returns {JSX.Element}
 */
const AnimatedDropdown = <T extends { id: string; }>({
  items,
  selectedItem,
  onSelect,
  renderDisplay,
  renderItem,
  label,
  containerClassName = ''
}: DropdownProps<T>): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef as React.RefObject<HTMLElement>, () => setIsOpen(false));

  const handleSelect = (item: T) => {
    onSelect(item);
    setIsOpen(false);
  };
  
  const listVariants: Variants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: {
      opacity: 1,
      height: 'auto',
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -10,
      transition: {
        duration: 0.2,
        when: "afterChildren",
      }
    },
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } },
    exit: { opacity: 0, x: -10 },
  };

  return (
    <div ref={dropdownRef} className={`relative ${containerClassName}`}>
      {label && <div className="mb-2 text-sm text-slate-400">{label}</div>}
      <motion.div
        className="flex items-center justify-between w-full p-3 bg-[#1a1b26]/70 rounded-xl border border-slate-700/20 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
      >
        {renderDisplay(selectedItem)}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            &#9660;
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="absolute top-full mt-2 left-0 right-0 bg-[#2a2c3d] rounded-xl border border-slate-700/30 list-none p-2 m-0 z-10 max-h-[200px] overflow-y-auto"
            variants={listVariants as Variants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {items.map((item) => (
              <motion.li
                key={item.id}
                className="flex items-center p-3 rounded-lg cursor-pointer gap-3 hover:bg-white/10"
                onClick={() => handleSelect(item)}
                variants={listItemVariants as Variants}
              >
                {renderItem(item)}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};


/**
 * A fallback component to display when a critical error occurs.
 * @param {FallbackProps} props - Props provided by React Error Boundary.
 * @returns {JSX.Element}
 */
const ErrorFallback = ({ error }: FallbackProps): JSX.Element => (
    <div className="p-6 text-center bg-red-500/10 text-red-200 border border-red-700 rounded-xl" role="alert">
      <h2 className="m-0 text-lg text-white">Something went wrong</h2>
      <pre className="mt-4 font-mono whitespace-pre-wrap">{error.message}</pre>
    </div>
);


//==============================================================================
// MAIN COMPONENT
//==============================================================================

/**
 * @description The core functional component for executing cross-chain swaps.
 * It manages state for chain and token selection, amount input, and handles user interactions.
 * It features a dark theme with neon accents and fluid animations.
 * All data is hardcoded, and the component is self-contained without props.
 * @returns {JSX.Element} The rendered bridge interface.
 */
const BridgeInterface = (): JSX.Element => {
    const [sourceChain, setSourceChain] = useState<Chain | null>(null);
    const [destinationChain, setDestinationChain] = useState<Chain | null>(null);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [isSwapping, setIsSwapping] = useState<boolean>(false);

    const handleSwapChains = useCallback(() => {
        setIsSwapping(true);
        const tempChain = sourceChain;
        setSourceChain(destinationChain);
        setDestinationChain(tempChain);
        setTimeout(() => setIsSwapping(false), 300); // Animation duration
    }, [sourceChain, destinationChain]);

    const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    }, []);

    const handleTransfer = useCallback(() => {
        if (!isTransferDisabled) {
            console.log('Initiating Transfer:', {
                from: sourceChain?.name,
                to: destinationChain?.name,
                token: selectedToken?.symbol,
                amount: parseFloat(amount),
            });
            // Here you would typically trigger an API call or a web3 transaction.
            alert('Transfer initiated! Check the console for details.');
        }
    }, [sourceChain, destinationChain, selectedToken, amount]);

    const renderChainDisplay = (chain: Chain | null) => (
        <div className="flex items-center gap-3">
            {chain ? (
                <>
                    <img src={chain.logoUrl} alt={chain.name} className="w-6 h-6 rounded-full" />
                    <span className="text-base font-medium">{chain.name}</span>
                </>
            ) : (
                <span className="text-base font-medium text-slate-400">Select Chain</span>
            )}
        </div>
    );
    
    const renderTokenDisplay = (token: Token | null) => (
        <div className="flex items-center gap-3">
            {token ? (
                <>
                    <img src={token.logoUrl} alt={token.name} className="w-6 h-6 rounded-full" />
                    <span className="text-base font-medium">{token.symbol}</span>
                </>
            ) : (
                <span className="text-base font-medium text-slate-400">Token</span>
            )}
        </div>
    );

    const renderItem = (item: Chain | Token) => (
        <>
            <img src={item.logoUrl} alt={item.name} className="w-6 h-6 rounded-full" />
            <span className="text-base font-medium">{'symbol' in item ? item.symbol : item.name}</span>
        </>
    );

    const isTransferDisabled = !sourceChain || !destinationChain || !selectedToken || !amount || parseFloat(amount) <= 0;

    const availableDestChains = CHAINS.filter(c => c.id !== sourceChain?.id);
    const availableSourceChains = CHAINS.filter(c => c.id !== destinationChain?.id);
    
    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 },
        },
    };

    return (
        <motion.div
            className="w-full max-w-[480px] bg-[#202234]/80 rounded-[20px] p-8 shadow-2xl shadow-black/30 border border-slate-700/20 backdrop-blur-lg"
            variants={containerVariants as Variants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 
                className="text-center text-2xl font-semibold mb-8 text-white [text-shadow:0_0_10px_rgba(0,245,212,0.3)]"
                variants={itemVariants as Variants}
            >
                Cross-Chain Bridge
            </motion.h1>

            <motion.div 
                className="flex justify-between items-center mb-6"
                variants={itemVariants as Variants}
            >
                <AnimatedDropdown<Chain>
                    label="From"
                    items={availableSourceChains}
                    selectedItem={sourceChain}
                    onSelect={setSourceChain}
                    renderDisplay={renderChainDisplay}
                    renderItem={renderItem}
                    containerClassName="w-[45%]"
                />
                <motion.button
                    className="flex justify-center items-center w-10 h-10 bg-white/10 border border-slate-700/30 rounded-full cursor-pointer text-[#00f5d4] text-lg transition-colors hover:bg-[#00f5d4]/20"
                    onClick={handleSwapChains}
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ rotate: isSwapping ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    &#8646;
                </motion.button>
                <AnimatedDropdown<Chain>
                    label="To"
                    items={availableDestChains}
                    selectedItem={destinationChain}
                    onSelect={setDestinationChain}
                    renderDisplay={renderChainDisplay}
                    renderItem={renderItem}
                    containerClassName="w-[45%]"
                />
            </motion.div>
            
            <motion.div 
                className="relative flex items-center p-2 bg-[#1a1b26]/70 rounded-xl border border-slate-700/20"
                variants={itemVariants as Variants}
            >
                <AnimatedDropdown<Token>
                    items={TOKENS}
                    selectedItem={selectedToken}
                    onSelect={setSelectedToken}
                    renderDisplay={renderTokenDisplay}
                    renderItem={renderItem}
                    containerClassName="w-[150px]"
                />
                <input
                    type="text"
                    className="flex-1 bg-transparent border-none text-white text-2xl font-medium text-right outline-none pr-4"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.0"
                />
            </motion.div>

            <motion.div variants={itemVariants as Variants}>
                <motion.button
                    className="w-full p-4 mt-8 text-lg font-semibold text-center no-underline border-none rounded-xl cursor-pointer"
                    onClick={handleTransfer}
                    disabled={isTransferDisabled}
                    whileHover={!isTransferDisabled ? { scale: 1.02, y: -2, boxShadow: '0 0 30px rgba(0,245,212,0.6)' } : {}}
                    whileTap={!isTransferDisabled ? { scale: 0.98 } : {}}
                    animate={{
                        backgroundColor: isTransferDisabled ? '#475569' : '#00f5d4',
                        color: isTransferDisabled ? '#94a3b8' : '#1a1b26',
                        boxShadow: isTransferDisabled ? 'none' : '0 0 20px rgba(0,245,212,0.4)',
                        cursor: isTransferDisabled ? 'not-allowed' : 'pointer',
                    }}
                    transition={{ duration: 0.3 }}
                >
                    Transfer
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

//==============================================================================
// DEFAULT EXPORT WRAPPER
//==============================================================================

/**
 * @description A wrapper component that provides the main application container styling
 * and an error boundary for the BridgeInterface. This is the component that should be
 * rendered in the application.
 * @returns {JSX.Element} The BridgeInterface component wrapped with an ErrorBoundary
 * and placed in a styled container.
 */
const BridgeInterfaceContainer = (): JSX.Element => (
    <div className="flex items-center justify-center min-h-screen font-sans text-gray-200 bg-gradient-to-br from-[#1a1b26] to-[#2a2c3d]">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <BridgeInterface />
        </ErrorBoundary>
    </div>
);

export default BridgeInterfaceContainer;