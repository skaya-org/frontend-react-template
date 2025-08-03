import React, { JSX, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

//==============================================================================
// TYPE DEFINITIONS
//==============================================================================

/**
 * @interface ITimelineItem
 * @description Represents a single event or item on the timeline.
 * This interface is exported so it can be used to construct the data array
 * for the Timeline component.
 */
export interface ITimelineItem {
  /**
   * A unique identifier for the timeline item. Used for React keys.
   * @type {string | number}
   */
  id: string | number;

  /**
   * The date or time period for the event (e.g., "2023", "June 5th").
   * @type {string}
   */
  date: string;

  /**
   * The main title of the timeline event.
   * @type {string}
   */
  title: string;

  /**
   * A detailed description of the event.
   * @type {string}
   */
  description: string;

  /**
   * An optional icon element to display in the center of the timeline dot.
   * @type {React.ReactNode}
   * @optional
   */
  icon?: ReactNode;
}

/**
 * @interface ITimelineProps
 * @description Defines the props for the Timeline component.
 */
export interface ITimelineProps {
  /**
   * An array of timeline item objects to display.
   * The component will gracefully handle an empty or undefined array by rendering nothing.
   * @type {ITimelineItem[]}
   * @default []
   */
  items?: ITimelineItem[];

  /**
   * Optional custom class name for the root timeline container.
   * Can be used for additional styling from the parent.
   * @type {string}
   * @optional
   */
  className?: string;

  /**
   * Optional configuration for the animation.
   * @type {object}
   * @property {number} [distance=100] - The horizontal distance the item travels during animation.
   * @property {number} [duration=0.8] - The duration of the animation in seconds.
   * @optional
   */
  animationConfig?: {
    distance?: number;
    duration?: number;
  };
}

//==============================================================================
// ERROR FALLBACK COMPONENT
//==============================================================================

/**
 * @description A fallback component to render when an error is caught by the ErrorBoundary.
 * @param {FallbackProps} props - Props provided by react-error-boundary.
 * @returns {JSX.Element} The rendered error message UI.
 */
const TimelineErrorFallback = ({ error }: FallbackProps): JSX.Element => (
  <div role="alert" className="p-5 bg-red-50 text-red-700 rounded-lg border border-red-200">
    <strong className="font-bold">Timeline Component Error:</strong>
    <p>Failed to render one or more timeline items.</p>
    <pre className="whitespace-pre-wrap break-all mt-2 text-sm">{error.message}</pre>
  </div>
);


//==============================================================================
// TIMELINE ITEM SUB-COMPONENT
//==============================================================================

interface ITimelineItemComponentProps {
  item: ITimelineItem;
  index: number;
  animationConfig: Required<NonNullable<ITimelineProps['animationConfig']>>;
}

/**
 * @description Renders a single item in the timeline, handling its alignment and animation.
 * This is a non-exported, internal component.
 * @param {ITimelineItemComponentProps} props - The props for the component.
 * @returns {JSX.Element} A single animated timeline item.
 */
const TimelineItemComponent = ({ item, index, animationConfig }: ITimelineItemComponentProps): JSX.Element => {
  const isLeft = index % 2 === 0;

  // Define animation variants for Framer Motion
  const itemVariants = {
    hidden: {
      opacity: 0,
      x: isLeft ? -animationConfig.distance : animationConfig.distance,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: animationConfig.duration,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={`relative flex mb-10 ${isLeft ? 'justify-start' : 'justify-end'}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={itemVariants as Variants}
    >
      {/* Content Box */}
      <div className={`w-[calc(50%-2.5rem)] bg-white p-5 rounded-lg shadow-md relative ${isLeft ? 'mr-10' : 'ml-10'}`}>
        {/* Arrow */}
        <div
          className={`
            absolute top-5 w-0 h-0
            border-t-8 border-t-transparent
            border-b-8 border-b-transparent
            ${isLeft
              ? '-right-[15px] border-l-[15px] border-l-white'
              : '-left-[15px] border-r-[15px] border-r-white'
            }
          `}
        />
        <p className="text-blue-500 font-bold text-sm mb-2">{item.date}</p>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
        <p className="text-base text-gray-600 leading-relaxed">{item.description}</p>
      </div>
      
      {/* Dot on Timeline */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-blue-500 z-10 flex items-center justify-center">
        {item.icon}
      </div>
    </motion.div>
  );
};

//==============================================================================
// MAIN TIMELINE COMPONENT
//==============================================================================

/**
 * @component Timeline
 * @description A vertically oriented, animated timeline component to showcase events.
 * Items animate into view on either side of a central line as the user scrolls.
 *
 * @param {ITimelineProps} props - The props for the Timeline component.
 * @returns {JSX.Element} The rendered timeline section.
 */
const Timeline = ({
  items = [],
  className = '',
  animationConfig: userAnimationConfig,
}: ITimelineProps): JSX.Element => {

  const animationConfig = {
    distance: 100,
    duration: 0.8,
    ...userAnimationConfig,
  };

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className={`text-center p-10 text-gray-400 ${className}`}>
        No timeline events to display.
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-5xl mx-auto py-10 px-5 ${className}`}>
      {/* Central Line */}
      <motion.div
        className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-1 bg-slate-200 rounded-sm"
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: 1, originY: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      
      <ErrorBoundary FallbackComponent={TimelineErrorFallback}>
        {items.map((item, index) => (
          item && item.id != null ? (
             <TimelineItemComponent
                key={item.id}
                item={item}
                index={index}
                animationConfig={animationConfig}
              />
          ) : null
        ))}
      </ErrorBoundary>
    </div>
  );
};

export default Timeline;