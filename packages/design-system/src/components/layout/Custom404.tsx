import NotFoundImage from '../../../assets/notfound.svg';

const Custom404 = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <img src={NotFoundImage} alt="404-image" className="w-[40%]" />
      <p className="mt-4 text-xl">Oops! The page you’re looking for doesn’t exist.</p>
      <p className="mt-4 text-xl">
        Possible Error Cause: <span className="font-medium">{errorMessage}</span>
      </p>
    </div>
  );
};

export default Custom404;
