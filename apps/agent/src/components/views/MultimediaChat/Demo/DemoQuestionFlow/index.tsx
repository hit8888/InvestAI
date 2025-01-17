import { useEffect, useRef, useState } from 'react';
import { TranscriptionResult } from './types';
import { useDemoConversation } from '../hooks/useDemoConversation';
import AudioRecorder from './AudioRecorder';
import { AudioWithTextPlayer } from './AudioWithTextPlayer';
import { Dialog, DialogContent } from '@breakout/design-system/components/layout/dialog';
import Button from '@breakout/design-system/components/layout/button';
import { useAudioVisualizer } from '@meaku/core/hooks/useAudioVisualizer';
import { ResumeDemo } from './ResumeDemo';
import { useAudioCleanup } from '../../../../../hooks/useAudioCleanup';

interface Props {
  handleResumeDemo: () => void;
  isQueryRaisedRef: React.RefObject<boolean>;
}

const DemoQuestionFlow = ({ handleResumeDemo, isQueryRaisedRef }: Props) => {
  const RECORDING_RESTART_DELAY = 500; // 500ms before restarting recording

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [isPlayingResponse, setIsPlayingResponse] = useState(false);
  const [showSpeakingWarning, setShowSpeakingWarning] = useState(false);
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resumeDemoRef = useRef<boolean>(false);

  const hasPlayedResponseRef = useRef(false);
  const messageSentRef = useRef(false);

  const { handleSendUserMessage, message } = useDemoConversation();

  const [transcription, setTranscription] = useState<TranscriptionResult>({
    transcript: '',
    isLoading: false,
  });

  const canvasRef = useAudioVisualizer({
    analyserNode,
    audioUrl: message?.response_audio_url || '',
  });

  // Ensure recording only starts when appropriate
  const startRecording = () => {
    if (!isPlayingResponse && !isWaitingForResponse) {
      messageSentRef.current = false;
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };
  // Modified transcription handler to handle the full error string
  useEffect(() => {
    if (transcription.transcript && !transcription.isLoading && !isWaitingForResponse && !messageSentRef.current) {
      // Mark message as sent
      messageSentRef.current = true;

      // Stop recording first
      stopRecording();
      setIsRecording(false);

      // Then update UI state
      setIsWaitingForResponse(true);
      hasPlayedResponseRef.current = false;

      // Send message and clear transcription
      handleSendUserMessage({ message: transcription.transcript });

      // Clear transcription after sending
      setTranscription((prev) => ({ ...prev, transcript: '' }));
    } else if (
      (transcription.error?.includes('no-speech') || transcription.error === 'Speech recognition error: no-speech') &&
      !showContinueDialog &&
      !isPlayingResponse
    ) {
      // Show continue dialog when no-speech error occurs
      console.log('Showing continue dialog due to no speech');
      setShowContinueDialog(true);
      stopRecording();
      // Reset transcription error state
      setTranscription((prev) => ({
        ...prev,
        error: undefined,
      }));
    }
  }, [transcription, isWaitingForResponse, isPlayingResponse]);

  // Modified autostart effect to be more strict
  useEffect(() => {
    if (!isPlayingResponse && !isWaitingForResponse) {
      startRecording();
    } else {
      stopRecording(); // Ensure recording stops in both states
    }
  }, [isPlayingResponse, isWaitingForResponse]);

  // Add a ref to track active silence detection
  const silenceDetectionActiveRef = useRef(false);

  // Add audioContext ref for visualizer
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  // Better handling of response audio
  useEffect(() => {
    if (message?.response_audio_url) {
      stopRecording();
      setIsRecording(false);
      setIsWaitingForResponse(false);
      setShowContinueDialog(false);
      setIsPlayingResponse(true);

      // Define handleResponsePlayEnd before try block so it's accessible in cleanup
      const handleResponsePlayEnd = () => {
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        setAnalyserNode(null);
        messageSentRef.current = false;
        setIsPlayingResponse(false);
        hasPlayedResponseRef.current = true;

        if (resumeDemoRef.current) {
          isQueryRaisedRef.current = false;
        }

        setTimeout(() => {
          if (!isPlayingResponse && !isWaitingForResponse) {
            startRecording();
          }
        }, RECORDING_RESTART_DELAY);
      };

      try {
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audioRef.current = audio;

        // Create new audio context
        const context = new AudioContext();
        audioContextRef.current = context;

        const analyzer = context.createAnalyser();
        analyzer.fftSize = 256;

        audio.src = message.response_audio_url;
        audio.load();

        // Set up audio pipeline when ready
        audio.oncanplaythrough = () => {
          if (audio && context) {
            // Disconnect old source if it exists
            if (audioSourceRef.current) {
              audioSourceRef.current.disconnect();
            }

            audioSourceRef.current = context.createMediaElementSource(audio);
            audioSourceRef.current.connect(analyzer);
            analyzer.connect(context.destination);
            setAnalyserNode(analyzer);

            playPromiseRef.current = audio.play();
          }
        };

        // Only need one event listener for audio end
        audio.addEventListener('ended', handleResponsePlayEnd);
      } catch (error) {
        console.error('Error setting up audio:', error);
      }

      // Simplified cleanup that only handles event listener
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleResponsePlayEnd);
        }
      };
    }
  }, [message?.response_audio_url]);

  const handleContinueDemo = () => {
    handleResumeDemo();
    setShowContinueDialog(false);
    resumeDemoRef.current = true;
  };

  // Add a key counter for AudioRecorder remounting
  const [recorderKey, setRecorderKey] = useState(0);

  const handleContinueSpeaking = () => {
    setShowContinueDialog(false);
    // Reset error state and transcription
    setTranscription((prev) => ({
      ...prev,
      error: undefined,
      transcript: '',
      interimTranscript: '',
      isLoading: false,
    }));

    // Increment key to force remount of AudioRecorder
    setRecorderKey((prev) => prev + 1);

    // Small delay before starting recording on new instance
    setTimeout(() => {
      startRecording();
    }, 100);
  };

  // Replace multiple cleanup effects with single hook
  useAudioCleanup({
    playPromiseRef,
    audioRef,
    audioContextRef,
    audioSourceRef,
    silenceTimeoutRef,
    stopRecording,
    messageSentRef,
    silenceDetectionActiveRef,
  });

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <ResumeDemo onResume={handleContinueDemo} isPlayingResponse={isPlayingResponse} />
      <div className="relative flex h-[92%] w-full flex-col items-center justify-center">
        <AudioWithTextPlayer
          message={
            isWaitingForResponse ? 'Processing your question...' : isPlayingResponse ? message?.message || '' : '' // Change this to empty string to let component handle display logic
          }
          transcription={transcription}
          canvasRef={canvasRef}
          isRecording={isRecording && !isPlayingResponse && !isWaitingForResponse}
          isLoading={isWaitingForResponse}
        />
      </div>
      <AudioRecorder
        key={recorderKey} // Add key prop to force remount
        setAnalyserNode={setAnalyserNode}
        setIsRecording={setIsRecording}
        setTranscription={setTranscription}
        isTranscribing={transcription.isLoading}
        disabled={isPlayingResponse || isWaitingForResponse}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
      />
      {/* Warning Dialog - Position at top */}
      <Dialog open={showSpeakingWarning} onOpenChange={setShowSpeakingWarning}>
        <DialogContent className="fixed left-1/2 top-4 w-[420px] -translate-x-1/2 bg-white p-4">
          <div className="p-4">Please wait for the current message to finish playing</div>
        </DialogContent>
      </Dialog>
      {/* Continue Demo Dialog - Style it as a modal */}
      <Dialog open={showContinueDialog && !isPlayingResponse} onOpenChange={setShowContinueDialog}>
        <DialogContent className="fixed left-1/2 top-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 bg-white p-4">
          <div className="p-4">
            <h3 className="mb-4 text-xl font-semibold">Would you like to continue the demo?</h3>
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={handleContinueSpeaking}>Continue Speaking</Button>
              <Button onClick={handleContinueDemo}>Continue Demo</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { DemoQuestionFlow };
