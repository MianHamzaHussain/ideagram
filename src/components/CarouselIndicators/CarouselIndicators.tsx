interface CarouselIndicatorsProps {
  imagesCount: number;
  activeIndex: number;
}

const CarouselIndicators = ({ imagesCount, activeIndex }: CarouselIndicatorsProps) => {
  return (
    <div className="flex items-center gap-[6px]">
      {Array.from({ length: imagesCount }).map((_, i) => {
        const distance = Math.abs(i - activeIndex);
        let size = "w-2 h-2";
        let opacity = "bg-neutral-900"; // Active

        if (i !== activeIndex) {
          opacity = "bg-neutral-400";
          if (distance === 1) size = "w-[6px] h-[6px]";
          else if (distance === 2) size = "w-[4px] h-[4px]";
          else size = "w-[3px] h-[3px]";

          const opacities = ["", "opacity-80", "opacity-60", "opacity-40", "opacity-20"];
          opacity += " " + (opacities[distance] || "opacity-10");
        }

        return (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${size} ${opacity}`}
          />
        );
      })}
    </div>
  );
};

export default CarouselIndicators;
