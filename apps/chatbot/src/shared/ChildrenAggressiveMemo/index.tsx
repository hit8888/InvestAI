import React, { PropsWithChildren } from 'react';

const ChildrenComponent = ({ children }: PropsWithChildren) => <>{children}</>;
const ChildrenAggressiveMemo = React.memo(ChildrenComponent, () => true);

export default ChildrenAggressiveMemo;
