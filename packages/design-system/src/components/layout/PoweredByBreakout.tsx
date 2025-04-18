import Typography from '../Typography';

const PoweredByBreakout = () => {
  return (
    <div className="flex items-center justify-center">
      <a href="https://getbreakout.ai" target="_blank" rel="noopener noreferrer">
        <Typography
          variant="caption-12-normal"
          className="hover:text-gray-500 hover:underline hover:decoration-solid hover:underline-offset-auto"
          textColor="gray400"
        >
          Powered by Breakout
        </Typography>
      </a>
    </div>
  );
};

export default PoweredByBreakout;
