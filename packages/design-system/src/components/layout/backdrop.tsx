import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';

type Props = React.PropsWithChildren<{
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
  landingPageUrl?: string; // The URL of the landing page
}>;

const Backdrop = (props: Props) => {
  const { children, className, landingPageUrl } = props;
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Simulate deferred iframe loading
  useEffect(() => {
    const timer = setTimeout(() => setIframeLoaded(true), 1000); // Adjust timeout as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Landing Page Background */}
      {!!landingPageUrl && iframeLoaded && (
        <iframe
          src={landingPageUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          title="Landing Page Background"
        ></iframe>
      )}

      {/* Backdrop Overlay */}
      <div
        className={cn('fixed inset-0 h-screen w-screen', className, {
          'bg-black/30': !iframeLoaded || !landingPageUrl,
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default Backdrop;
