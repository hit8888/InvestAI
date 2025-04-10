const SpinLoader = () => {
  return (
    <div className="flex items-center justify-center">
      {/* Outer ring with gradient */}
      <div
        className="relative h-12 w-12 animate-slowSpin rounded-full p-1"
        style={{
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
        <div className="absolute h-10 w-10 rounded-full bg-white" />
      </div>
    </div>
  );
};

export default SpinLoader;
