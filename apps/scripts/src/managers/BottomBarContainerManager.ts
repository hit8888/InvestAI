import { WIDGET_IDS, Z_INDEX } from "../agent/lib/constants";
import type { AllResponsiveSizes, CollapsedSizes } from "../agent/lib/types";

export function BottomBarContainerManager(
  responsiveSizes?: AllResponsiveSizes,
  deviceType?: "DESKTOP" | "TABLET",
  containerId?: string | null,
) {
  const createContainer = (): HTMLDivElement => {
    // Check if container already exists
    const existingContainer = document.getElementById(
      WIDGET_IDS.CHAT_CONTAINER,
    );
    if (existingContainer) {
      return existingContainer as HTMLDivElement;
    }

    const container = document.createElement("div");
    container.id = WIDGET_IDS.CHAT_CONTAINER;

    const currentDeviceType = deviceType || "DESKTOP";
    const sizes = responsiveSizes?.[currentDeviceType]?.COLLAPSED;

    Object.assign(container.style, {
      position: "fixed",
      bottom: "10px",
      transform: "translateX(-50%)",
      left: "50%",
      zIndex: containerId ? Z_INDEX.WIDGET_EMBEDDED : Z_INDEX.WIDGET_BOTTOM,
      width: sizes
        ? (sizes as CollapsedSizes).CENTER_WIDTH_MESSAGE_SENT
        : "440px",
      pointerEvents: "auto",
      display: containerId ? "none" : "block",
    });
    document.body.appendChild(container);
    return container;
  };

  // Return public API
  return {
    createContainer,
  };
}
