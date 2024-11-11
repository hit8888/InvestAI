import { FC, ReactElement } from "react";
import { IAllApiResponsesWithQuery } from "../ApiProvider/types";
import { Loader } from "lucide-react";
import { AxiosError } from "axios";

import useLocalStorageSession from "../../../hooks/useLocalStorageSession";
import { useParams } from "react-router-dom";
import { ChatParams } from "@meaku/core/types/config";
import useConfigDataQuery from "@meaku/core/queries/useConfigDataQuery";
import useInitializeSessionDataQuery from "@meaku/core/queries/useInitializeSessionDataQuery";
import useIsAdmin from "../../../hooks/useIsAdmin";
import { getBrowserSignature } from "../../../utils/tracking";
import { SessionConfigResponseType } from "@meaku/core/managers/UnifiedSessionConfigResponseManager";

interface Props {
    children: (props: IAllApiResponsesWithQuery) => ReactElement;
}

const PreloadContainer: FC<Props> = ({ children }) => {
    const { agentId = "" } = useParams<ChatParams>();
    const { sessionData } = useLocalStorageSession();
    const { isAdmin } = useIsAdmin();

    const configQuery = useConfigDataQuery({
        agentId,
        queryOptions: { enabled: !sessionData?.sessionId },
    });

    const initializeSessionPayload = {
        is_admin: isAdmin,
        session_id: sessionData.sessionId,
        prospect_id: sessionData.prospectId,
        browser_signature: getBrowserSignature(),
    };

    const sessionQuery = useInitializeSessionDataQuery({
        agentId,
        initializeSessionPayload,
        queryOptions: { enabled: !!agentId && !!sessionData.sessionId },
    }); //TODO: When ignoreUpdatingLocalStorage is unset


    const firstQueryWithError = [configQuery, sessionQuery].find(
        (query) => query.error,
    );

    //Handle localstorage using session data
    if (firstQueryWithError?.error) {
        if (firstQueryWithError.isFetching) {
            return <Loader />; //Fix styling
        }

        const internalAPIError = firstQueryWithError.error as AxiosError<Error>;
        return <>{JSON.stringify({ internalAPIError })}</>; //TODO: How do we handle errors? Log errors here
    }

    if (configQuery.data || sessionQuery.data) {
        return children({
            unifiedConfigurationResponse: (sessionQuery.data ||
                configQuery.data) as SessionConfigResponseType,
            configQuery,
            sessionQuery,
        });
    }

    return <Loader />;
};

export default PreloadContainer;
