import { useState } from 'react';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@breakout/design-system/components/layout/dialog';
import SlideArtifact from '../../Artifact/SlideArtifact';
import { SlideArtifactContent, SlideImageArtifactContent } from '@meaku/core/types/artifact';
import CommonArtifactPreview from './CommonArtifactPreview';
import { ViewType } from '@meaku/core/types/common';

interface IProps {
  handleArtifactOnClick: () => void;
  isFetching: boolean;
  title?: string;
  artifactType: 'SLIDE' | 'SLIDE_IMAGE';
  viewType: ViewType;
  logoURL: string;
  artifactContent: SlideArtifactContent | SlideImageArtifactContent;
}

const SlideArtifactPreview = ({
  handleArtifactOnClick,
  artifactContent,
  logoURL,
  artifactType,
  isFetching,
  title,
  viewType,
}: IProps) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    if (viewType === ViewType.USER) {
      handleArtifactOnClick();
    } else if (viewType === ViewType.DASHBOARD) {
      setOpenDialog(true);
    }
  };

  const getArtifactContent = () => {
    let dialogContent;
    switch (artifactType) {
      case 'SLIDE':
        dialogContent = (
          <SlideArtifact
            logoURL={logoURL}
            artifact={artifactContent as SlideArtifactContent}
            key={(artifactContent as SlideArtifactContent).title}
            onItemClick={() => {
              //Do nothing
            }}
          />
        );
        break;
      case 'SLIDE_IMAGE':
        dialogContent = (
          <img
            key={(artifactContent as SlideImageArtifactContent)?.image_url}
            src={(artifactContent as SlideImageArtifactContent)?.image_url}
            alt="Slide"
            className="h-full w-full rounded-lg"
          />
        );
        break;
      default:
        dialogContent = null;
    }
    return dialogContent;
  };

  const showButtonDisplay = () => {
    return (
      <CommonArtifactPreview
        title={title}
        isFetching={isFetching}
        artifactType={artifactType}
        handleClick={handleOpenDialog}
      />
    );
  };
  return viewType === ViewType.USER ? (
    <>{showButtonDisplay()}</>
  ) : (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{showButtonDisplay()}</DialogTrigger>
      <DialogContent className="bg-white sm:min-w-[1000px]">
        <DialogTitle className="text-lg font-semibold text-primary">{title}</DialogTitle>
        {openDialog ? <div className="h-full min-h-[500px] w-full rounded-lg">{getArtifactContent()}</div> : null}
      </DialogContent>
    </Dialog>
  );
};

export default SlideArtifactPreview;
