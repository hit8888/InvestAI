import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@breakout/design-system/components/layout/dialog';
import { useState } from 'react';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import SlideArtifactPreview from './SlideArtifactPreview.tsx';
import CustomVideoPlayer from '../CustomVideoPlayer.tsx';
import {
  ArtifactEnum,
  ArtifactPreviewEnum,
  CalendarArtifactContent,
  FormArtifactContent,
  FormArtifactMetadataType,
  SlideArtifactContent,
  SlideImageArtifactContent,
  VideoArtifactContent,
  ArtifactContentWithMetadataProps,
  AdditionalCalendarArtifactContent,
} from '@meaku/core/types/artifact';
import { ArtifactBaseType } from '@meaku/core/types/webSocketData';
import CommonArtifactPreview from './CommonArtifactPreview.tsx';
import ArrowRight from '../../icons/ArrowRight.tsx';
import { ViewType } from '@meaku/core/types/common';
import FormArtifact from '../FormArtifact.tsx';
import QualificationFlowArtifact from '../../Artifact/QualificationFlow/QualificationFlowArtifact.tsx';
import CalendarArtifactPreview from './CalendarArtifactPreview.tsx';
import { CalendarArtifact } from '../../Artifact/CalendarArtifact.tsx';
import { EMPTY_FUNCTION } from '@meaku/core/constants/index';
interface IProps {
  viewType: ViewType;
  artifactId: string;
  logoURL: string | null;
  artifactType?: ArtifactEnum;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  title?: string;
  artifactContent?:
    | SlideImageArtifactContent
    | SlideArtifactContent
    | VideoArtifactContent
    | FormArtifactContent
    | CalendarArtifactContent;
  isError?: boolean;
  isFetching?: boolean;
  isQualificationFormArtifact: boolean;
  artifactContentWithMetadata: ArtifactContentWithMetadataProps | null;
}

const ArtifactPreview = ({
  viewType,
  artifactId,
  artifactType,
  setDemoPlayingStatus,
  setActiveArtifact,
  logoURL,
  title,
  artifactContent,
  isError = false,
  isFetching = false,
  isQualificationFormArtifact,
  artifactContentWithMetadata,
}: IProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleArtifactOnClick = () => {
    setDemoPlayingStatus(DemoPlayingStatus.INITIAL);
    setActiveArtifact({
      artifact_id: artifactId,
      artifact_type: artifactType ?? 'NONE',
    });

    const dialogEnabledArtifactTypes = ['VIDEO', 'FORM', 'CALENDAR'];
    if (dialogEnabledArtifactTypes.includes(artifactType ?? '') && viewType !== ViewType.USER) {
      setIsDialogOpen(true);
    }
  };

  if (isError) return null;

  if (artifactType === 'SLIDE' || artifactType === 'SLIDE_IMAGE') {
    return (
      <SlideArtifactPreview
        artifactType={artifactType}
        logoURL={logoURL ?? ''}
        artifactContent={artifactContent as SlideImageArtifactContent | SlideArtifactContent}
        viewType={viewType}
        isFetching={isFetching}
        handleArtifactOnClick={handleArtifactOnClick}
        title={title}
      />
    );
  }

  const showArtifactPreviewButtonDisplay = () => {
    if (artifactType === 'FORM') {
      return <QualificationQuestionFormPreview handleClick={handleArtifactOnClick} />;
    } else if (artifactType === 'CALENDAR') {
      return <CalendarArtifactPreview handleClick={handleArtifactOnClick} />;
    }
    return (
      <CommonArtifactPreview
        title={title}
        isFetching={isFetching}
        artifactType={artifactType as keyof typeof ArtifactPreviewEnum}
        handleClick={handleArtifactOnClick}
      />
    );
  };

  const showFormContent = () => {
    let formContent = null;
    if (isQualificationFormArtifact) {
      formContent = (
        <QualificationFlowArtifact
          artifact={{
            artifact_id: artifactId,
            content: artifactContentWithMetadata as FormArtifactContent,
            metadata: artifactContentWithMetadata?.metadata as FormArtifactMetadataType,
          }}
          handleSendUserMessage={EMPTY_FUNCTION}
          viewType={viewType}
        />
      );
    } else {
      formContent = (
        <FormArtifact
          artifactId={artifactId}
          artifact={artifactContentWithMetadata as FormArtifactContent}
          artifactMetadata={artifactContentWithMetadata?.metadata as FormArtifactMetadataType}
          handleSendUserMessage={EMPTY_FUNCTION}
          viewType={viewType}
        />
      );
    }

    return <div className="flex h-full w-full items-center justify-center">{formContent}</div>;
  };

  const getDialogContent = () => {
    switch (artifactType) {
      case 'VIDEO': {
        const videoURL = (artifactContent as VideoArtifactContent)?.video_url;
        return (
          <CustomVideoPlayer videoURL={videoURL} className="h-full w-full rounded ring-2 ring-inset ring-gray-500" />
        );
      }
      case 'CALENDAR': {
        return (
          <CalendarArtifact
            calendarContent={artifactContent as AdditionalCalendarArtifactContent}
            handleSendUserMessage={EMPTY_FUNCTION}
          />
        );
      }
      case 'FORM':
        return showFormContent();
      default:
        return null;
    }
  };

  return viewType === ViewType.USER ? (
    <>{showArtifactPreviewButtonDisplay()}</>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{showArtifactPreviewButtonDisplay()}</DialogTrigger>
      <DialogContent className="bg-white sm:min-w-[70vw]">
        {title && <DialogTitle className="text-lg font-semibold text-primary">{title}</DialogTitle>}
        {isDialogOpen ? <div className="h-full w-full rounded-lg">{getDialogContent()}</div> : null}
      </DialogContent>
    </Dialog>
  );
};

const QualificationQuestionFormPreview = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <div
      tabIndex={0}
      onClick={handleClick}
      className="flex w-full max-w-[424px] cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-transparent_gray_3 p-2 ring-system hover:bg-transparent_gray_6"
    >
      <p className="pl-2 text-base font-semibold text-customPrimaryText">Additional Information</p>
      <div className="flex items-center justify-center rounded-lg border border-gray-600 p-2">
        <ArrowRight className="text-gray-600" width="16" height="16" />
      </div>
    </div>
  );
};

export default ArtifactPreview;
