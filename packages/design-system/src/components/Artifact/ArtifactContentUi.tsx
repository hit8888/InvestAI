import {
  FormArtifactContent,
  FormArtifactMetadataType,
  SlideArtifactContent,
  SlideImageArtifactContent,
  VideoArtifactContent,
  ArtifactContentWithMetadataProps,
  AdditionalCalendarArtifactContent,
} from '@neuraltrade/core/types/artifact';
import SlideArtifact from './SlideArtifact';
import VideoArtifact from './VideoArtifact';
import { CalendarArtifact } from './CalendarArtifact';
import { SendUserMessageParams } from '@neuraltrade/core/types/webSocketData';
import QualificationFlowArtifact from './QualificationFlow/QualificationFlowArtifact';
import FormArtifact from '../layout/FormArtifact';
import { ViewType } from '@neuraltrade/core/types/common';

interface Props {
  viewType: ViewType;
  artifactType: string | undefined;
  artifactContent: ArtifactContentWithMetadataProps;
  activeArtifactId: string;
  logoURL: string;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  isMediaTakingFullWidth: boolean;
  handleToggleFullScreen: () => void;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
  onSlideItemClick: (title: string) => void;
  isQualificationFormArtifact?: boolean;
  activeArtifactResponseId?: string;
}

export const ArtifactContentUi = ({
  artifactType,
  logoURL,
  artifactContent,
  activeArtifactId,
  handleSendUserMessage,
  isMediaTakingFullWidth,
  handleToggleFullScreen,
  setIsArtifactPlaying,
  onSlideItemClick,
  isQualificationFormArtifact,
  viewType,
  activeArtifactResponseId,
}: Props) => {
  if (!artifactType || !artifactContent) {
    return null;
  }

  switch (artifactType) {
    case 'SLIDE':
      return (
        <SlideArtifact
          logoURL={logoURL}
          artifact={artifactContent as SlideArtifactContent}
          key={(artifactContent as SlideArtifactContent).title}
          onItemClick={onSlideItemClick}
        />
      );
    case 'SLIDE_IMAGE':
      return (
        <img
          key={(artifactContent as SlideImageArtifactContent).image_url}
          src={(artifactContent as SlideImageArtifactContent).image_url}
          alt="Slide"
          className="h-full w-full object-contain"
        />
      );
    case 'VIDEO':
      return (
        <VideoArtifact
          key={(artifactContent as VideoArtifactContent).video_url}
          videoUrl={(artifactContent as VideoArtifactContent).video_url}
          artifactId={activeArtifactId}
          handleToggleFullScreen={handleToggleFullScreen}
          setIsArtifactPlaying={setIsArtifactPlaying}
          handleSendUserMessage={handleSendUserMessage}
          isMediaTakingFullWidth={isMediaTakingFullWidth}
        />
      );
    case 'CALENDAR':
      return (
        <CalendarArtifact
          key={(artifactContent as AdditionalCalendarArtifactContent).calendar_url}
          calendarContent={artifactContent as AdditionalCalendarArtifactContent}
          handleSendUserMessage={handleSendUserMessage}
          artifactResponseId={activeArtifactResponseId}
        />
      );
    case 'FORM':
      if (isQualificationFormArtifact) {
        return (
          <QualificationFlowArtifact
            artifact={{
              artifact_id: activeArtifactId,
              content: artifactContent as FormArtifactContent,
              metadata: artifactContent.metadata as FormArtifactMetadataType,
              ctaEvent: artifactContent.ctaEvent,
              response_id: activeArtifactResponseId,
            }}
            handleSendUserMessage={handleSendUserMessage}
          />
        );
      } else {
        return (
          <FormArtifact
            artifactId={activeArtifactId}
            artifactResponseId={activeArtifactResponseId}
            artifact={artifactContent as FormArtifactContent}
            artifactMetadata={artifactContent.metadata as FormArtifactMetadataType}
            handleSendUserMessage={handleSendUserMessage}
            viewType={viewType}
          />
        );
      }
    default:
      return null;
  }
};
