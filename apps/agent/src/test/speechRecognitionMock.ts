/* eslint-disable @typescript-eslint/no-explicit-any */
class MockSpeechRecognition {
  continuous = false;
  interimResults = false;
  onstart: (() => void) | null = null;
  onresult: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onend: (() => void) | null = null;

  start() {
    this.onstart?.();
  }

  stop() {
    this.onend?.();
  }

  // Helper method to simulate speech recognition results
  simulateResult(transcript: string, isFinal: boolean = true) {
    if (this.onresult) {
      const event = {
        results: [
          [
            {
              transcript,
              isFinal,
            },
          ],
        ],
        resultIndex: 0,
      };
      this.onresult(event);
    }
  }

  // Helper method to simulate errors
  simulateError(errorType: string) {
    if (this.onerror) {
      this.onerror({ error: errorType, message: `Speech recognition error: ${errorType}` });
    }
  }
}

export const setupSpeechRecognitionMock = () => {
  // @ts-expect-error: mocking SpeechRecognition for testing purposes
  global.window.SpeechRecognition = MockSpeechRecognition;
  // @ts-expect-error: mocking webkitSpeechRecognition for testing purposes
  global.window.webkitSpeechRecognition = MockSpeechRecognition;
};
