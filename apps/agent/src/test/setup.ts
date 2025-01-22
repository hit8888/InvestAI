import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { setupSpeechRecognitionMock } from './speechRecognitionMock';

// Make vi available globally
global.vi = vi;

// Setup Speech Recognition mock
setupSpeechRecognitionMock();

// Mock window.AudioContext
window.AudioContext = vi.fn().mockImplementation(() => ({
  createAnalyser: vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    frequencyBinCount: 32,
    getByteFrequencyData: vi.fn(),
    fftSize: 256,
    smoothingTimeConstant: 0.5,
  }),
  createMediaStreamSource: vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
  close: vi.fn().mockResolvedValue(undefined),
  state: 'running',
}));

// Mock MediaStream
global.MediaStream = vi.fn().mockImplementation(() => ({
  getTracks: vi.fn().mockReturnValue([]),
}));

afterEach(() => {
  cleanup();
});
