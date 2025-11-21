import React, { useState } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChatInterface } from '@sevak/client';

interface SevakChatWidgetProps {
  serverUrl?: string;
}

export const SevakChatWidget: React.FC<SevakChatWidgetProps> = ({
  serverUrl = import.meta.env.VITE_SEVAK_SERVER_URL || 'http://localhost:7777',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Button state - simple fade */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="button"
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: {
                duration: 0.3,
                ease: 'easeInOut',
              },
            }}
            className="fixed bottom-4 left-1/2 z-50 flex items-center justify-center"
            style={{
              transform: 'translateX(-50%)',
              transformOrigin: 'center center',
            }}
          >
            {/* Rotating gradient glow effect behind button */}
            <motion.div
              className="pointer-events-none absolute rounded-full opacity-50 blur-[20px]"
              style={{
                width: '64px',
                height: '64px',
                left: '0',
                top: '0',
                zIndex: 0,
                background: 'conic-gradient(from 0deg, #8b5cf6, #db2777, #f97316, #8b5cf6)',
              }}
              animate={{
                rotate: [0, 360],
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                rotate: {
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatType: 'loop',
                },
                exit: { duration: 0.3 },
              }}
            />
            <button
              onClick={() => setIsOpen(true)}
              className="group relative z-10 flex h-16 w-16 items-center justify-center overflow-visible rounded-full border-2 border-white/25 bg-white/10 shadow-[0_8px_32px_0_rgba(139,92,246,0.3),0_4px_16px_0_rgba(219,39,119,0.2),inset_0_1px_0_0_rgba(255,255,255,0.4)] backdrop-blur-2xl transition-all hover:scale-110 hover:border-white/35 hover:bg-white/15 hover:shadow-[0_12px_48px_0_rgba(139,92,246,0.4),0_6px_24px_0_rgba(219,39,119,0.3),inset_0_1px_0_0_rgba(255,255,255,0.5)]"
              style={{
                boxShadow: `
              0 8px 32px 0 rgba(139, 92, 246, 0.3),
              0 4px 16px 0 rgba(219, 39, 119, 0.2),
              0 2px 8px 0 rgba(249, 115, 22, 0.15),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
              inset 0 -1px 0 0 rgba(0, 0, 0, 0.05)
            `,
                backdropFilter: 'blur(20px) saturate(180%)',
                transformOrigin: 'center center', // Expand from center
              }}
              aria-label="Open chat assistant"
              type="button"
            >
              {/* Animated dust particles in random ellipses */}
              <div className="pointer-events-none absolute inset-0">
                <svg
                  className="h-full w-full overflow-visible"
                  viewBox="0 0 100 100"
                  style={{ width: '140%', height: '140%', margin: '-20%' }}
                >
                  {/* Particles moving in random elliptical orbits */}
                  {[...Array(12)].map((_, i) => {
                    // Random ellipse parameters for each particle
                    const ellipseA = 30 + (i % 4) * 5; // Semi-major axis
                    const ellipseB = 20 + (i % 3) * 4; // Semi-minor axis
                    const ellipseAngle = i * 30 * (Math.PI / 180); // Rotation of ellipse
                    const initialPhase = i * 25 * (Math.PI / 180); // Starting position
                    const rotationSpeed = 2.5 + (i % 3) * 0.8; // Speed variation - faster rotation

                    return (
                      <motion.circle
                        key={`particle-${i}`}
                        cx="50"
                        cy="50"
                        r={1.2 + (i % 2) * 0.4}
                        fill={`url(#particleGradient${(i % 3) + 1})`}
                        initial={{
                          opacity: 0.5,
                        }}
                        animate={{
                          // Elliptical motion using parametric equations
                          cx: Array.from({ length: 8 }, (_, j) => {
                            const t = (j / 8) * Math.PI * 2 + initialPhase;
                            const x = ellipseA * Math.cos(t);
                            const y = ellipseB * Math.sin(t);
                            // Rotate ellipse
                            const rotatedX = x * Math.cos(ellipseAngle) - y * Math.sin(ellipseAngle);
                            return 50 + rotatedX;
                          }),
                          cy: Array.from({ length: 8 }, (_, j) => {
                            const t = (j / 8) * Math.PI * 2 + initialPhase;
                            const x = ellipseA * Math.cos(t);
                            const y = ellipseB * Math.sin(t);
                            // Rotate ellipse
                            const rotatedY = x * Math.sin(ellipseAngle) + y * Math.cos(ellipseAngle);
                            return 50 + rotatedY;
                          }),
                          opacity: [0.4, 0.9, 0.4],
                          scale: [0.8, 1.3, 0.8],
                        }}
                        transition={{
                          duration: rotationSpeed,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: (i % 4) * 0.2,
                        }}
                        style={{
                          filter: 'blur(0.8px)',
                        }}
                      />
                    );
                  })}

                  {/* Gradient definitions */}
                  <defs>
                    <radialGradient id="particleGradient1" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="1" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    </radialGradient>
                    <radialGradient id="particleGradient2" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#db2777" stopOpacity="1" />
                      <stop offset="100%" stopColor="#db2777" stopOpacity="0.4" />
                    </radialGradient>
                    <radialGradient id="particleGradient3" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="1" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Chat icon */}
              <MessageCircle
                className="relative z-10 h-7 w-7 text-white transition-transform group-hover:scale-110"
                style={{
                  filter:
                    'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))',
                }}
              />

              {/* Light glassmorphic shine effect */}
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-white/5 to-transparent" />
              <div className="via-white/3 pointer-events-none absolute inset-[1px] rounded-full bg-gradient-to-t from-transparent to-white/10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always mount ChatInterface to maintain WebSocket connection */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat"
            initial={{
              opacity: 0,
              scale: 0.1,
              x: '-50%',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: '-50%',
            }}
            exit={{
              opacity: 0,
              scale: 0.1,
              x: '-50%',
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className="fixed bottom-4 left-1/2 z-50"
            style={{
              transformOrigin: 'bottom center',
            }}
          >
            <div
              className={`relative z-10 flex flex-col overflow-hidden ${
                isMinimized ? 'h-16 w-80' : 'h-[600px] w-96'
              } rounded-[20px] bg-white shadow-2xl transition-all duration-300 ease-in-out`}
            >
              {/* Header with minimize/close buttons */}
              <div
                className="flex items-center justify-between rounded-t-[20px] border-b border-white/30 bg-white/20 px-4 py-3 backdrop-blur-2xl"
                style={{
                  boxShadow: `
                    0 8px 32px 0 rgba(139, 92, 246, 0.1),
                    0 4px 16px 0 rgba(219, 39, 119, 0.08),
                    0 1px 0 0 rgba(255, 255, 255, 0.3) inset,
                    0 -1px 0 0 rgba(0, 0, 0, 0.1) inset
                  `,
                  backdropFilter: 'blur(20px) saturate(180%)',
                }}
              >
                <h3 className="text-sm font-semibold text-gray-900">Sevak</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="rounded-md p-1.5 text-gray-700 transition-all hover:bg-white/30 hover:text-gray-900"
                    aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                    type="button"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsMinimized(false);
                    }}
                    className="rounded-md p-1.5 text-gray-700 transition-all hover:bg-white/30 hover:text-gray-900"
                    aria-label="Close chat"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Chat Interface - always mounted, only hidden when minimized */}
              <div className={`flex flex-1 flex-col overflow-hidden bg-white ${isMinimized ? 'hidden' : ''}`}>
                <ChatInterface
                  serverUrl={serverUrl}
                  placeholder="Ask me anything about the dashboard..."
                  showConnectionStatus={false}
                  className="h-full flex-1"
                  navigate={navigate}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
