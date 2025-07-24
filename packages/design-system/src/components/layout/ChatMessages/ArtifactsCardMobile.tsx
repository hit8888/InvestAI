import { ARTIFACT_CONFIG } from '../../../utils/constant';
import Typography from '../../Typography';
import { ArtifactEnum } from '@meaku/core/types/index';
import { Dialog, DialogContent, DialogTrigger } from '@breakout/design-system/components/layout/dialog';
import { useState } from 'react';

interface ArtifactsCardMobileProps {
  artifactType: ArtifactEnum;
  title: string;
  children: React.ReactNode;
}

const ArtifactsCardMobile = ({ artifactType, title, children }: ArtifactsCardMobileProps) => {
  const { icon: Icon } = ARTIFACT_CONFIG[artifactType as keyof typeof ARTIFACT_CONFIG];
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpenChange = (open: boolean) => {
    if (artifactType === 'VIDEO') return;
    setIsDialogOpen(open);
  };

  const getDialogContent = () => {
    return children;
  };

  const getDialogTrigger = () => {
    return (
      <div className="flex max-w-lg flex-col items-start justify-center gap-2 rounded-lg border border-gray-300 bg-transparent_gray_3 p-2 ring-system">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-transparent_gray_3 p-1">
            <Icon className="text-gray-600" height={18} width={18} />
          </div>
          <Typography variant="label-14-medium" textColor="textPrimary">
            {title}
          </Typography>
        </div>
        <div className="flex h-48 w-full rounded border border-gray-200 p-0.5 md:h-72">{children}</div>
      </div>
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>{getDialogTrigger()}</DialogTrigger>
      <DialogContent className="w-[95%] max-w-full bg-white !p-0 h-sm:h-48">
        {isDialogOpen ? (
          <div className="h-[95vh] w-full rounded-lg bg-white h-md:h-full">{getDialogContent()}</div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ArtifactsCardMobile;
