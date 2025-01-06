import Backdrop from '@breakout/design-system/components/layout/backdrop';
import { AgentParams } from '@meaku/core/types/config';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const Demo = () => {
  const { orgName = '', agentId = '' } = useParams<AgentParams>();

  const iframeSrc = useMemo(() => {
    if (typeof document === 'undefined') return;
    if (!orgName || !agentId) return;
    const baseUrl = window.location.origin;
    return `${baseUrl}/org/${orgName}/agent/${agentId}`;
  }, [agentId, orgName]);

  return (
    <div className="h-screen">
      <Backdrop className="flex items-center justify-center">
        <div className="flex h-4/5 w-11/12 flex-col overflow-hidden rounded-xl bg-white lg:w-10/12 xl:w-9/12">
          {iframeSrc && <iframe src={iframeSrc} className="h-full w-full" title="Embedded Content" />}
        </div>
      </Backdrop>
    </div>
  );
};

export default Demo;
