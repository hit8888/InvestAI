import { motion } from 'framer-motion';
import { Suggestion } from './Suggestion';
import { getSuggestionItemAnimation } from '@meaku/core/utils/entryPointAnimation';
import { useSuggestedQuestionCycle } from '../../hooks/useSuggestedQuestionCycle';
import { EntryPointAlignmentType } from '@meaku/core/types/entryPoint';

type SuggestedQuestionsShowingInCycleProps = {
  questions: string[];
  showQuestions: boolean;
  onQuestionClick: (question: string) => void;
  questionAlignment: EntryPointAlignmentType;
};

const containerStyles = {
  position: 'relative' as const,
  display: 'flex',
  alignItems: 'center',
};

export const SuggestedQuestionsShowingInCycle = ({
  questions,
  showQuestions,
  onQuestionClick,
  questionAlignment,
}: SuggestedQuestionsShowingInCycleProps) => {
  const { currentQuestionIndex } = useSuggestedQuestionCycle(questions, true, showQuestions);

  const isOnlyOneQuestion = questions.length === 1;
  const singleQuestionValue = isOnlyOneQuestion ? questions[0] : questions[currentQuestionIndex];
  return (
    <div style={containerStyles}>
      <motion.div
        key={singleQuestionValue}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={isOnlyOneQuestion ? undefined : getSuggestionItemAnimation(questionAlignment)}
        className="rounded-full bg-white"
      >
        <Suggestion
          question={singleQuestionValue}
          onSuggestedQuestionOnClick={onQuestionClick}
          itemIndex={currentQuestionIndex}
          isQuestionInCycle={true} // questions are in cycle
          isEntryPointQuestion={true}
        />
      </motion.div>
    </div>
  );
};

export default SuggestedQuestionsShowingInCycle;
