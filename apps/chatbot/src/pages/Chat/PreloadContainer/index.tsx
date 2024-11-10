import { FC, ReactElement } from "react";
import { IAllApiResponses } from "../ApiProvider/types";
import { Loader } from "lucide-react";

import useLocalStorageSession from "../../../hooks/useLocalStorageSession";
import { useParams } from "react-router-dom";
import { ChatParams } from "@meaku/core/types/config";
import useConfigDataQuery from "@meaku/core/queries/useConfigDataQuery";
import useInitializeSessionDataQuery from "@meaku/core/queries/useInitializeSessionDataQuery";
import useIsAdmin from "../../../hooks/useIsAdmin";
import { getBrowserSignature } from "../../../utils/tracking";
import { SessionConfigResponseType } from "@meaku/core/managers/UnifiedSessionConfigResponseManager";

interface Props {
    children: (props: IAllApiResponses) => ReactElement;
}

const PreloadContainer: FC<Props> = ({ children }) => {
    const { agentId = "" } = useParams<ChatParams>();
    const { sessionData } = useLocalStorageSession();
    const { isAdmin } = useIsAdmin();

    const config = useConfigDataQuery({ agentId, queryOptions: { enabled: !sessionData?.sessionId } });
    const initializeSessionPayload = { is_admin: isAdmin, session_id: sessionData.sessionId, prospect_id: sessionData.prospectId, browser_signature: getBrowserSignature() }
    const session = useInitializeSessionDataQuery({ agentId, initializeSessionPayload, queryOptions: { enabled: !!agentId && !!(sessionData.sessionId) } });//TODO: When ignoreUpdatingLocalStorage is unset

    //TODO: How do we handle errors? 

    if (
        config.data ||
        session.data
    ) {
        return children({
            unifiedConfigurationResponse: (session.data || config.data) as SessionConfigResponseType,
        });
    }

    return <Loader />;
};

export default PreloadContainer;
