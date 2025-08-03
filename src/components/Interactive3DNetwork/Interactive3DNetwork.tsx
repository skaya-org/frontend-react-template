import React, { useState, useMemo, useRef, useCallback, JSX } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
  Variants,
} from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// --- TYPE DEFINITIONS ---

/**
 * @typedef {object} NodeData
 * @property {string} id - Unique identifier for the node.
 * @property {string} name - Display name of the network node.
 * @property {{x: number, y: number, z: number}} position - The initial 3D coordinates of the node.
 * @property {string} color - The primary color for the node and its glow.
 */
type NodeData = {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  color: string;
};

/**
 * @typedef {object} ConnectionData
 * @property {string} from - The ID of the starting node.
 * @property {string} to - The ID of the ending node.
 */
type ConnectionData = {
  from: string;
  to: string;
};

// --- CONSTANT DATA ---

/**
 * Predefined static data for the blockchain network structure.
 * This object contains all nodes and their connections.
 * The component is self-contained and does not require this data as a prop.
 * @const
 */
const NETWORK_DATA: { nodes: NodeData[]; connections: ConnectionData[] } = {
  nodes: [
    { id: 'eth', name: 'Ethereum', position: { x: 0, y: 0, z: 0 }, color: '#627eea' },
    { id: 'btc', name: 'Bitcoin', position: { x: -200, y: 100, z: 50 }, color: '#f7931a' },
    { id: 'sol', name: 'Solana', position: { x: 200, y: -80, z: 80 }, color: '#9945ff' },
    { id: 'ada', name: 'Cardano', position: { x: 150, y: 150, z: -100 }, color: '#0033ad' },
    { id: 'dot', name: 'Polkadot', position: { x: -150, y: -150, z: -80 }, color: '#e6007a' },
    { id: 'link', name: 'Chainlink', position: { x: 0, y: 50, z: 200 }, color: '#375bd2' },
  ],
  connections: [
    { from: 'eth', to: 'btc' },
    { from: 'eth', to: 'sol' },
    { from: 'eth', to: 'link' },
    { from: 'btc', to: 'ada' },
    { from: 'sol', to: 'dot' },
    { from: 'ada', to: 'dot' },
    { from: 'link', to: 'sol' },
  ],
};

// --- HELPER COMPONENTS & LOGIC ---

/**
 * Calculates the transformation properties for a line connecting two 3D points.
 * @param {NodeData} startNode - The starting node of the connection.
 * @param {NodeData} endNode - The ending node of the connection.
 * @returns {{width: number; transform: string}} The CSS properties for the connection line.
 */
const calculateConnectionTransform = (startNode: NodeData, endNode: NodeData) => {
  const p1 = startNode.position;
  const p2 = endNode.position;

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;

  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const rotateY = Math.atan2(dx, dz) * (180 / Math.PI);
  const rotateZ = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) * (180 / Math.PI);

  const transform = `
    translateX(${p1.x}px)
    translateY(${p1.y}px)
    translateZ(${p1.z}px)
    rotateY(${rotateY}deg)
    rotateZ(${rotateZ}deg)
  `;

  return { width: distance, transform };
};

const nodeVariants: Variants = {
  initial: { opacity: 0, scale: 0.3 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
};

/**
 * Renders a single node in the 3D network.
 * @param {object} props - The properties for the Node component.
 * @param {NodeData} props.node - The data for the node to render.
 * @returns {JSX.Element} A memoized React element representing a node.
 */
const NetworkNode = React.memo(({ node }: { node: NodeData }): JSX.Element => {
    const [isHovered, setIsHovered] = useState(false);

    const glowStyle = {
      boxShadow: `
        0 0 10px ${node.color},
        0 0 20px ${node.color},
        0 0 30px ${node.color},
        0 0 40px ${node.color}
      `,
    };

    return (
      <motion.div
        className="absolute flex h-[30px] w-[30px] items-center justify-center rounded-full backface-hidden"
        style={{
          transform: `
            translateX(${node.position.x - 15}px)
            translateY(${node.position.y - 15}px)
            translateZ(${node.position.z}px)
          `,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        variants={nodeVariants as Variants}
      >
        <div 
          className="relative z-10 h-full w-full rounded-full bg-white"
          style={glowStyle} 
        />
        <motion.div
            className="pointer-events-none absolute -bottom-[25px] select-none text-xs font-bold text-gray-300 [text-shadow:0_0_5px_#000]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        >
            {node.name}
        </motion.div>
      </motion.div>
    );
});
NetworkNode.displayName = 'NetworkNode';

const connectionVariants: Variants = {
    initial: { scaleX: 0, opacity: 0 },
    animate: {
        scaleX: 1,
        opacity: 0.5,
        transition: { duration: 0.7, ease: 'easeOut' },
    },
    hover: {
        opacity: 1,
        transition: { duration: 0.2 }
    }
};

/**
 * Renders a single connection line in the 3D network.
 * @param {object} props - The properties for the Connection component.
 * @param {ConnectionData} props.connection - The data for the connection to render.
 * @param {Record<string, NodeData>} props.nodeMap - A map for quick node lookup by ID.
 * @returns {JSX.Element|null} A memoized React element representing a connection, or null if nodes are not found.
 */
const NetworkConnection = React.memo(({ connection, nodeMap }: { connection: ConnectionData; nodeMap: Record<string, NodeData> }): JSX.Element | null => {
    const startNode = nodeMap[connection.from];
    const endNode = nodeMap[connection.to];

    if (!startNode || !endNode) {
      console.warn(`Could not find nodes for connection from ${connection.from} to ${connection.to}`);
      return null;
    }

    const { width, transform } = calculateConnectionTransform(startNode, endNode);
    
    const color = startNode.color;
    const glowStyle = {
      background: color,
      boxShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
    };

    return (
      <motion.div
        className="absolute h-[2px] origin-left backface-hidden"
        style={{
          width: `${width}px`,
          transform: transform,
          ...glowStyle
        }}
        variants={connectionVariants as Variants}
        whileHover="hover"
      />
    );
});
NetworkConnection.displayName = 'NetworkConnection';

const sceneVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.8,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1.2,
            ease: 'easeInOut',
            staggerChildren: 0.1,
        },
    },
};

