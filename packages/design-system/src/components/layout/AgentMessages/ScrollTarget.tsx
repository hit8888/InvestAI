import React from 'react';

type ScrollTargetProps = {
  refProp: React.RefObject<HTMLDivElement | null>;
  position: 'start' | 'end';
  keyPrefix: string;
};

const ScrollTarget = ({ refProp, position, keyPrefix }: ScrollTargetProps) => (
  <div
    key={`${keyPrefix}-${position}`}
    ref={refProp}
    style={{
      height: '1px',
      [position === 'start' ? 'marginTop' : 'marginBottom']: -32,
    }}
  />
);

export default ScrollTarget;
