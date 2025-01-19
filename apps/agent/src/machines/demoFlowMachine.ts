import { createMachine } from 'xstate';

//Refer this url to see visualizer https://stately.ai/viz/ca68a6a7-cbd4-4f85-94be-0326cf6209c6
export enum DemoFlowState {
  IDLE = 'idle',
  RECORDING = 'recording',
  PROCESSING = 'processing',
  PLAYING = 'playing',
  ASKING_TO_CONTINUE = 'askingToContinue',
}

export type DemoFlowEvent =
  | { type: 'START_RECORDING' }
  | { type: 'STOP_RECORDING' }
  | { type: 'TRANSCRIPTION_COMPLETE' }
  | { type: 'RECEIVE_RESPONSE' }
  | { type: 'PLAYBACK_COMPLETE' }
  | { type: 'NO_SPEECH_DETECTED' }
  | { type: 'CONTINUE_SPEAKING' }
  | { type: 'CONTINUE_DEMO' };

export type DemoFlowContext = {
  transcript: string;
  responseAudioUrl?: string;
};

//Add gaurds and services later in this machine (TODO: KK)
//Service for async logic and gaurds for sync utils
export const demoFlowMachine = createMachine({
  id: 'demoFlow',
  initial: DemoFlowState.IDLE,
  context: {} as DemoFlowContext,
  types: {
    context: {} as DemoFlowContext,
    events: {} as DemoFlowEvent,
  },
  states: {
    [DemoFlowState.IDLE]: {
      on: {
        START_RECORDING: DemoFlowState.RECORDING,
      },
    },
    [DemoFlowState.RECORDING]: {
      on: {
        STOP_RECORDING: DemoFlowState.PROCESSING,
        NO_SPEECH_DETECTED: DemoFlowState.ASKING_TO_CONTINUE,
      },
    },
    [DemoFlowState.PROCESSING]: {
      on: {
        RECEIVE_RESPONSE: DemoFlowState.PLAYING,
      },
    },
    [DemoFlowState.PLAYING]: {
      on: {
        PLAYBACK_COMPLETE: DemoFlowState.IDLE,
      },
    },
    [DemoFlowState.ASKING_TO_CONTINUE]: {
      on: {
        CONTINUE_SPEAKING: DemoFlowState.RECORDING,
        CONTINUE_DEMO: DemoFlowState.IDLE,
      },
    },
  },
});
