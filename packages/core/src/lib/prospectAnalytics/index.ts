import { detectElementClicks, watchForNewElements } from './domDetectors/elementClickDetector';
import { detectFormSubmissions, watchForNewForms } from './domDetectors/formSubmissionDetector';
import type { TrackingConfigType } from '../../types/api/configuration_response';
import type { UpdateProspectPayload } from '../../types/api/update_prospect_request';

function initDomElementClickDetection(
  trackingConfig: TrackingConfigType,
  onSubmit: (requestData: UpdateProspectPayload) => void,
) {
  const { track_clicks, element_selectors } = trackingConfig;
  const cleanupFunctions: (() => void)[] = [];

  if (track_clicks) {
    const clickCleanup = detectElementClicks(element_selectors, onSubmit);
    const watchCleanup = watchForNewElements(element_selectors, onSubmit);
    cleanupFunctions.push(clickCleanup, watchCleanup);
  }

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}

function initFormSubmissionDetection(
  trackingConfig: TrackingConfigType,
  onSubmit: (requestData: UpdateProspectPayload) => void,
) {
  const { track_form_submissions } = trackingConfig;
  const cleanupFunctions: (() => void)[] = [];

  if (track_form_submissions) {
    const formCleanup = detectFormSubmissions(onSubmit);
    const watchCleanup = watchForNewForms(onSubmit);
    cleanupFunctions.push(formCleanup, watchCleanup);
    // detectProgrammaticSubmissions();
  }

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}

export function initProspectAnalytics(
  trackingConfig: TrackingConfigType,
  onSubmit: (requestData: UpdateProspectPayload) => void,
) {
  const elementCleanup = initDomElementClickDetection(trackingConfig, onSubmit);
  const formCleanup = initFormSubmissionDetection(trackingConfig, onSubmit);

  // Return a single cleanup function that cleans up everything
  return () => {
    elementCleanup();
    formCleanup();
  };
}
