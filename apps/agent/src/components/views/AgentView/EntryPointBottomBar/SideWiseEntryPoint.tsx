import EntryPointSuggestedQuestions from '@breakout/design-system/components/layout/EntryPointSuggestedQuestions';
import InputOrb from '@breakout/design-system/components/layout/InputOrb';
import { cn } from '@breakout/design-system/lib/cn';
import useValuesFromConfigApi from '../../../../hooks/useValuesFromConfigApi';
import { EntryPointAlignment, EntryPointAlignmentType } from '@meaku/core/types/entryPoint';
import { useMessageStore } from '../../../../stores/useMessageStore';
import { useUrlParams } from '@meaku/core/hooks/useUrlParams';

type SideWiseEntryPointProps = {
  handleSuggestedQuestionOnClick: (question: string) => void;
  entryPointAlignment: EntryPointAlignmentType;
};

const SideWiseEntryPoint = ({ handleSuggestedQuestionOnClick, entryPointAlignment }: SideWiseEntryPointProps) => {
  const { initialSuggestedQuestions, invertTextColor, orbLogoUrl, showOrb } = useValuesFromConfigApi();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const { setAgentOpen } = useUrlParams();

  const showSuggestedQuestions = initialSuggestedQuestions.length > 0 && !hasFirstUserMessageBeenSent;

  const isEntryPointOnTheBottomRight = entryPointAlignment === EntryPointAlignment.RIGHT;
  const isEntryPointOnTheBottomLeft = entryPointAlignment === EntryPointAlignment.LEFT;

  const getEntryPointOrb = () => {
    return (
      <div
        className={cn('relative flex h-16 w-16 cursor-pointer items-center', {
          'right-4': isEntryPointOnTheBottomRight && hasFirstUserMessageBeenSent,
          '-left-2': isEntryPointOnTheBottomLeft && hasFirstUserMessageBeenSent,
        })}
        onClick={setAgentOpen}
      >
        <InputOrb
          style={{ width: '54px', height: '54px' }}
          showOrb={true} // Always show orb when left or right entry
          showOrbFromConfig={true} // Always show orb when left or right entry
          orbLogoUrl={showOrb ? '' : orbLogoUrl}
          showThreeStar={true}
        />
      </div>
    );
  };
  return (
    <div
      className={cn('relative flex w-full items-center p-2', {
        'justify-end': isEntryPointOnTheBottomRight && hasFirstUserMessageBeenSent,
      })}
    >
      {isEntryPointOnTheBottomLeft && <>{getEntryPointOrb()}</>}
      {!hasFirstUserMessageBeenSent && (
        <EntryPointSuggestedQuestions
          showSuggestedQuestions={showSuggestedQuestions}
          initialSuggestedQuestions={initialSuggestedQuestions}
          handleSuggestedQuestionOnClick={handleSuggestedQuestionOnClick}
          questionAlignment={entryPointAlignment}
          showOneByOne={isEntryPointOnTheBottomLeft || isEntryPointOnTheBottomRight}
          invertTextColor={invertTextColor}
        />
      )}
      {isEntryPointOnTheBottomRight && <>{getEntryPointOrb()}</>}
    </div>
  );
};

export default SideWiseEntryPoint;
