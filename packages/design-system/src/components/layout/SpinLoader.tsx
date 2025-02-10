const SpinLoader = () => {
    return (
      <div className="flex items-center justify-center">
        {/* Outer ring with gradient */}
        <div
          className="relative h-12 w-12 rounded-full p-1 animate-slowSpin"
          style={{
            background: `conic-gradient(
                rgb(var(--primary) / 0.1) 0deg, 
                rgb(var(--primary) / 0.2) 45deg, 
                rgb(var(--primary) / 0.3) 90deg, 
                rgb(var(--primary) / 0.4) 135deg, 
                rgb(var(--primary) / 0.5) 180deg, 
                rgb(var(--primary) / 0.6) 225deg, 
                rgb(var(--primary) / 0.7) 270deg, 
                rgb(var(--primary) / 0.8) 315deg,
                rgb(var(--primary)) 360deg
            )`,
          }}
        >
          {/* Inner circle to create a ring effect */}
          <div className="absolute w-10 h-10 rounded-full bg-white" />
        </div>
      </div>
    );
  };

export default SpinLoader;
