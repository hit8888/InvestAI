import React from "react";

interface IProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  url: string;
}

const FaviconImage = ({ url, ...props }: IProps) => {
  const imageSrc = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}&sz=64`;

  return <img src={imageSrc} {...props} />;
};

export default FaviconImage;
