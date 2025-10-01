import { useEffect, useState } from 'react';
import { Button, LucideIcon } from '@meaku/saral';
import { useModalPortal } from '../../../hooks/usePortal';

interface FullscreenDemoPlayerProps {
  demoUrl: string;
  demoTitle: string;
  onClose: () => void;
}

export const FullscreenDemoPlayer = ({ demoUrl, demoTitle, onClose }: FullscreenDemoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { renderInPortal } = useModalPortal();

  // Handle escape key to close overlay
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const fullscreenContent = (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center"
      style={{
        zIndex: 2147483647, // Use the highest possible z-index directly
        pointerEvents: 'auto', // Override the portal's pointer-events: none
        // Ensure it covers the entire viewport even if fullscreen API fails
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        // Force it to be above everything
        position: 'fixed',
      }}
    >
      {/* Close button */}
      <Button
        onClick={onClose}
        variant="default"
        className="absolute top-4 right-4 flex gap-2"
        style={{ zIndex: 10 }}
        aria-label="Close demo overlay"
      >
        <LucideIcon name="minimize-2" className="size-4" />
        Exit Demo
      </Button>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-white text-lg">Loading demo...</div>
        </div>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white p-8">
          <div className="text-xl mb-4">Demo failed to load</div>
          <div className="text-sm mb-6 text-center max-w-md">
            The demo content couldn't be displayed in the iframe. This might be due to security restrictions.
          </div>
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            Open Demo in New Tab
          </a>
        </div>
      )}

      {/* Fullscreen iframe */}
      {!hasError && (
        <iframe
          src={demoUrl}
          title={demoTitle}
          className="w-full h-full border-0"
          style={{
            pointerEvents: 'auto',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            // Ensure iframe covers everything
            backgroundColor: 'black',
          }}
          onLoad={handleIframeLoad}
          onError={(e) => {
            console.error('Iframe load error:', e);
            setHasError(true);
            setIsLoading(false);
          }}
          allow="autoplay; fullscreen; picture-in-picture; microphone; camera; display-capture; clipboard-read; clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          referrerPolicy="no-referrer-when-downgrade"
          loading="eager"
        />
      )}
    </div>
  );

  return renderInPortal(fullscreenContent);
};