/**
 * The core component that renders the interactive 3D network.
 * It handles user interactions like dragging and zooming.
 * @returns {JSX.Element} The interactive 3D network scene.
 */
const Interactive3DNetworkContent = (): JSX.Element => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Motion values for rotation and scale (zoom)
    const rotateX = useMotionValue(20);
    const rotateY = useMotionValue(-30);
    const scale = useMotionValue(1);

    // Limiting the scale to prevent zooming too far in or out
    const clampedScale = useTransform(scale, [0.5, 2], [0.5, 2]);

    /**
     * Handles the drag-to-rotate interaction.
     * @param {MouseEvent | TouchEvent | PointerEvent} _event - The pan event.
     * @param {PanInfo} info - Information about the pan gesture.
     */
    const handlePan = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        rotateY.set(rotateY.get() + info.offset.x * 0.5);
        rotateX.set(rotateX.get() - info.offset.y * 0.5);
    };

    /**
     * Handles the scroll-to-zoom interaction.
     * @param {React.WheelEvent<HTMLDivElement>} event - The mouse wheel event.
     */
    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        const newScale = scale.get() - event.deltaY * 0.001;
        scale.set(newScale);
    };

    // Memoize node map for efficient lookups
    const nodeMap = useMemo(() =>
      NETWORK_DATA.nodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {} as Record<string, NodeData>),
    []);

    return (
        <div 
            ref={containerRef}
            className={`flex h-screen w-full items-center justify-center overflow-hidden bg-[#0a0a0f] text-white ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onWheel={handleWheel}
        >
            <div className="h-[600px] w-[600px] perspective-[1200px]">
                <motion.div
                    className="relative h-full w-full transform-preserve-3d"
                    style={{
                        rotateX,
                        rotateY,
                        scale: clampedScale,
                    }}
                    onPan={handlePan}
                    onPanStart={() => setIsDragging(true)}
                    onPanEnd={() => setIsDragging(false)}
                    variants={sceneVariants as Variants}
                    initial="initial"
                    animate="animate"
                >
                    {/* Render Connections */}
                    {NETWORK_DATA.connections.map((conn, i) => (
                        <NetworkConnection key={`conn-${i}`} connection={conn} nodeMap={nodeMap} />
                    ))}
                    {/* Render Nodes */}
                    {NETWORK_DATA.nodes.map(node => (
                        <NetworkNode key={node.id} node={node} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

/**
 * A fallback component to display when an error occurs within the component tree.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @param {Error} props.error - The error that was caught.
 * @returns {JSX.Element} A simple and informative error message UI.
 */
const ErrorFallback = ({ error }: FallbackProps): JSX.Element => (
    <div role="alert" className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0f] font-mono text-red-500">
        <h1 className="mb-2.5 text-2xl">Something went wrong.</h1>
        <p className="max-w-[80%] text-center text-base">{error.message}</p>
        <p className="mt-4 text-gray-400">Please refresh the page to try again.</p>
    </div>
);

/**
 * @name Interactive3DNetwork
 * @description A visually impressive component that renders an interactive 3D model
 * of interconnected blockchain networks. Users can navigate the space by dragging to
 * rotate and scrolling to zoom. The component is self-contained with static data,
 * features a neon glow aesthetic against a dark background, and includes its own
 * error boundary for robustness.
 *
 * @example
 * ```tsx
 * import Interactive3DNetwork from './components/Interactive3DNetwork';
 *
 * function App() {
 *   return <Interactive3DNetwork />;
 * }
 * ```
 * @returns {JSX.Element} The rendered Interactive3DNetwork component, wrapped in an ErrorBoundary.
 */
const Interactive3DNetwork = (): JSX.Element => {
    const logError = useCallback((error: Error, info: React.ErrorInfo) => {
        // In a real application, this would send errors to a logging service
        console.error("Caught an error:", error, info);
    }, []);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
            <Interactive3DNetworkContent />
        </ErrorBoundary>
    );
};

export default Interactive3DNetwork;