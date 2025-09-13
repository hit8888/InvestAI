type LogoImageProps = {
  src?: string;
  placeholderText?: string;
};

const LogoImage = ({ src, placeholderText }: LogoImageProps) => {
  if (!src && !placeholderText) {
    return null;
  }

  if (!src && placeholderText) {
    return (
      <div
        className="flex h-full w-full items-center justify-center rounded-full bg-purple-100 text-purple-600"
        style={{ aspectRatio: '1/1' }}
      >
        <span className="text-sm font-semibold">{placeholderText.charAt(0)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      className="h-full w-full rounded-full object-cover"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};

export default LogoImage;
