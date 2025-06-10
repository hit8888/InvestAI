import { useState } from 'react';

type QouteSliderProps = {
  slides?: {
    quote: string;
    author: string;
  }[];
};

const QouteSlider = ({ slides }: QouteSliderProps) => {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!slides || slides?.length === 0) {
    return null;
  }

  return (
    <div className="text-white">
      <div className="flex flex-col gap-4">
        <p className="max-w-[699px] font-['Inter_Tight'] text-[32px] font-medium leading-tight tracking-[.01em]">
          {slides[activeSlide].quote}
        </p>
        <p className="font-['SF_Pro_Display'] text-2xl">{slides[activeSlide].author}</p>
      </div>
      <div className="mt-[60px] flex cursor-pointer items-center gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full bg-white transition-all duration-300 ${
              activeSlide === index ? 'w-[100px]' : 'w-10 opacity-50'
            }`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default QouteSlider;
