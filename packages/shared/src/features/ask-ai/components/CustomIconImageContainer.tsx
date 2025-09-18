import React from 'react';

interface CustomIconImageContainerProps {
  sourceUrl: string;
  imageAlt: string;
}

const CustomIconImageContainer: React.FC<CustomIconImageContainerProps> = React.memo(({ sourceUrl, imageAlt }) => {
  return (
    <div className="relative group h-14 w-14">
      <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 scale-[1] group-hover:scale-[1.2] transition-transform duration-300 ease-out -z-10" />
      <div className="rounded-full bg-background hover:bg-background-light relative z-10 h-14 w-14 flex items-center justify-center">
        <img
          src={sourceUrl}
          alt={imageAlt}
          className="h-full w-full rounded-full object-cover"
          loading="lazy"
          draggable={false}
          key={sourceUrl}
        />
      </div>
    </div>
  );
});

// Add display name for debugging
CustomIconImageContainer.displayName = 'CustomIconImageContainer';

export default CustomIconImageContainer;
