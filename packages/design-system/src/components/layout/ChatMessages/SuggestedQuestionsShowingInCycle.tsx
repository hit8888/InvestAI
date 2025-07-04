import { motion } from 'framer-motion';
import { Suggestion } from './Suggestion';
import { getSuggestionItemAnimation } from '@meaku/core/utils/entryPointAnimation';
import { EntryPointAlignmentType } from '@meaku/core/types/entryPoint';
import { useCycle } from '../../../hooks/useCycle';

type SuggestedQuestionsShowingInCycleProps = {
  questions: string[];
  showQuestions: boolean;
  onQuestionClick: (question: string) => void;
  questionAlignment: EntryPointAlignmentType;
  invertTextColor?: boolean;
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
  invertTextColor,
}: SuggestedQuestionsShowingInCycleProps) => {
  const questionsLength = questions.length;
  const { currentItemIndex } = useCycle({ itemsLength: questionsLength, showItems: showQuestions });

  const isOnlyOneQuestion = questionsLength === 1;
  const singleQuestionValue = isOnlyOneQuestion ? questions[0] : questions[currentItemIndex];
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
          itemIndex={currentItemIndex}
          isQuestionInCycle={true} // questions are in cycle
          isEntryPointQuestion={true}
          invertTextColor={invertTextColor}
          tooltipSide="bottom"
        />
      </motion.div>
    </div>
  );
};

export default SuggestedQuestionsShowingInCycle;
