import { ListBookingPaymentSourcesResponse, ITraveler, IAirSeatMapResponse, IAirSearchResponse } from 'obt-common';
import { GetTripDetailsResponse } from 'obt-common/types/api/v1/obt/trip/trip_details';
import { AirBookTravelerInfo1 } from 'obt-common/types/api/v2/obt/model/air-book-traveler-info1';

export interface IAllApiResponses {
  traveler: ITraveler;
  tripDetailsResponse: GetTripDetailsResponse;
  airSeatMapResponse: IAirSeatMapResponse;
  airSelectedItineraryResponse: IAirSearchResponse;
  listBookingPaymentSourcesResponse: ListBookingPaymentSourcesResponse;
  travelerInfoForPaymentSources: AirBookTravelerInfo1[];
}
