import { ShiningRectangle, ThreeStarInsideOrbIcon } from '@meaku/saral';

const FallbackOrb = () => {
  return (
    <div className="relative group h-14 w-14">
      <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 scale-[1] group-hover:scale-[1.2] transition-transform duration-300 ease-out -z-10" />
      <div className="rounded-full cursor-pointer relative z-10 h-14 w-14 overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 p-0 border-0 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-white/10 to-transparent blur-md" />
        <div className="relative inset-0 z-10 flex flex-col items-center justify-center">
          <ShiningRectangle width={25} height={13} />
          <div className="relative -top-1">
            <ThreeStarInsideOrbIcon width={29} height={26} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackOrb;
