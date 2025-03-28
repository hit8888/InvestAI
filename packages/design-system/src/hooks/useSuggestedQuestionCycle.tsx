import { SUGGESTED_QUESTIONS_INTERVAL_DURATION_IN_CYCLE_IN_MS } from '@meaku/core/constants/index';
import { useState, useEffect } from 'react';

export const useSuggestedQuestionCycle = (
  questions: string[],
  isEnabled: boolean,
  showQuestions: boolean,
  intervalDuration = SUGGESTED_QUESTIONS_INTERVAL_DURATION_IN_CYCLE_IN_MS,
) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (isEnabled && showQuestions) {
      const interval = setInterval(() => {
        setCurrentQuestionIndex((prev) => (prev < questions.length - 1 ? prev + 1 : 0));
      }, intervalDuration);

      return () => clearInterval(interval);
    }
  }, [isEnabled, showQuestions, questions.length, intervalDuration]);

  return { currentQuestionIndex };
};
