import { SVGProps } from 'react';
import { MessageSquareMore } from 'lucide-react';

const MessageSquare = (props: SVGProps<SVGSVGElement>) => {
  return (
    <MessageSquareMore
      height={props.height}
      width={props.width}
      color={props.color}
      className={props.className}
      {...props}
    />
  );
};

export default MessageSquare;
