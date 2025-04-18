import NotFoundImage from '../../../assets/notfound.svg';
import Typography from '../Typography';

const Custom404 = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <img src={NotFoundImage} alt="404-image" className="w-[40%]" />
      <Typography className="mt-4" variant="title-18" textColor="textPrimary">
        Oops! The page you’re looking for doesn’t exist.
      </Typography>
    </div>
  );
};

export default Custom404;
