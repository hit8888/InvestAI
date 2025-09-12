import React from 'react';
import Lottie from 'lottie-react';
import confettiAnimation from '../assets/confetti.json';

interface ConfettiAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ isActive, onComplete }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="relative w-80 h-80">
        <Lottie
          animationData={confettiAnimation}
          loop={false}
          autoplay={true}
          onComplete={onComplete}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
};
