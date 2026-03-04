import { useEffect, useState } from 'react';
import { Button, LucideIcon } from '@neuraltrade/saral';
import { useModalPortal } from '../../../hooks/usePortal';

interface FullscreenDemoPlayerProps {
  demoUrl: string;
  demoTitle: string;
  onClose: () => void;
}

export const FullscreenDemoPlayer = ({ demoUrl, demoTitle, onClose }: FullscreenDemoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { renderInPortal, getZIndexClass } = useModalPortal();

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center ${getZIndexClass()}`}
      style={{
        pointerEvents: 'auto', // Override the portal's pointer-events: none
        // Force it to be above everything
        position: 'fixed',
      }}
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div
        className="relative bg-white rounded-lg shadow-2xl"
        style={{
          width: 'calc(100vw - 32px)',
          height: 'calc(100vh - 32px)',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 32px)',
        }}
      >
        {/* Close button */}
        <Button
          onClick={onClose}
          variant="outline"
          className="absolute -top-3 -right-3 flex gap-2 z-10 rounded-full size-12"
          aria-label="Close demo modal"
        >
          <LucideIcon name="x" className="size-6" />
        </Button>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
            <div className="text-gray-600 text-lg">Loading demo...</div>
          </div>
        )}

        {/* Error fallback */}
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-800 p-8">
            <div className="text-xl mb-4">Demo failed to load</div>
            <div className="text-sm mb-6 text-center max-w-md">
              The demo content couldn't be displayed in the iframe. This might be due to security restrictions.
            </div>
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Open Demo in New Tab
            </a>
          </div>
        )}

        {/* Modal iframe */}
        {!hasError && (
          <iframe
            src={demoUrl}
            title={demoTitle}
            className="w-full h-full border-0 rounded-lg"
            style={{
              pointerEvents: 'auto',
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
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
    </div>
  );

  return renderInPortal(modalContent);
};
