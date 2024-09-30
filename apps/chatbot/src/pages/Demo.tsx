import Backdrop from "@meaku/ui/components/layout/backdrop";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ChatParams } from "../types/msc";

const Demo = () => {
  const { orgName = "", agentId = "" } = useParams<ChatParams>();

  const iframeSrc = useMemo(() => {
    if (typeof document === "undefined") return;
    if (!orgName || !agentId) return;
    const baseUrl = window.location.origin;
    return `${baseUrl}/org/${orgName}/agent/${agentId}`;
  }, [agentId, orgName]);

  return (
    <div className="ui-h-screen">
      <Backdrop className="ui-flex ui-items-center ui-justify-center">
        <div className="ui-flex ui-h-4/5 ui-w-11/12 ui-flex-col ui-overflow-hidden ui-rounded-xl ui-bg-white lg:ui-w-10/12 xl:ui-w-9/12">
          {iframeSrc && (
            <iframe
              src={iframeSrc}
              className="ui-h-full ui-w-full"
              title="Embedded Content"
            />
          )}
        </div>
      </Backdrop>
    </div>
  );
};

export default Demo;
