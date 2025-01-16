import CustomPageHeader from '../components/CustomPageHeader';
import withPageViewWrapper from '../pages/PageViewWrapper';
import PlaygroundIcons from '@breakout/design-system/components/icons/playground-icons';
import { PAGE_HEADER_TITLE_ICON_PROPS } from '../utils/constants';

const PlaygroundPage = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-start gap-6 self-stretch">
        <CustomPageHeader headerTitle="Playground" headerIcon={<PlaygroundIcons {...PAGE_HEADER_TITLE_ICON_PROPS} />} />
        <div className="flex h-64 flex-col items-start gap-4 self-stretch rounded-2xl border border-primary/10 p-4"></div>
      </div>
      <div></div>
    </div>
  );
};

export default withPageViewWrapper(PlaygroundPage);
