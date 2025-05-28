import { cn } from '../../lib/cn';
import ReactPlayer from 'react-player';

type IProps = {
  videoURL: string;
  className?: string;
  allowDownload?: boolean;
  allowPictureInPicture?: boolean;
};

const CustomVideoPlayer = ({ videoURL, className, allowDownload = false, allowPictureInPicture = true }: IProps) => {
  return (
    <div className={cn('relative', className)} style={{ position: 'relative', paddingTop: '56.25%' }}>
      <ReactPlayer
        url={videoURL}
        controls
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, padding: '2px' }}
        config={{
          file: {
            attributes: {
              controlsList: `${!allowDownload ? 'nodownload' : ''}`,
              disablePictureInPicture: !allowPictureInPicture,
            },
          },
        }}
      />
    </div>
  );
};

export default CustomVideoPlayer;
