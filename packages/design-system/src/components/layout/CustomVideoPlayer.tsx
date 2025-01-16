import ReactPlayer from 'react-player';

type IProps = {
    videoURL: string;
}
const CustomVideoPlayer = ({ videoURL }: IProps) => {
    return (
      <div style={{ position: 'relative', paddingTop: '56.25%' }}>
        <ReactPlayer
          url={videoURL}
          controls={true}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
    );
  };

export default CustomVideoPlayer;
