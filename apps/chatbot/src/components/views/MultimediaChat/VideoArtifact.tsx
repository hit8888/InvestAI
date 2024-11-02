interface IProps {
  videoUrl: string;
}

const VideoArtifact = (props: IProps) => {
  const { videoUrl } = props;

  if (!videoUrl) return null;

  return (
    <div className="ui-h-full ui-w-full">
      <video
        className="ui-h-full ui-w-full ui-object-cover"
        controls
        autoPlay={true}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoArtifact;
