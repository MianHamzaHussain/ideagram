import { useState, useEffect, useRef } from 'react';

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

/**
 * Refined Image Carousel with Index Callback
 * Features 444px block height, 403px image + 41px caption.
 */
const ImageCarousel = ({
  images,
  autoPlayInterval = 4000,
  onIndexChange
}: ImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync internal activeIndex with prop callback
  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(activeIndex);
    }
  }, [activeIndex, onIndexChange]);

  // Auto-play logic
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      scrollToIndex(nextIndex);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [activeIndex, images.length, autoPlayInterval]);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const itemWidth = 334;
    const gap = 10;

    container.scrollTo({
      left: index * (itemWidth + gap),
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const itemWidth = 334;
    const gap = 10;
    const scrollLeft = container.scrollLeft;
    const index = Math.round(scrollLeft / (itemWidth + gap));
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="relative w-full flex flex-col">
      {/* Scroll Container (444px height) */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-[10px] overflow-x-auto snap-x snap-mandatory scrollbar-hide px-[15px] h-[444px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="flex-none w-[334px] h-[444px] flex flex-col snap-start"
          >
            {/* Image/Video Container (403px height) */}
            <div className="w-full h-[403px] overflow-hidden bg-neutral-100">
              {img.type === 'video' ? (
                <video
                  src={img.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={img.url}
                  alt={img.caption || `Slide ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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
        <div className="flex-none w-[1px]" />
      </div>

      {/* Internal Indicators removed as they moved to the interaction bar */}
    </div>
  );
};

export default ImageCarousel;
