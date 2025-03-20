import { motion } from 'framer-motion';
import { cn } from '@breakout/design-system/lib/cn';
import { Suggestion } from '@breakout/design-system/components/layout/Suggestion';
import { floatingAnimation, suggestionContainerAnimation, suggestionItemAnimation } from './animation';

type EntryPointSuggestedQuestionsProps = {
  showSuggestedQuestions: boolean;
  initialSuggestedQuestions: string[];
  handleSuggestedQuestionOnClick: (question: string) => void;
  showBouncingEffect: boolean | undefined;
};

const EntryPointSuggestedQuestions = ({
  showSuggestedQuestions,
  initialSuggestedQuestions,
  handleSuggestedQuestionOnClick,
  showBouncingEffect,
}: EntryPointSuggestedQuestionsProps) => {
  return (
    <motion.div variants={showBouncingEffect ? floatingAnimation : undefined} initial="initial" animate="animate">
      <motion.div
        variants={suggestionContainerAnimation}
        initial="initial"
        animate="animate"
        className={cn(
          'flex items-center justify-end gap-4 overflow-hidden transition-[width] duration-150 ease-in-out',
          {
            'w-0': !showSuggestedQuestions,
            'max-w-[800px]': showSuggestedQuestions,
          },
        )}
      >
        {showSuggestedQuestions &&
          initialSuggestedQuestions.map((question, index) => (
            <motion.div
              key={question}
              variants={suggestionItemAnimation}
              className="rounded-full bg-white"
              key-={index}
            >
              <Suggestion
                question={question}
                onSuggestedQuestionOnClick={handleSuggestedQuestionOnClick}
                itemIndex={index}
              />
            </motion.div>
          ))}
      </motion.div>
    </motion.div>
  );
};

export default EntryPointSuggestedQuestions;
