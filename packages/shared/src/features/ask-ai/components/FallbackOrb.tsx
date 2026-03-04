import { ShiningRectangle, ThreeStarInsideOrbIcon } from '@neuraltrade/saral';

interface FallbackOrbProps {
  size?: number;
}

const FallbackOrb = ({ size = 56 }: FallbackOrbProps) => {
  // Scale the internal icons proportionally to the orb size
  const scale = size / 56; // 56 is the default size
  const shiningWidth = Math.round(25 * scale);
  const shiningHeight = Math.round(13 * scale);
  const starWidth = Math.round(29 * scale);
  const starHeight = Math.round(26 * scale);

  return (
    <div className="relative group" style={{ width: `${size}px`, height: `${size}px` }}>
      <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 scale-[1] group-hover:scale-[1.2] transition-transform duration-300 ease-out -z-10" />
      <div
        className="rounded-full cursor-pointer relative z-10 overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 p-0 border-0 flex items-center justify-center"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-white/10 to-transparent blur-md" />
        <div className="relative inset-0 z-10 flex flex-col items-center justify-center">
          <ShiningRectangle width={shiningWidth} height={shiningHeight} />
          <div className="relative -top-1">
            <ThreeStarInsideOrbIcon width={starWidth} height={starHeight} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackOrb;
