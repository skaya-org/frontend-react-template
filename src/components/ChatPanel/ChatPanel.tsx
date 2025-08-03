import React, { useState, useRef, useEffect, useCallback, JSX, FormEvent } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {object} Sender
 * @property {string} name - The name of the message sender.
 * @property {string} avatarUrl - The URL for the sender's avatar image.
 */
type Sender = {
  name: string;
  avatarUrl: string;
};

/**
 * @typedef {object} Message
 * @property {string} id - A unique identifier for the message.
 * @property {Sender} sender - The sender of the message.
 * @property {string} text - The content of the message.
 */
type Message = {
  id: string;
  sender: Sender;
  text: string;
};

// --- CONSTANT DATA ---

/**
 * Represents the current user sending messages.
 * This object is used to differentiate the current user's messages from others.
 * @const {Sender}
 */
const CURRENT_USER: Sender = {
  name: 'You',
  avatarUrl: 'https://picsum.photos/seed/you/100/100.webp',
};

/**
 * A predefined list of mock messages to populate the chat initially.
 * This ensures the component has initial content without needing props.
 * @const {Message[]}
 */
const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender: { name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/100/100.webp' },
    text: 'Hey everyone, how is it going?',
  },
  {
    id: 'msg-2',
    sender: { name: 'Bob', avatarUrl: 'https://picsum.photos/seed/bob/100/100.webp' },
    text: 'Going great, Alice! Just working on the new feature.',
  },
  {
    id: 'msg-3',
    sender: { name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/100/100.webp' },
    text: 'Awesome! Let me know if you need a hand.',
  },
];

// --- ANIMATION VARIANTS ---

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      when: 'beforeChildren',
    },
  },
};

const messageItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};


// --- ERROR BOUNDARY FALLBACK ---

/**
 * A fallback component to display when an error occurs within the ChatPanel.
 * It provides a user-friendly message instead of a crashed component.
 * @param {FallbackProps} props - Props provided by react-error-boundary, including the error.
 * @returns {JSX.Element} The rendered fallback UI.
 */
const ChatPanelErrorFallback = ({ error }: FallbackProps): JSX.Element => (
    <div
      className="flex flex-col justify-center items-center w-full max-w-[450px] h-[600px] border border-red-300 rounded-2xl bg-red-50 text-red-800 font-sans p-5 text-center box-border"
      role="alert"
    >
        <h3 className="m-0 mb-2.5 text-xl font-bold text-red-900">Chat Unavailable</h3>
        <p className="m-0">An unexpected error occurred.</p>
        <pre className="mt-4 p-2 w-full text-xs bg-red-100 rounded-md whitespace-pre-wrap break-all">
            {error.message}
        </pre>
    </div>
);


// --- CORE COMPONENT ---

/**
 * A ChatPanel component for real-time social interaction simulation.
 * It features a message display area and a message input form.
 * The component is self-contained and uses constant mock data for initialization,
 * requiring no props from its parent.
 *
 * @returns {JSX.Element} The rendered chat panel component.
 */
const ChatPanel = (): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState<string>('');
  const messageListRef = useRef<HTMLDivElement>(null);

  /**
   * Effect to scroll the message list to the bottom whenever new messages are added,
   * ensuring the latest message is always visible.
   */
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  /**
   * Handles changes to the message input field, updating the component's state.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  /**
   * Handles the submission of a new message.
   * It creates a new message object, adds it to the message list,
   * and clears the input field. The form submission is prevented.
   * @param {FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSendMessage = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedInput = inputValue.trim();
    if (trimmedInput) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: CURRENT_USER,
        text: trimmedInput,
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputValue('');
    }
  }, [inputValue]);

  return (
    <motion.div
        className="flex flex-col w-full max-w-[450px] h-[600px] border border-gray-200 rounded-2xl overflow-hidden font-sans bg-white shadow-xl"
        variants={panelVariants as Variants}
        initial="hidden"
        animate="visible"
    >
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50" ref={messageListRef}>
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isCurrentUser = message.sender.name === CURRENT_USER.name;
            return (
              <motion.div
                key={message.id}
                layout
                variants={messageItemVariants as Variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`flex items-start gap-2.5 max-w-[85%] ${isCurrentUser ? 'self-end flex-row-reverse' : ''}`}
              >
                <motion.img
                    src={message.sender.avatarUrl}
                    alt={`${message.sender.name}'s avatar`}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.1 }}
                />
                <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                  {!isCurrentUser && <span className="text-xs font-semibold text-gray-500 mb-1 ml-1">{message.sender.name}</span>}
                  <div
                    className={`py-2 px-3 rounded-2xl text-sm leading-normal break-words ${
                        isCurrentUser
                        ? 'bg-blue-500 text-white rounded-tr-md'
                        : 'bg-gray-200 text-gray-800 rounded-tl-md'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <motion.form
        className="flex items-center p-3 border-t border-gray-200 bg-white gap-2.5"
        onSubmit={handleSendMessage}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.4 }}
      >
        <input
          type="text"
          className="flex-1 py-2 px-4 border border-gray-300 rounded-full text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          aria-label="Chat message input"
        />
        <motion.button
          type="submit"
          className="py-2 px-5 border-none rounded-full bg-blue-500 text-white text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={inputValue.trim() === ''}
          aria-label="Send message"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          Send
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

// --- DEFAULT EXPORT WITH ERROR BOUNDARY ---

/**
 * The main export which wraps the ChatPanel component in an ErrorBoundary.
 * This follows best practices for creating robust components by gracefully
 * handling potential runtime errors.
 *
 * @returns {JSX.Element} The ChatPanel component wrapped in an ErrorBoundary.
 */
const ChatPanelWithBoundary = (): JSX.Element => (
    <ErrorBoundary FallbackComponent={ChatPanelErrorFallback}>
        <ChatPanel />
    </ErrorBoundary>
);

export default ChatPanelWithBoundary;