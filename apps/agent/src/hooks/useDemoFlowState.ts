import { useMachine } from '@xstate/react';
import { demoFlowMachine, DemoFlowState } from '../machines/demoFlowMachine';

export const useDemoFlowState = () => {
  const [state, send] = useMachine(demoFlowMachine);

  const isRecording = state.matches(DemoFlowState.RECORDING);
  const isProcessing = state.matches(DemoFlowState.PROCESSING);
  const isPlaying = state.matches(DemoFlowState.PLAYING);
  const isAskingToContinue = state.matches(DemoFlowState.ASKING_TO_CONTINUE);

  return {
    state,
    isRecording,
    isProcessing,
    isPlaying,
    isAskingToContinue,
    send,
  };
};
