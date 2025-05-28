import { initFormSubmissionDetection } from "./form-submission-detector";
import { initDomElementClickDetection } from "./dom-element-click-detector";
import { TrackingConfigType } from "../lib/types";

export function initDomDetectors(trackingConfig: TrackingConfigType) {
  const { track_form_submissions, track_clicks, element_selectors } =
    trackingConfig;

  initFormSubmissionDetection({ track_form_submissions });
  initDomElementClickDetection({ track_clicks, element_selectors });
}
