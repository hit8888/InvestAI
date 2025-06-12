import { useCycle } from '@breakout/design-system/hooks/useCycle';

type QouteSliderProps = {
  slides?: {
    quote: string;
    author: string;
  }[];
};

const QouteSlider = ({ slides }: QouteSliderProps) => {
  const { currentItemIndex } = useCycle({
    itemsLength: slides?.length || 1,
    intervalDuration: 5000,
    initialIndex: Math.floor(Math.random() * (slides?.length || 1)),
  });

  if (!slides || slides?.length === 0) {
    return null;
  }

  return (
    <div className="text-white">
      <div className="flex flex-col gap-4">
        <p className="max-w-[699px] font-['Inter_Tight'] text-[32px] font-medium leading-tight tracking-[.01em]">
          {slides[currentItemIndex].quote}
        </p>
        <p className="font-['system-ui'] text-2xl">{slides[currentItemIndex].author}</p>
      </div>
      <div className="mt-[60px] flex items-center gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full bg-white transition-all duration-300 ${
              currentItemIndex === index ? 'w-[100px]' : 'w-10 opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default QouteSlider;
