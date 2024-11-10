import { FC, ReactElement } from "react";
import { IAllApiResponses } from "../ApiProvider/types";
import { Loader } from "lucide-react";

import useLocalStorageSession from "../../../hooks/useLocalStorageSession";
import { useParams } from "react-router-dom";
import { ChatParams } from "@meaku/core/types/config";
import useConfigDataQuery from "@meaku/core/queries/useConfigDataQuery";
import useInitializeSessionDataQuery from "@meaku/core/queries/useInitializeSessionDataQuery";

interface Props {
    children: (props: IAllApiResponses) => ReactElement;
}

const PreloadContainer: FC<Props> = ({ children }) => {
    const { agentId = "" } = useParams<ChatParams>();
    const { sessionData } = useLocalStorageSession();
    const { data: config } = useConfigDataQuery({ agentId, queryOptions: { enabled: !!sessionData?.sessionId } });
    const { session } = useInitializeSessionDataQuery({ agentId, });

    if (
        userProfile.data &&
        tripDetails.data &&
        airSeatMap.data &&
        airSelectedItineraryResponse &&
        listBookingPaymentSourcesResponse.data &&
        travelersInfo
    ) {
        return children({
            traveler: userProfile.data,
            tripDetailsResponse: tripDetails.data,
            airSeatMapResponse: airSeatMap.data,
            airSelectedItineraryResponse,
            listBookingPaymentSourcesResponse: listBookingPaymentSourcesResponse.data,
            travelerInfoForPaymentSources: travelersInfo.travelers,
        });
    }

    return <Loader />;
};

export default PreloadContainer;
