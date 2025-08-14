import {
  ENTRY_POINT_LEFT_MAP,
  ENTRY_POINT_RIGHT_MAP,
  ENTRY_POINT_TRANSFORM_MAP,
} from "../agent/lib/constants";
import type {
  AllResponsiveSizes,
  CollapsedSizes,
  EntryPointAlignmentType,
  ResponsiveSizes,
} from "../agent/lib/types";

export function StyleManager(
  responsiveSizes?: AllResponsiveSizes,
  getDeviceType?: () => "DESKTOP" | "TABLET",
) {
  let resizeHandler: (() => void) | null = null;

  const getResponsiveSize = (
    deviceType: "DESKTOP" | "TABLET",
    isCollapsed: boolean,
  ): ResponsiveSizes | CollapsedSizes => {
    if (!responsiveSizes) {
      throw new Error("ResponsiveSizes not provided to StyleManager");
    }
    const sizes = responsiveSizes[deviceType];
    return isCollapsed ? sizes.COLLAPSED : sizes.DEFAULT;
  };

  const adjustResponsiveStyles = (
    container: HTMLElement,
    isAgentOpen: boolean,
    hideBottomBar: boolean,
    showBanner: boolean,
    cycleCompleted: boolean,
    entryPointAlignment: EntryPointAlignmentType,
    hasFirstUserMessageBeenSent: boolean,
  ): void => {
    const deviceType = getDeviceType ? getDeviceType() : "DESKTOP";
    const sizes = getResponsiveSize(deviceType, !isAgentOpen);

    const isMobile = deviceType === "TABLET";
    let width: string, height: string;

    const isSidewiseEntryPoint = entryPointAlignment !== "center";
    if (!isAgentOpen) {
      if (hideBottomBar) {
        width = "0";
        height = "0";
      } else {
        width = hasFirstUserMessageBeenSent
          ? isSidewiseEntryPoint
            ? (sizes as CollapsedSizes).SIDEWISE_WIDTH_MESSAGE_SENT
            : (sizes as CollapsedSizes).CENTER_WIDTH_MESSAGE_SENT
          : isSidewiseEntryPoint
            ? cycleCompleted
              ? (sizes as CollapsedSizes).SIDEWISE_WIDTH_INITIAL_CYCLE_COMPLETED
              : (sizes as CollapsedSizes).SIDEWISE_WIDTH_INITIAL
            : (sizes as CollapsedSizes).CENTER_WIDTH_INITIAL;

        height = showBanner
          ? isSidewiseEntryPoint
            ? (sizes as CollapsedSizes).SIDEWISE_HEIGHT_WITH_BUBBLE
            : (sizes as CollapsedSizes).CENTER_HEIGHT_WITH_BUBBLE
          : hasFirstUserMessageBeenSent
            ? isSidewiseEntryPoint
              ? (sizes as CollapsedSizes).SIDEWISE_HEIGHT_MESSAGE_SENT
              : (sizes as CollapsedSizes).CENTER_HEIGHT_MESSAGE_SENT
            : isSidewiseEntryPoint
              ? (sizes as CollapsedSizes).SIDEWISE_HEIGHT
              : (sizes as CollapsedSizes).CENTER_HEIGHT;
      }
    } else {
      width = (sizes as ResponsiveSizes).WIDTH;
      height = (sizes as ResponsiveSizes).HEIGHT;
    }

    const styles: Partial<CSSStyleDeclaration> = {
      width,
      height,
      transition: "transform 0.3s ease",
      maxWidth: "100vw",
      maxHeight: "100vh",
    };

    Object.assign(styles, {
      bottom: "0",
      left: ENTRY_POINT_LEFT_MAP[entryPointAlignment] ?? "50%",
      right: ENTRY_POINT_RIGHT_MAP[entryPointAlignment] ?? "auto",
      transform:
        ENTRY_POINT_TRANSFORM_MAP[entryPointAlignment] ?? "translateX(-50%)",
      borderRadius: isMobile ? "0" : "12px",
    });

    Object.assign(container.style, styles);
  };

  const setupResizeListener = (
    container: HTMLElement,
    getStyleParams: () => {
      isAgentOpen: boolean;
      hideBottomBar: boolean;
      showBanner: boolean;
      cycleCompleted: boolean;
      entryPointAlignment: EntryPointAlignmentType;
      hasFirstUserMessageBeenSent: boolean;
    },
  ): void => {
    // Remove existing listener if any
    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
    }

    resizeHandler = () => {
      const params = getStyleParams();
      adjustResponsiveStyles(
        container,
        params.isAgentOpen,
        params.hideBottomBar,
        params.showBanner,
        params.cycleCompleted,
        params.entryPointAlignment,
        params.hasFirstUserMessageBeenSent,
      );
    };

    window.addEventListener("resize", resizeHandler);
  };

  const removeResizeListener = (): void => {
    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
      resizeHandler = null;
    }
  };

  // Return public API
  return {
    getResponsiveSize,
    adjustResponsiveStyles,
    setupResizeListener,
    removeResizeListener,
    ENTRY_POINT_LEFT_MAP,
    ENTRY_POINT_RIGHT_MAP,
    ENTRY_POINT_TRANSFORM_MAP,
  };
}
