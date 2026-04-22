import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  motion,
  useMotionValue,
  useAnimation,
  useTransform,
  type PanInfo,
} from 'framer-motion';

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

/* ── Layout constants ─────────────────────────────────── */
const ITEM_WIDTH = 334;
const GAP = 10;
const PADDING = 15;
const STEP = ITEM_WIDTH + GAP; // 344px per slide

/* ── iOS-tuned spring physics ────────────────────────── */
/** Snap spring — matches the crisp, soft-landing feel of UIScrollView. */
const SNAP_SPRING = { type: 'spring' as const, stiffness: 260, damping: 26, mass: 0.9 };

/** Auto-play spring — slightly slower & softer for ambient transitions. */
const AUTO_SPRING = { type: 'spring' as const, stiffness: 180, damping: 28, mass: 1 };

/* ── Gesture thresholds ──────────────────────────────── */
/** Minimum drag distance to register as intentional swipe (15% of slide). */
const SWIPE_OFFSET = ITEM_WIDTH * 0.15;
/** Velocity in px/s — a quick flick always advances regardless of distance. */
const FLICK_VELOCITY = 250;

/**
 * Premium Image Carousel
 * ──────────────────────
 * 444px block: 403px media + 41px caption.
 *
 * Uses framer-motion `drag="x"` for bulletproof swipe on iOS Safari &
 * Android Chrome. Tuned with iOS-style spring physics, rubber-band
 * overscroll, velocity-proportional multi-slide flicks, and subtle
 * depth-of-field scaling on inactive slides.
 */
const ImageCarousel = ({
  images,
  autoPlayInterval = 4000,
  onIndexChange,
}: ImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragLeft, setDragLeft] = useState(0);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const count = images.length;

  /* ── Offset helpers ─────────────────────────────────── */
  const getOffset = useCallback(
    (index: number) => -(index * STEP),
    [],
  );

  /** Compute max drag limit outside render (ref access in effect only). */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const containerWidth = el.offsetWidth;
    const totalWidth = count * ITEM_WIDTH + (count - 1) * GAP + PADDING * 2;
    setDragLeft(Math.min(0, -(totalWidth - containerWidth)));
  }, [count]);

  /* ── Navigation ─────────────────────────────────────── */
  const goToSlide = useCallback(
    (index: number, spring = SNAP_SPRING) => {
      const clamped = Math.max(0, Math.min(index, count - 1));
      setActiveIndex(clamped);
      controls.start({ x: getOffset(clamped), transition: spring });
    },
    [controls, count, getOffset],
  );

  // Sync active index → parent
  useEffect(() => {
    onIndexChange?.(activeIndex);
  }, [activeIndex, onIndexChange]);

  // Auto-play (pauses during drag)
  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      if (isDragging.current) return;
      goToSlide((activeIndex + 1) % count, AUTO_SPRING);
    }, autoPlayInterval);
    return () => clearInterval(id);
  }, [activeIndex, count, autoPlayInterval, goToSlide]);

  // Initial position
  useEffect(() => {
    controls.set({ x: getOffset(0) });
  }, [controls, getOffset]);

  /* ── Drag handler ───────────────────────────────────── */
  /**
   * Velocity-proportional snapping:
   *   - A gentle drag (>15% offset) moves one slide.
   *   - A fast flick (>250 px/s) advances even if distance is tiny.
   *   - An aggressive flick lets you skip up to 3 slides at once,
   *     proportional to the flick speed — just like native iOS paging
   *     when the deceleration rate is fast.
   */
  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDragging.current = false;
    const { offset, velocity } = info;

    let delta = 0; // slides to move (negative = forward)

    if (offset.x < -SWIPE_OFFSET || velocity.x < -FLICK_VELOCITY) {
      // Swiping left → advance
      const extraSlides = Math.min(2, Math.floor(Math.abs(velocity.x) / 600));
      delta = 1 + extraSlides;
    } else if (offset.x > SWIPE_OFFSET || velocity.x > FLICK_VELOCITY) {
      // Swiping right → go back
      const extraSlides = Math.min(2, Math.floor(Math.abs(velocity.x) / 600));
      delta = -(1 + extraSlides);
    }

    goToSlide(activeIndex + delta);
  };

  /* ── Per-slide animated transforms ──────────────────── */
  /**
   * Each slide subscribes to the shared `x` motion value and derives
   * its own scale + opacity, creating a subtle depth-of-field parallax
   * that makes the active slide feel "lifted" — the signature premium
   * carousel feel.
   */
  const slideTransforms = useMemo(
    () =>
      images.map((_, i) => {
        const center = -(i * STEP);
        return { center, halfStep: STEP * 0.8 };
      }),
    [images],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Media gallery"
      style={{
        touchAction: 'pan-y',
        overscrollBehaviorX: 'contain',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {/* ── Drag track ──────────────────────────────── */}
      <motion.div
        drag="x"
        dragConstraints={{ left: dragLeft, right: 0 }}
        dragElastic={0.18}
        dragMomentum={false}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
        onDragStart={() => { isDragging.current = true; }}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, willChange: 'transform' }}
        className="flex h-[444px]"
      >
        {images.map((img, index) => (
          <CarouselSlide
            key={index}
            img={img}
            index={index}
            count={count}
            x={x}
            center={slideTransforms[index].center}
            halfStep={slideTransforms[index].halfStep}
          />
        ))}
      </motion.div>

      {/* Internal indicators moved to the interaction bar */}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════ */
/*  Individual slide — owns its own animated transforms   */
/* ═══════════════════════════════════════════════════════ */

interface SlideProps {
  img: CarouselImage;
  index: number;
  count: number;
  x: import('framer-motion').MotionValue<number>;
  center: number;
  halfStep: number;
}

const CarouselSlide = ({ img, index, count, x, center, halfStep }: SlideProps) => {
  /**
   * Derive scale & opacity from the drag x.
   *  - Active (centered): scale 1, opacity 1
   *  - One slide away:    scale 0.96, opacity 0.7
   *
   * The ramp uses 80% of STEP so the effect kicks in before
   * the slide is fully off-center, matching Apple's Photos app.
   */
  const scale = useTransform(
    x,
    [center - halfStep, center, center + halfStep],
    [0.96, 1, 0.96],
  );
  const opacity = useTransform(
    x,
    [center - halfStep, center, center + halfStep],
    [0.7, 1, 0.7],
  );

  return (
    <motion.div
      className="flex-none w-[334px] h-[444px] flex flex-col origin-center"
      style={{
        marginLeft: index === 0 ? PADDING : GAP,
        marginRight: index === count - 1 ? PADDING : 0,
        scale,
        opacity,
        willChange: 'transform, opacity',
      }}
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${index + 1} of ${count}`}
    >
      {/* Image / Video (403px) */}
      <div className="w-full h-[403px] overflow-hidden bg-neutral-100 rounded-t-lg">
        {img.type === 'video' ? (
          <video
            src={img.url}
            className="w-full h-full object-cover pointer-events-none"
            aria-label={img.caption || 'Autoplaying media content'}
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

      {/* Caption (41px) */}
      <div className="w-full h-[41px] border-x border-b border-neutral-200 rounded-b-lg px-3 flex items-center bg-white">
        <p className="body-xs text-neutral-900 truncate w-full">
          {img.caption || 'No description available'}
        </p>
      </div>
    </motion.div>
  );
};

export default ImageCarousel;
