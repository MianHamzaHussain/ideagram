import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, useAnimation, type PanInfo } from 'framer-motion';

interface CarouselImage {
  url: string;
  caption?: string;
  type: 'image' | 'video';
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlayInterval?: number;
  onIndexChange?: (index: number) => void;
}

/** Slide width + gap, used to calculate offsets */
const ITEM_WIDTH = 334;
const GAP = 10;
const PADDING = 15;

/**
 * Refined Image Carousel with Index Callback
 * Features 444px block height, 403px image + 41px caption.
 *
 * Uses framer-motion drag for bulletproof swipe on iOS Safari & Android Chrome.
 * Native CSS scroll-snap has known WebKit bugs that cause inconsistent
 * behavior; drag-based swiping avoids them entirely.
 */
const ImageCarousel = ({
  images,
  autoPlayInterval = 4000,
  onIndexChange
}: ImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragLeft, setDragLeft] = useState(0);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  /** Total number of slides */
  const count = images.length;

  /** Pixel offset for a given slide index */
  const getOffset = useCallback((index: number) => {
    return -(index * (ITEM_WIDTH + GAP));
  }, []);

  /** Compute max drag distance outside render (refs must not be read during render) */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const containerWidth = el.offsetWidth;
    const totalWidth = count * ITEM_WIDTH + (count - 1) * GAP + PADDING * 2;
    setDragLeft(Math.min(0, -(totalWidth - containerWidth)));
  }, [count]);

  /** Animate to a specific slide index */
  const goToSlide = useCallback(
    (index: number, immediate = false) => {
      const clamped = Math.max(0, Math.min(index, count - 1));
      setActiveIndex(clamped);
      controls.start({
        x: getOffset(clamped),
        transition: immediate
          ? { duration: 0 }
          : { type: 'spring', stiffness: 300, damping: 30 }
      });
    },
    [controls, count, getOffset]
  );

  // Sync internal activeIndex with prop callback
  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(activeIndex);
    }
  }, [activeIndex, onIndexChange]);

  // Auto-play logic
  useEffect(() => {
    if (count <= 1) return;

    const interval = setInterval(() => {
      if (isDragging.current) return;
      const next = (activeIndex + 1) % count;
      goToSlide(next);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [activeIndex, count, autoPlayInterval, goToSlide]);

  // Set initial position
  useEffect(() => {
    controls.set({ x: getOffset(0) });
  }, [controls, getOffset]);

  /**
   * Drag-end handler.
   * Uses a combination of offset distance AND velocity to decide
   * whether to advance, go back, or snap to the current slide.
   * A velocity threshold of ±300 means a quick flick always advances.
   */
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDragging.current = false;
    const { offset, velocity } = info;

    const swipeThreshold = ITEM_WIDTH / 4; // 25% of slide width
    const velocityThreshold = 300; // px/s

    let newIndex = activeIndex;

    if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
      newIndex = Math.min(activeIndex + 1, count - 1);
    } else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
      newIndex = Math.max(activeIndex - 1, 0);
    }

    goToSlide(newIndex);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Media gallery"
      style={{
        /* Allow vertical page scroll; horizontal handled by framer drag */
        touchAction: 'pan-y',
        /* Prevent iOS rubber-band bounce from hijacking the gesture */
        overscrollBehaviorX: 'contain',
      }}
    >
      {/* Drag track (444px height) */}
      <motion.div
        drag="x"
        dragConstraints={{
          left: dragLeft,
          right: 0
        }}
        dragElastic={0.15}
        dragMomentum={false}
        onDragStart={() => { isDragging.current = true; }}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="flex h-[444px] cursor-grab active:cursor-grabbing"
        /* Spacing: left padding + gaps between items */
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="flex-none w-[334px] h-[444px] flex flex-col"
            style={{
              marginLeft: index === 0 ? PADDING : GAP,
              marginRight: index === count - 1 ? PADDING : 0,
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${count}`}
          >
            {/* Image/Video Container (403px height) */}
            <div className="w-full h-[403px] overflow-hidden bg-neutral-100">
              {img.type === 'video' ? (
                <video
                  src={img.url}
                  className="w-full h-full object-cover pointer-events-none"
                  aria-label={img.caption || "Autoplaying media content"}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={img.url}
                  alt={img.caption || `Product image ${index + 1}`}
                  draggable="false"
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
              )}
            </div>
            {/* Caption Container (41px height) */}
            <div className="w-full h-[41px] border-x border-b border-neutral-200 rounded-b-lg px-3 flex items-center bg-white">
              <p className="body-xs text-neutral-900 truncate w-full">
                {img.caption || 'No description available'}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Internal Indicators removed as they moved to the interaction bar */}
    </div>
  );
};

export default ImageCarousel;
