import { FC, ReactElement } from "react";
import { IAllApiResponses } from "../ApiProvider/types";
import { Loader } from "lucide-react";

import useLocalStorageSession from "../../../hooks/useLocalStorageSession";
import { useParams } from "react-router-dom";
import { ChatParams } from "@meaku/core/types/config";

interface Props {
    children: (props: IAllApiResponses) => ReactElement;
}

const PreloadContainer: FC<Props> = ({ children }) => {
    const { orgName = "", agentId = "" } = useParams<ChatParams>();
    const { sessionData } = useLocalStorageSession();
    const { data: config } = useConfigDataQuery({ forceFetch: false, orgName, agentId, sessionId: sessionData?.sessionId ?? "" });
    const { session } = useInitializeSessionData();

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
