import SlidePreviewIcon from '../components/icons/SlidePreviewIcon';
import VideoPreviewIcon from '../components/icons/VideoPreviewIcon';
import DemoPreviewIcon from '../components/icons/DemoPreviewIcon';

export const ARTIFACT_CONFIG = {
  SLIDE: {
    header: 'Slide',
    icon: SlidePreviewIcon,
  },
  SLIDE_IMAGE: {
    header: 'Slide',
    icon: SlidePreviewIcon,
  },
  VIDEO: {
    header: 'Video',
    icon: VideoPreviewIcon,
  },
  DEMO: {
    header: 'Demo',
    icon: DemoPreviewIcon,
  },
} as const;
