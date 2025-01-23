import { useRef, useState } from 'react';
import { useDemoConversation } from '../hooks/useDemoConversation';
import AudioRecorder from './AudioRecorder';
import { ResponsePlayer } from './components/ResponsePlayer';
import { RecordingPlayer } from './components/RecordingPlayer';
import { useAudioVisualizer } from '@meaku/core/hooks/useAudioVisualizer';
import { ResumeDemo } from './ResumeDemo';
import { useAudioCleanup } from '../../../../../hooks/useAudioCleanup';
import { IdleStateDialog } from './IdleStateDialog';
import { useDemoFlowState } from '../../../../../hooks/useDemoFlowState';
import { useResponseAudioPlayer } from '../../../../../hooks/useResponseAudioPlayer';
import { TranscriptionResult } from './types';
import { useTranscriptionHandler } from '../../../../../hooks/useTranscriptionHandler';
import { Drawer, DrawerContent } from '@breakout/design-system/components/Drawer/index';

interface Props {
  handleResumeDemo: () => void;
  isQueryRaisedRef: React.RefObject<boolean>;
  isOpen: boolean;
}

const DemoQuestionFlow = ({ handleResumeDemo, isQueryRaisedRef, isOpen }: Props) => {
  const RECORDING_RESTART_DELAY = 500;
  const { isRecording, isProcessing, isPlaying, isAskingToContinue, send } = useDemoFlowState();
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resumeDemoRef = useRef<boolean>(false);
  const messageSentRef = useRef(false);

  const [recorderKey, setRecorderKey] = useState(0);
  const { handleSendUserMessage, message } = useDemoConversation();

  const { audioContextRef, audioRef, audioSourceRef, playPromiseRef, duration } = useResponseAudioPlayer({
    audioUrl: message?.response_audio_url,
    onReceiveResponse: () => send({ type: 'RECEIVE_RESPONSE' }),
    onPlaybackComplete: () => {
      send({ type: 'PLAYBACK_COMPLETE' });
      messageSentRef.current = false;
      if (resumeDemoRef.current) {
        isQueryRaisedRef.current = false;
      }
      send({ type: 'START_RECORDING' });
    },
    setAnalyserNode,
    recordingRestartDelay: RECORDING_RESTART_DELAY,
  });

  const [transcription, setTranscription] = useState<TranscriptionResult>({
    transcript: '',
    isLoading: false,
  });

  const startRecording = () => send({ type: 'START_RECORDING' });
  const stopRecording = () => send({ type: 'STOP_RECORDING' });

  const handleContinueDemo = () => {
    handleResumeDemo();
    resumeDemoRef.current = true;
    send({ type: 'CONTINUE_DEMO' });
  };

  const handleContinueSpeaking = () => {
    // First reset the recorder key to force a new instance
    setRecorderKey((prev) => prev + 1);

    // Then reset transcription state
    setTranscription((prev) => ({
      ...prev,
      error: undefined,
      transcript: '',
      interimTranscript: '',
      isLoading: false,
    }));

    // Small delay before starting recording on new instance
    setTimeout(() => {
      send({ type: 'CONTINUE_SPEAKING' });
    }, 100);
  };

  useTranscriptionHandler({
    transcription,
    messageSentRef,
    onSendMessage: (message) => handleSendUserMessage({ message }),
    onStopRecording: () => send({ type: 'STOP_RECORDING' }),
    onNoSpeechDetected: () => send({ type: 'NO_SPEECH_DETECTED' }),
    setTranscription,
  });

  const canvasRef = useAudioVisualizer({
    analyserNode,
    audioUrl: message?.response_audio_url || '',
  });

  useAudioCleanup({
    playPromiseRef,
    audioRef,
    audioContextRef,
    audioSourceRef,
    silenceTimeoutRef,
    stopRecording: () => send({ type: 'STOP_RECORDING' }),
    messageSentRef,
    silenceDetectionActiveRef: useRef(false),
  });

  return (
    <Drawer
      open={isOpen}
      onOpenChange={() => {}} // Empty function to prevent closing
      modal={false} // Prevents modal behavior
      dismissible={false} // Prevents closing on outside click
    >
      <DrawerContent className="z-[1000] h-[200px] w-full bg-primary-foreground">
        <div className="flex h-full items-center justify-between px-8">
          {isRecording ? (
            <RecordingPlayer transcription={transcription} canvasRef={canvasRef} />
          ) : (
            <ResponsePlayer
              message={isProcessing ? "Give me a second, I'm processing your request..." : message?.message || ''}
              canvasRef={canvasRef}
              isLoading={isProcessing}
              audioDuration={duration}
              isPlaying={isPlaying}
              orientation="row"
            />
          )}
          <ResumeDemo onResume={handleContinueDemo} isPlayingResponse={isPlaying} />
        </div>
        <AudioRecorder
          key={recorderKey}
          setAnalyserNode={setAnalyserNode}
          setTranscription={setTranscription}
          isTranscribing={transcription.isLoading}
          disabled={isPlaying || isProcessing}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
        />
        <IdleStateDialog
          showContinueDialog={isAskingToContinue}
          setShowContinueDialog={() => send({ type: 'CONTINUE_DEMO' })}
          isPlayingResponse={isPlaying}
          handleContinueSpeaking={handleContinueSpeaking}
          handleContinueDemo={handleContinueDemo}
        />
      </DrawerContent>
    </Drawer>
  );
};

export { DemoQuestionFlow };
