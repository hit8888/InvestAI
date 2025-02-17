import { ArrowUpRight, Image } from 'lucide-react';
import { cn } from '@breakout/design-system/lib/cn';
import { useState } from 'react';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@breakout/design-system/components/layout/dialog';
import SlideArtifact from '../Artifact/SlideArtifact';
import { SlideArtifactContent, SlideImageArtifactContent } from '@meaku/core/types/artifact';

interface IProps {
  handleArtifactOnClick: () => void;
  isFetching: boolean;
  title?: string;
  artifactType: 'SLIDE' | 'SLIDE_IMAGE';
  usingForAgent: boolean;
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
  usingForAgent,
}: IProps) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    if (usingForAgent) {
      handleArtifactOnClick();
    } else {
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
      <button
        onClick={handleOpenDialog}
        className="mt-2 w-full flex-col gap-1 rounded-xl border border-primary/20 bg-primary-foreground p-2 transition-colors duration-300 ease-in-out hover:bg-primary/20"
      >
        <div className="flex items-center justify-between">
          <div className="mr-2 flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-xl bg-primary/10">
            <Image className="text-primary/70" height={22} width={22} />
          </div>
          {isFetching ? (
            <div className="h-4 w-full animate-pulse rounded-lg bg-primary/40" />
          ) : (
            <div
              className={cn('flex flex-1 flex-col items-start text-left', {
                'space-y-1': title,
                'space-y-6': !title,
              })}
            >
              {title && <h4 className="2xl:text-md text-base font-medium text-primary/80 lg:text-sm">{title}</h4>}
            </div>
          )}
          <div className="ml-2 flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full bg-primary/10">
            <ArrowUpRight className="text-primary/70" height={16} width={16} />
          </div>
        </div>
      </button>
    );
  };
  return usingForAgent ? (
    <>{showButtonDisplay()}</>
  ) : (
    <Dialog>
      <DialogTrigger asChild>{showButtonDisplay()}</DialogTrigger>
      <DialogContent className="bg-primary-foreground/80 sm:min-w-[1200px]">
        <DialogTitle className="text-lg font-semibold text-primary">{title}</DialogTitle>
        {openDialog ? <div className="h-full w-full rounded-lg">{getArtifactContent()}</div> : null}
      </DialogContent>
    </Dialog>
  );
};

export default SlideArtifactPreview;
