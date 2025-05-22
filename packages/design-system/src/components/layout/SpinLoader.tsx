interface SpinLoaderProps {
  width?: number;
  height?: number;
}

const SpinLoader = ({ width = 12, height = 12 }: SpinLoaderProps) => {
  // Calculate inner circle dimensions (2 units smaller than outer ring)
  const innerWidth = width - 2;
  const innerHeight = height - 2;

  return (
    <div className="flex items-center justify-center">
      {/* Outer ring with gradient */}
      <div
        className="relative animate-slowSpin rounded-full p-1"
        style={{
          width: `${width * 4}px`,
          height: `${height * 4}px`,
          background: `conic-gradient(
                rgb(var(--system) / 0.1) 0deg, 
                rgb(var(--system) / 0.2) 45deg, 
                rgb(var(--system) / 0.3) 90deg, 
                rgb(var(--system) / 0.4) 135deg, 
                rgb(var(--system) / 0.5) 180deg, 
                rgb(var(--system) / 0.6) 225deg, 
                rgb(var(--system) / 0.7) 270deg, 
                rgb(var(--system) / 0.8) 315deg,
                rgb(var(--system)) 360deg
            )`,
        }}
      >
        {/* Inner circle to create a ring effect */}
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: `${innerWidth * 4}px`,
            height: `${innerHeight * 4}px`,
          }}
        />
      </div>
    </div>
  );
};

export default SpinLoader;
